import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import {
  SLUG_PATTERN,
  bannerSchema,
  categorySchema,
  destinationSchema,
  footerSchema,
  gallerySchema,
  homepageSchema,
  navigationSchema,
  packageSchema,
  reviewSchema,
  siteSettingsSchema,
  staticPageSchema,
} from "@/content/schemas";
import type {
  Banner,
  Category,
  ContentTree,
  Destination,
  Gallery,
  Review,
  StaticPage,
  TravelPackage,
} from "@/types/content";
import {
  RESERVED_SLUGS,
  STATIC_PAGE_SLUGS,
  categoryHref,
  destinationHref,
  listRoutes,
  normalizePath,
  packageHref,
} from "./routes";
import { IssueCollector, describeZodIssue, formatFieldPath, type ContentIssue } from "./validation";
import { publish } from "./visibility";

export interface LoadOptions {
  /** Absolute path of the content/ folder. */
  contentRoot: string;
  /** Absolute path of the public/ folder, used to verify image references. */
  publicDir: string;
}

export interface LoadResult {
  /** Null only when a required file (settings, navigation, footer, homepage) could not be read. */
  tree: ContentTree | null;
  issues: ContentIssue[];
}

const IGNORED_FILES = new Set(["README.md", ".gitkeep", ".DS_Store", "Thumbs.db"]);
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|svg)$/i;

