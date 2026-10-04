import { z } from "zod";
import { ctaLinkSchema, linkSchema, nonEmpty, safeUrlSchema } from "./common";

export const navigationSchema = z.strictObject({
  /** When true, each enabled category is added as a dropdown listing its destinations. */
  showCategoryMenus: z.boolean().default(true),
  /** Links shown after the category menus. */
  links: z.array(linkSchema).default([]),
  cta: ctaLinkSchema.optional(),
});

export const footerSchema = z.strictObject({
  about: nonEmpty,
  columns: z
    .array(
      z.strictObject({
        title: nonEmpty,
        /** "categories" auto-lists enabled categories + destinations; "links" uses the links below. */
        source: z.enum(["links", "categories"]).default("links"),
        links: z.array(linkSchema).default([]),
      }),
    )
    .max(4),
  legal: z.array(linkSchema).default([]),
  /** "{year}" is replaced with the current year. */
  copyright: nonEmpty,
});

export const socialLinkSchema = z.strictObject({
  platform: z.enum(["instagram", "facebook", "youtube", "x", "linkedin"]),
  href: safeUrlSchema,
});
