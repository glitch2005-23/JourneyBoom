import path from "node:path";
import { describe, expect, it } from "vitest";
import { FileSystemContentProvider } from "@/lib/content/filesystem";
import { listRoutes, normalizePath, packageHref } from "@/lib/content/routes";
import { ContentValidationError } from "@/lib/content/validation";
import { publish, selectFeatured, selectShowOnHome, sortByDisplayOrder } from "@/lib/content/visibility";
import { DEST, PKG, PUBLIC_DIR, ROOT, editJson, load, tempContent } from "./helpers";

const provider = (contentRoot = path.join(ROOT, "content"), strict = true) =>
  new FileSystemContentProvider({ contentRoot, publicDir: PUBLIC_DIR, strict });

describe("FileSystemContentProvider", () => {
  it("looks up packages by category, destination and slug", async () => {
    const pkg = await provider().getPackage("domestic", "srinagar", "kashmir-delight");
    expect(pkg?.title).toBe("Kashmir Delight");
    expect(pkg?.href).toBe("/domestic/srinagar/kashmir-delight/");
    expect(pkg?.destinationTitle).toBe("Kashmir");
  });

  it("returns null for unknown or mismatched slugs", async () => {
    const p = provider();
    expect(await p.getPackage("domestic", "srinagar", "nope")).toBeNull();
    expect(await p.getPackage("international", "srinagar", "kashmir-delight")).toBeNull();
    expect(await p.getDestination("domestic", "dubai")).toBeNull();
    expect(await p.getCategory("Domestic")).toBeNull();
  });

  it("lists destinations of a category and computes their stats", async () => {
    const destinations = await provider().getDestinations("domestic");
    expect(destinations.map((d) => d.slug)).toEqual(["srinagar", "goa"]);
    const srinagar = destinations[0]!;
    expect(srinagar.packageCount).toBe(3);
    expect(srinagar.startingPrice).toBe(24999);
  });

  it("puts same-destination packages first in related packages", async () => {
    const p = provider();
    const pkg = (await p.getPackage("domestic", "srinagar", "kashmir-delight"))!;
    const related = await p.getRelatedPackages(pkg, 3);
    expect(related).toHaveLength(3);
    expect(related.map((r) => r.slug)).not.toContain("kashmir-delight");
    expect(related.slice(0, 2).every((r) => r.destinationSlug === "srinagar")).toBe(true);
  });

  it("filters reviews by destination (including its packages)", async () => {
    const reviews = await provider().getReviews({ destination: "domestic/srinagar" });
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews.every((r) => r.destination === "domestic/srinagar" || r.package?.startsWith("domestic/srinagar/"))).toBe(true);
  });

  it("hides disabled packages everywhere", async () => {
    const { contentRoot, file } = tempContent();
    editJson(file("destinations/domestic/srinagar/packages/great-kashmir-explorer.json"), (p) => (p.enabled = false));
    const p = provider(contentRoot);
    expect(await p.getPackage("domestic", "srinagar", "great-kashmir-explorer")).toBeNull();
    expect((await p.getAllPackages()).some((x) => x.slug === "great-kashmir-explorer")).toBe(false);
    expect((await p.getRoutes()).some((r) => r.path.includes("great-kashmir-explorer"))).toBe(false);
  });

  it("throws in strict mode when content is invalid", async () => {
    const { contentRoot, file } = tempContent();
    editJson(file(PKG), (pkg) => delete pkg.price);
    await expect(provider(contentRoot, true).getCategories()).rejects.toBeInstanceOf(ContentValidationError);
  });

  it("skips invalid files and falls back for missing images when not strict", async () => {
    const { contentRoot, file } = tempContent();
    editJson(file(PKG), (pkg) => delete pkg.price);
    editJson(file(DEST), (d) => ((d.heroImage as Record<string, unknown>).src = "/images/missing.jpg"));
    const p = provider(contentRoot, false);
    expect(await p.getPackage("domestic", "srinagar", "kashmir-delight")).toBeNull();
    const destination = await p.getDestination("domestic", "srinagar");
    expect(destination?.heroImage.src).toBe("/images/fallback.jpg");
    expect(destination?.heroImage.alt).toBeTruthy();
  });
});

describe("visibility", () => {
  const tree = load(path.join(ROOT, "content")).tree!;

  it("cascades: a disabled category hides its destinations and packages", () => {
    const disabled = { ...tree, categories: tree.categories.map((c) => (c.slug === "international" ? { ...c, enabled: false } : c)) };
    const live = publish(disabled);
    expect(live.categories.map((c) => c.slug)).toEqual(["domestic"]);
    expect(live.destinations.some((d) => d.categorySlug === "international")).toBe(false);
    expect(live.packages.some((p) => p.categorySlug === "international")).toBe(false);
  });

  it("cascades: a disabled destination hides its packages", () => {
    const disabled = { ...tree, destinations: tree.destinations.map((d) => (d.slug === "goa" ? { ...d, enabled: false } : d)) };
    expect(publish(disabled).packages.some((p) => p.destinationSlug === "goa")).toBe(false);
  });

  it("sorts by displayOrder, then title", () => {
    const sorted = sortByDisplayOrder([
      { title: "B", displayOrder: 2 },
      { title: "C", displayOrder: 1 },
      { title: "A", displayOrder: 2 },
    ]);
    expect(sorted.map((i) => i.title)).toEqual(["C", "A", "B"]);
  });

  it("orders packages by category, then destination, then their own displayOrder", () => {
    const order = publish(tree).packages.map((p) => `${p.destinationSlug}/${p.displayOrder}`);
    expect(order[0]).toBe("srinagar/1");
    expect(order.indexOf("goa/1")).toBeGreaterThan(order.indexOf("srinagar/3"));
    expect(order.indexOf("dubai/1")).toBeGreaterThan(order.indexOf("goa/2"));
  });

  it("selects featured and showOnHome items", () => {
    const items = [
      { id: 1, featured: true, showOnHome: false },
      { id: 2, featured: false, showOnHome: true },
    ];
    expect(selectFeatured(items).map((i) => i.id)).toEqual([1]);
    expect(selectShowOnHome(items).map((i) => i.id)).toEqual([2]);
  });
});

describe("routes", () => {
  it("generates every route from the folder structure", () => {
    const paths = listRoutes(publish(load(path.join(ROOT, "content")).tree!)).map((r) => r.path);
    expect(paths).toEqual(
      expect.arrayContaining([
        "/",
        "/about/",
        "/domestic/",
        "/international/",
        "/domestic/srinagar/",
        "/domestic/goa/",
        "/international/dubai/",
        "/domestic/srinagar/kashmir-delight/",
        "/international/dubai/dubai-deluxe/",
      ]),
    );
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("normalises hrefs for lookups", () => {
    expect(normalizePath("/goa")).toBe("/goa/");
    expect(normalizePath("/goa/#packages")).toBe("/goa/");
    expect(normalizePath("/#enquire")).toBe("/");
    expect(packageHref("a", "b", "c")).toBe("/a/b/c/");
  });
});
