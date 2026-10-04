import { z } from "zod";
import { ctaLinkSchema, iconNameSchema, imageSchema, linkSchema, nonEmpty, slugSchema } from "./common";

const sectionBase = {
  /** Anchor id, e.g. "packages" → /#packages */
  id: slugSchema,
  enabled: z.boolean().default(true),
};

const headingShape = {
  eyebrow: nonEmpty.optional(),
  title: nonEmpty,
  subtitle: nonEmpty.optional(),
};

export const heroSectionSchema = z.strictObject({
  type: z.literal("hero"),
  ...sectionBase,
  eyebrow: nonEmpty.optional(),
  title: nonEmpty,
  subtitle: nonEmpty,
  image: imageSchema,
  ctas: z.array(ctaLinkSchema).max(2).default([]),
  stats: z.array(z.strictObject({ value: nonEmpty, label: nonEmpty })).max(4).default([]),
});

export const featuredCategoriesSectionSchema = z.strictObject({
  type: z.literal("featuredCategories"),
  ...sectionBase,
  ...headingShape,
});

export const featuredDestinationsSectionSchema = z.strictObject({
  type: z.literal("featuredDestinations"),
  ...sectionBase,
  ...headingShape,
  /** "featured" uses destinations marked featured; "showOnHome" uses those marked showOnHome. */
  source: z.enum(["featured", "showOnHome"]).default("featured"),
  limit: z.number().int().positive().max(12).default(5),
  cta: ctaLinkSchema.optional(),
});

export const featuredPackagesSectionSchema = z.strictObject({
  type: z.literal("featuredPackages"),
  ...sectionBase,
  ...headingShape,
  source: z.enum(["featured", "showOnHome"]).default("showOnHome"),
  limit: z.number().int().positive().max(12).default(6),
  cta: ctaLinkSchema.optional(),
});

export const promoBannerSectionSchema = z.strictObject({
  type: z.literal("promoBanner"),
  ...sectionBase,
  /** File name (without .json) in content/banners/ */
  bannerId: slugSchema,
});

export const whyUsSectionSchema = z.strictObject({
  type: z.literal("whyUs"),
  ...sectionBase,
  ...headingShape,
  items: z.array(z.strictObject({ icon: iconNameSchema, title: nonEmpty, text: nonEmpty })).min(1).max(6),
});

export const gallerySectionSchema = z.strictObject({
  type: z.literal("gallery"),
  ...sectionBase,
  ...headingShape,
  /** File name (without .json) in content/galleries/ */
  galleryId: slugSchema,
});

export const reviewsSectionSchema = z.strictObject({
  type: z.literal("reviews"),
  ...sectionBase,
  ...headingShape,
  limit: z.number().int().positive().max(20).default(8),
});

export const enquirySectionSchema = z.strictObject({
  type: z.literal("enquiry"),
  ...sectionBase,
  ...headingShape,
  image: imageSchema,
  points: z.array(nonEmpty).max(5).default([]),
});

export const quickLinksSectionSchema = z.strictObject({
  type: z.literal("quickLinks"),
  ...sectionBase,
  ...headingShape,
  links: z.array(linkSchema.extend({ icon: iconNameSchema.optional() })).min(1).max(12),
});

export const homeSectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  featuredCategoriesSectionSchema,
  featuredDestinationsSectionSchema,
  featuredPackagesSectionSchema,
  promoBannerSectionSchema,
  whyUsSectionSchema,
  gallerySectionSchema,
  reviewsSectionSchema,
  enquirySectionSchema,
  quickLinksSectionSchema,
]);

export const homepageSchema = z.strictObject({
  seo: z
    .strictObject({
      title: nonEmpty.max(70),
      description: nonEmpty.max(170),
    })
    .optional(),
  sections: z.array(homeSectionSchema).min(1),
});
