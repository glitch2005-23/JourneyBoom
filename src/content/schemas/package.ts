import { z } from "zod";
import {
  httpsUrlSchema,
  imageSchema,
  nonEmpty,
  paragraphsSchema,
  seoSchema,
  slugSchema,
  visibilityShape,
} from "./common";

/**
 * A package call-to-action. "enquire" scrolls to the enquiry form; "book" and "pay"
 * link to an external booking/payment page (no payment secrets ever live in content).
 */
export const packageActionSchema = z
  .strictObject({
    type: z.enum(["enquire", "book", "pay"]),
    label: nonEmpty.optional(),
    url: httpsUrlSchema.optional(),
  })
  .refine((a) => a.type === "enquire" || Boolean(a.url), {
    message: "A \"book\" or \"pay\" action needs an https:// \"url\"",
    path: ["url"],
  });

export const itineraryDaySchema = z.strictObject({
  day: z.number().int().positive(),
  title: nonEmpty,
  description: nonEmpty,
  meals: z.array(z.enum(["Breakfast", "Lunch", "Dinner"])).default([]),
  overnight: nonEmpty.optional(),
});

export const packageSchema = z
  .strictObject({
    slug: slugSchema.optional(),
    title: nonEmpty,
    shortDescription: nonEmpty.max(220, "Keep the short description under 220 characters"),
    description: paragraphsSchema,
    price: z.strictObject({
      amount: z.number().positive(),
      originalAmount: z.number().positive().optional(),
      basis: nonEmpty.default("per person"),
      note: nonEmpty.optional(),
    }),
    duration: z.strictObject({
      nights: z.number().int().nonnegative(),
      days: z.number().int().positive(),
    }),
    route: z.array(z.strictObject({ city: nonEmpty, nights: z.number().int().nonnegative() })).default([]),
    departureCity: nonEmpty.optional(),
    badges: z.array(nonEmpty).max(2, "Use at most 2 badges").default([]),
    images: z.strictObject({
      hero: imageSchema,
      card: imageSchema.optional(),
      gallery: z.array(imageSchema).default([]),
    }),
    highlights: z.array(nonEmpty).min(1),
    itinerary: z.array(itineraryDaySchema).min(1),
    inclusions: z.array(nonEmpty).min(1),
    exclusions: z.array(nonEmpty).default([]),
    knowBeforeYouGo: z.array(nonEmpty).default([]),
    cta: z
      .object({
        primary: packageActionSchema,
        secondary: packageActionSchema.optional(),
      })
      .default({ primary: { type: "enquire" } }),
    seo: seoSchema,
    ...visibilityShape,
  })
  .superRefine((pkg, ctx) => {
    if (pkg.duration.days !== pkg.duration.nights + 1 && pkg.duration.days !== pkg.duration.nights) {
      ctx.addIssue({
        code: "custom",
        path: ["duration"],
        message: `${pkg.duration.nights} nights usually means ${pkg.duration.nights + 1} days`,
      });
    }
    if (pkg.price.originalAmount !== undefined && pkg.price.originalAmount <= pkg.price.amount) {
      ctx.addIssue({
        code: "custom",
        path: ["price", "originalAmount"],
        message: "originalAmount (the struck-through price) must be higher than amount",
      });
    }
    pkg.itinerary.forEach((d, i) => {
      if (d.day !== i + 1) {
        ctx.addIssue({
          code: "custom",
          path: ["itinerary", i, "day"],
          message: `Expected day ${i + 1} — itinerary days must be numbered in order`,
        });
      }
    });
  });
