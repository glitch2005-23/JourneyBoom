import { z } from "zod";
import { imageSchema, nonEmpty, seoSchema } from "./common";

/** Structured rich text — no HTML, so nothing needs sanitising at render time. */
export const pageBlockSchema = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("heading"), text: nonEmpty }),
  z.strictObject({ type: z.literal("paragraph"), text: nonEmpty }),
  z.strictObject({ type: z.literal("list"), items: z.array(nonEmpty).min(1) }),
]);

export const staticPageSchema = z.strictObject({
  eyebrow: nonEmpty.optional(),
  title: nonEmpty,
  intro: nonEmpty,
  heroImage: imageSchema.optional(),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").optional(),
  blocks: z.array(pageBlockSchema).default([]),
  showContactDetails: z.boolean().default(false),
  showEnquiryForm: z.boolean().default(false),
  seo: seoSchema,
});
