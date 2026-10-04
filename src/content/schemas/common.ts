import { z } from "zod";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .regex(SLUG_PATTERN, "Must be lowercase letters, numbers and single hyphens (e.g. \"kashmir-delight\")");

const nonEmpty = z.string().trim().min(1, "Must not be empty");

/** Local image under /public (e.g. "/images/x.jpg") or an https URL. */
export const imageSrcSchema = z
  .string()
  .refine(
    (v) => (v.startsWith("/") && !v.startsWith("//") && !v.includes("..")) || v.startsWith("https://"),
    "Image must be a local path starting with \"/\" (e.g. \"/images/goa/hero.jpg\") or an https:// URL",
  );

export const imageSchema = z.strictObject({
  src: imageSrcSchema,
  alt: nonEmpty,
  /** CSS object-position, e.g. "50% 30%" — keeps the subject in frame when cropped. */
  focal: z.string().regex(/^\d{1,3}% \d{1,3}%$/, "Use the form \"50% 30%\"").optional(),
});

/**
 * Links allowed in content: site-relative paths, https, tel:, mailto: and in-page anchors.
 * Anything else (javascript:, data:, http:) is rejected.
 */
export const safeUrlSchema = z
  .string()
  .refine(
    (v) =>
      (v.startsWith("/") && !v.startsWith("//")) ||
      v.startsWith("#") ||
      /^https:\/\/[^\s]+$/.test(v) ||
      /^tel:\+?[0-9\s-]+$/.test(v) ||
      /^mailto:[^\s]+$/.test(v),
    "Link must start with \"/\", \"#\", \"https://\", \"tel:\" or \"mailto:\"",
  );

export const httpsUrlSchema = z.string().regex(/^https:\/\/[^\s]+$/, "Must be an https:// URL");

export const seoSchema = z.strictObject({
  title: nonEmpty.max(70, "Keep SEO titles under 70 characters"),
  description: nonEmpty.max(170, "Keep SEO descriptions under 170 characters"),
  ogImage: imageSrcSchema.optional(),
});

export const visibilityShape = {
  enabled: z.boolean().default(true),
  featured: z.boolean().default(false),
  showOnHome: z.boolean().default(false),
  displayOrder: z.number().int().default(100),
};

export const linkSchema = z.strictObject({
  label: nonEmpty,
  href: safeUrlSchema,
});

export const ctaLinkSchema = linkSchema.extend({
  variant: z.enum(["primary", "accent", "outline", "light"]).default("primary"),
});

/** Whitelisted icon names usable from JSON; mapped to components in components/common/Icon.tsx. */
export const ICON_NAMES = [
  "shield",
  "headset",
  "wallet",
  "map",
  "hotel",
  "car",
  "plane",
  "camera",
  "mountain",
  "waves",
  "sun",
  "snowflake",
  "utensils",
  "heart",
  "star",
  "users",
  "compass",
  "landmark",
  "ship",
  "sparkles",
  "tree",
  "shopping",
  "calendar",
  "badge",
] as const;
export const iconNameSchema = z.enum(ICON_NAMES);

export const paragraphsSchema = z.array(nonEmpty).min(1);

export { nonEmpty };