export function loadContent({ contentRoot, publicDir }: LoadOptions): LoadResult {
  const issues = new IssueCollector();
  const projectRoot = path.dirname(contentRoot);
  const display = (abs: string) => path.relative(projectRoot, abs).split(path.sep).join("/");
  const known = new Set<string>();

  const subdirs = (dir: string) =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
      : [];
  const jsonFiles = (dir: string) =>
    fs.existsSync(dir)
      ? fs
          .readdirSync(dir, { withFileTypes: true })
          .filter((d) => d.isFile() && d.name.endsWith(".json"))
          .map((d) => d.name)
          .sort()
      : [];

  function read<S extends z.ZodType>(abs: string, schema: S, required = true): z.output<S> | undefined {
    const file = display(abs);
    known.add(abs);
    if (!fs.existsSync(abs)) {
      if (required) issues.error(file, "Required file is missing");
      return undefined;
    }
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(abs, "utf8").replace(/^﻿/, ""));
    } catch (err) {
      issues.error(file, `Invalid JSON — ${(err as Error).message}`);
      return undefined;
    }
    const result = schema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.error(file, describeZodIssue(issue), formatFieldPath(issue.path));
      }
      return undefined;
    }
    return result.data;
  }

  /** The folder/file name is the slug; an explicit "slug" field must agree with it. */
  function checkSlug(abs: string, name: string, explicit: string | undefined, kind: string): boolean {
    if (!SLUG_PATTERN.test(name)) {
      issues.error(
        display(abs),
        `${kind} name "${name}" is not a valid slug — use lowercase letters, numbers and hyphens (e.g. "kashmir-delight")`,
      );
      return false;
    }
    if (explicit !== undefined && explicit !== name) {
      issues.error(display(abs), `slug "${explicit}" does not match the ${kind.toLowerCase()} name "${name}"`, "slug");
      return false;
    }
    return true;
  }

  // Detects two pieces of content claiming the same URL (and categories shadowing reserved routes).
  const routeOwners = new Map<string, string>(RESERVED_SLUGS.map((s) => [`/${s}/`, "a built-in page"]));
  function claimRoute(route: string, abs: string): boolean {
    const owner = routeOwners.get(route);
    if (owner) {
      issues.error(display(abs), `Duplicate slug — the URL ${route} is already used by ${owner}`);
      return false;
    }
    routeOwners.set(route, display(abs));
    return true;
  }

  const p = (...parts: string[]) => path.join(contentRoot, ...parts);

  // ── Singletons ──────────────────────────────────────────────────────────────
  const settings = read(p("settings", "site.json"), siteSettingsSchema);
  const navigation = read(p("navigation", "header.json"), navigationSchema);
  const footer = read(p("navigation", "footer.json"), footerSchema);
  const homepage = read(p("homepage", "home.json"), homepageSchema);

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories: Category[] = [];
  for (const slug of subdirs(p("categories"))) {
    const abs = p("categories", slug, "category.json");
    const data = read(abs, categorySchema);
    if (!data || !checkSlug(abs, slug, data.slug, "Folder")) continue;
    if (!claimRoute(categoryHref(slug), abs)) continue;
    categories.push({ ...data, slug, href: categoryHref(slug) });
  }
  const categorySlugs = new Set(categories.map((c) => c.slug));

  // ── Destinations & packages ─────────────────────────────────────────────────
  const destinations: Destination[] = [];
  const packages: TravelPackage[] = [];
  for (const categorySlug of subdirs(p("destinations"))) {
    if (!categorySlugs.has(categorySlug)) {
      issues.error(
        display(p("destinations", categorySlug)),
        `No matching category — create content/categories/${categorySlug}/category.json or move this folder`,
      );
      continue;
    }
    for (const slug of subdirs(p("destinations", categorySlug))) {
      const abs = p("destinations", categorySlug, slug, "destination.json");
      const data = read(abs, destinationSchema);
      if (!data || !checkSlug(abs, slug, data.slug, "Folder")) continue;
      const href = destinationHref(categorySlug, slug);
      if (!claimRoute(href, abs)) continue;
      destinations.push({ ...data, slug, categorySlug, href, packageCount: 0, startingPrice: null });

      const packagesDir = p("destinations", categorySlug, slug, "packages");
      for (const fileName of jsonFiles(packagesDir)) {
        const pkgAbs = path.join(packagesDir, fileName);
        const pkgSlug = fileName.replace(/\.json$/, "");
        const pkg = read(pkgAbs, packageSchema);
        if (!pkg || !checkSlug(pkgAbs, pkgSlug, pkg.slug, "File")) continue;
        const pkgHref = packageHref(categorySlug, slug, pkgSlug);
        if (!claimRoute(pkgHref, pkgAbs)) continue;
        packages.push({
          ...pkg,
          slug: pkgSlug,
          categorySlug,
          destinationSlug: slug,
          destinationTitle: data.title,
          href: pkgHref,
        });
      }
    }
  }

  // ── Collections (one file per item; the file name is the id) ────────────────
  function collection<S extends z.ZodType>(folder: string, schema: S) {
    const items: (z.output<S> & { id: string })[] = [];
    for (const fileName of jsonFiles(p(folder))) {
      const abs = p(folder, fileName);
      const id = fileName.replace(/\.json$/, "");
      const data = read(abs, schema);
      if (data && checkSlug(abs, id, undefined, "File")) items.push({ ...data, id });
    }
    return items;
  }
  const reviews: Review[] = collection("reviews", reviewSchema);
  const banners: Banner[] = collection("banners", bannerSchema);
  const galleries: Gallery[] = collection("galleries", gallerySchema);
  const pages: StaticPage[] = collection("pages", staticPageSchema).map(({ id, ...page }) => ({ ...page, slug: id }));

  for (const slug of STATIC_PAGE_SLUGS) {
    if (!pages.some((pg) => pg.slug === slug)) issues.error(display(p("pages", `${slug}.json`)), "Required file is missing");
  }
  for (const pg of pages) {
    if (!(STATIC_PAGE_SLUGS as readonly string[]).includes(pg.slug)) {
      issues.warn(
        display(p("pages", `${pg.slug}.json`)),
        `Not rendered — only ${STATIC_PAGE_SLUGS.join(", ")} have pages`,
      );
    }
  }

  // ── Unexpected files (typos such as "destinaton.json" would otherwise be ignored silently) ──
  (function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (!known.has(abs) && !IGNORED_FILES.has(entry.name)) {
        issues.error(display(abs), "Unexpected file — it is not in a location the site reads from (see docs/CONTENT_GUIDE.md)");
      }
    }
  })(contentRoot);

  if (!settings || !navigation || !footer || !homepage) {
    return { tree: null, issues: issues.issues };
  }

  const tree: ContentTree = {
    settings,
    navigation,
    footer,
    homepage,
    categories,
    destinations,
    packages,
    reviews,
    banners,
    galleries,
    pages,
  };

  crossCheck(tree, { contentRoot, publicDir, issues, display });
  return { tree, issues: issues.issues };
}

// ── Cross-file checks ─────────────────────────────────────────────────────────

interface CrossCheckContext {
  contentRoot: string;
  publicDir: string;
  issues: IssueCollector;
  display: (abs: string) => string;
}

/** Visits every string value with its dotted field path. */
function walkStrings(value: unknown, visit: (key: string, value: string, field: string) => void, field = "") {
  if (Array.isArray(value)) {
    value.forEach((v, i) => walkStrings(v, visit, `${field}[${i}]`));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      const next = field ? `${field}.${k}` : k;
      if (typeof v === "string") visit(k, v, next);
      else walkStrings(v, visit, next);
    }
  }
}

