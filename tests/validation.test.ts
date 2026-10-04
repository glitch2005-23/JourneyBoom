import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { packageSchema, safeUrlSchema } from "@/content/schemas";
import { DEST, PKG, ROOT, editJson, errorsOf, load, readJson, tempContent, writeJson } from "./helpers";

describe("shipped content", () => {
  it("is valid with no errors", () => {
    const result = load(path.join(ROOT, "content"));
    expect(errorsOf(result)).toEqual([]);
    expect(result.tree?.packages.length).toBeGreaterThanOrEqual(6);
  });
});

describe("content validation", () => {
  it("reports an invalid field with its exact file and field path", () => {
    const { contentRoot, file } = tempContent();
    editJson(file(PKG), (pkg) => ((pkg.price as Record<string, unknown>).amount = "cheap"));
    const errors = errorsOf(load(contentRoot));
    expect(errors).toContainEqual(
      expect.objectContaining({ file: `content/${PKG}`, field: "price.amount" }),
    );
  });

  it("reports missing required fields", () => {
    const { contentRoot, file } = tempContent();
    editJson(file(PKG), (pkg) => delete pkg.title);
    const errors = errorsOf(load(contentRoot));
    expect(errors).toContainEqual(
      expect.objectContaining({ file: `content/${PKG}`, field: "title", message: "Required field is missing" }),
    );
  });

  it("flags misspelled (unknown) fields", () => {
    const { contentRoot, file } = tempContent();
    editJson(file(PKG), (pkg) => (pkg.feautred = true));
    const errors = errorsOf(load(contentRoot));
    expect(errors.some((e) => e.file === `content/${PKG}` && e.message.includes('"feautred"'))).toBe(true);
  });

  it("reports malformed JSON", () => {
    const { contentRoot, file } = tempContent();
    fs.writeFileSync(file(PKG), '{ "title": "Broken", }');
    const errors = errorsOf(load(contentRoot));
    expect(errors).toContainEqual(expect.objectContaining({ file: `content/${PKG}`, message: expect.stringContaining("Invalid JSON") }));
  });

  it("detects a slug that does not match its file name", () => {
    const { contentRoot, file } = tempContent();
    editJson(file(PKG), (pkg) => (pkg.slug = "something-else"));
    expect(errorsOf(load(contentRoot))).toContainEqual(expect.objectContaining({ file: `content/${PKG}`, field: "slug" }));
  });

  it("rejects invalid slugs in folder names", () => {
    const { contentRoot, file } = tempContent();
    fs.renameSync(file("destinations/domestic/goa"), file("destinations/domestic/Goa Beaches"));
    const errors = errorsOf(load(contentRoot));
    expect(errors.some((e) => e.message.includes('"Goa Beaches" is not a valid slug'))).toBe(true);
  });

  it("detects duplicate slugs that collide with built-in pages", () => {
    const { contentRoot, file } = tempContent();
    fs.cpSync(file("categories/domestic"), file("categories/about"), { recursive: true });
    const errors = errorsOf(load(contentRoot));
    expect(errors).toContainEqual(
      expect.objectContaining({ file: "content/categories/about/category.json", message: expect.stringContaining("Duplicate slug") }),
    );
  });

  it("reports broken image references", () => {
    const { contentRoot, file } = tempContent();
    editJson(file(DEST), (d) => ((d.heroImage as Record<string, unknown>).src = "/images/missing/photo.jpg"));
    expect(errorsOf(load(contentRoot))).toContainEqual(
      expect.objectContaining({ file: `content/${DEST}`, field: "heroImage.src", message: "Image not found: public/images/missing/photo.jpg" }),
    );
  });

  it("reports internal links that match no page", () => {
    const { contentRoot, file } = tempContent();
    editJson(file("navigation/header.json"), (nav) => (nav.links = [{ label: "Blog", href: "/blog/" }]));
    expect(errorsOf(load(contentRoot))).toContainEqual(
      expect.objectContaining({ file: "content/navigation/header.json", field: "links[0].href" }),
    );
  });

  it("reports links to disabled content", () => {
    const { contentRoot, file } = tempContent();
    editJson(file("destinations/domestic/srinagar/packages/kashmir-honeymoon-retreat.json"), (p) => (p.enabled = false));
    const errors = errorsOf(load(contentRoot));
    expect(errors.some((e) => e.file === "content/banners/honeymoon-season.json" && e.message.includes("disabled content"))).toBe(true);
  });

  it("reports unexpected files and orphan destination folders", () => {
    const { contentRoot, file } = tempContent();
    writeJson(file("destinations/domestic/goa/destinaton.json"), {});
    fs.cpSync(file("destinations/international"), file("destinations/europe"), { recursive: true });
    const errors = errorsOf(load(contentRoot));
    expect(errors.some((e) => e.file.endsWith("goa/destinaton.json") && e.message.startsWith("Unexpected file"))).toBe(true);
    expect(errors.some((e) => e.file === "content/destinations/europe" && e.message.includes("No matching category"))).toBe(true);
  });

  it("reports broken homepage references", () => {
    const { contentRoot, file } = tempContent();
    editJson(file("homepage/home.json"), (home) => {
      (home.sections as Record<string, unknown>[]).push({ type: "promoBanner", id: "extra", bannerId: "nope" });
    });
    expect(errorsOf(load(contentRoot))).toContainEqual(
      expect.objectContaining({ file: "content/homepage/home.json", message: "No banner content/banners/nope.json" }),
    );
  });
});

describe("schemas", () => {
  const base = readJson(path.join(ROOT, "content", PKG));

  it("requires an https url for book and pay actions", () => {
    const result = packageSchema.safeParse({ ...base, cta: { primary: { type: "pay" } } });
    expect(result.success).toBe(false);
    expect(packageSchema.safeParse({ ...base, cta: { primary: { type: "pay", url: "https://pay.example.com/x" } } }).success).toBe(true);
  });

  it("rejects itinerary days out of order", () => {
    const itinerary = [...(base.itinerary as object[])].reverse();
    expect(packageSchema.safeParse({ ...base, itinerary }).success).toBe(false);
  });

  it("rejects unsafe link protocols", () => {
    expect(safeUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
    expect(safeUrlSchema.safeParse("http://insecure.example.com").success).toBe(false);
    expect(safeUrlSchema.safeParse("//evil.example.com").success).toBe(false);
    for (const ok of ["/domestic/", "#enquire", "https://wa.me/919876543210", "tel:+919876543210", "mailto:a@b.com"]) {
      expect(safeUrlSchema.safeParse(ok).success).toBe(true);
    }
  });
});