function crossCheck(tree: ContentTree, { contentRoot, publicDir, issues, display }: CrossCheckContext) {
  const p = (...parts: string[]) => display(path.join(contentRoot, ...parts));
  // Derived URLs are not authored content, so they must not be link-checked.
  const authored = <T extends { href: string }>(item: T): Partial<T> => {
    const copy: Partial<T> = { ...item };
    delete copy.href;
    return copy;
  };

  // Every content document with the file it came from.
  const documents: { file: string; data: object }[] = [
    { file: p("settings", "site.json"), data: tree.settings },
    { file: p("navigation", "header.json"), data: tree.navigation },
    { file: p("navigation", "footer.json"), data: tree.footer },
    { file: p("homepage", "home.json"), data: tree.homepage },
    ...tree.categories.map((c) => ({ file: p("categories", c.slug, "category.json"), data: authored(c) })),
    ...tree.destinations.map((d) => ({
      file: p("destinations", d.categorySlug, d.slug, "destination.json"),
      data: authored(d),
    })),
    ...tree.packages.map((pk) => ({
      file: p("destinations", pk.categorySlug, pk.destinationSlug, "packages", `${pk.slug}.json`),
      data: authored(pk),
    })),
    ...tree.reviews.map((r) => ({ file: p("reviews", `${r.id}.json`), data: r })),
    ...tree.banners.map((b) => ({ file: p("banners", `${b.id}.json`), data: b })),
    ...tree.galleries.map((g) => ({ file: p("galleries", `${g.id}.json`), data: g })),
    ...tree.pages.map((pg) => ({ file: p("pages", `${pg.slug}.json`), data: pg })),
  ];

  const published = publish(tree);
  const liveRoutes = new Set(listRoutes(published).map((r) => r.path));
  const allRoutes = new Set(listRoutes(tree).map((r) => r.path));
  const publicFileExists = (src: string) => fs.existsSync(path.join(publicDir, decodeURI(src)));

  for (const { file, data } of documents) {
    walkStrings(data, (key, value, field) => {
      // Images
      if ((key === "src" || key === "ogImage" || key === "defaultOgImage") && value.startsWith("/")) {
        if (!IMAGE_EXTENSIONS.test(value)) {
          issues.error(file, `"${value}" is not a supported image type (jpg, png, webp, avif, svg)`, field);
        } else if (!publicFileExists(value)) {
          issues.error(file, `Image not found: public${value}`, field);
        }
      }
      // Internal links
      if (key === "href" && value.startsWith("/") && !value.startsWith("//")) {
        const route = normalizePath(value);
        if (liveRoutes.has(route)) return;
        if (allRoutes.has(route)) {
          issues.error(file, `Link "${value}" points to disabled content — update or remove the link`, field);
        } else if (!publicFileExists(value.split(/[?#]/)[0] ?? value)) {
          issues.error(file, `Link "${value}" does not match any page on the site`, field);
        }
      }
    });
  }

  // Homepage references
  const home = p("homepage", "home.json");
  const sectionIds = new Set<string>();
  tree.homepage.sections.forEach((section, i) => {
    if (sectionIds.has(section.id)) issues.error(home, `Duplicate section id "${section.id}"`, `sections[${i}].id`);
    sectionIds.add(section.id);
    if (section.type === "promoBanner") {
      const banner = tree.banners.find((b) => b.id === section.bannerId);
      if (!banner) issues.error(home, `No banner content/banners/${section.bannerId}.json`, `sections[${i}].bannerId`);
      else if (!banner.enabled) issues.warn(home, `Banner "${section.bannerId}" is disabled, so this section is hidden`, `sections[${i}].bannerId`);
    }
    if (section.type === "gallery" && !tree.galleries.some((g) => g.id === section.galleryId)) {
      issues.error(home, `No gallery content/galleries/${section.galleryId}.json`, `sections[${i}].galleryId`);
    }
  });

  // Review references
  for (const review of tree.reviews) {
    const file = p("reviews", `${review.id}.json`);
    if (review.destination && !allRoutes.has(`/${review.destination}/`)) {
      issues.error(file, `No destination "${review.destination}"`, "destination");
    }
    if (review.package && !allRoutes.has(`/${review.package}/`)) {
      issues.error(file, `No package "${review.package}"`, "package");
    }
  }

  // Helpful warnings
  for (const d of published.destinations) {
    if (d.packageCount === 0) {
      issues.warn(
        p("destinations", d.categorySlug, d.slug, "destination.json"),
        "Destination has no enabled packages — its page will show an empty state",
      );
    }
  }
}
