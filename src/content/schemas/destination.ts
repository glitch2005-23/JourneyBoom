import { z } from "zod";
import {
  iconNameSchema,
  imageSchema,
  nonEmpty,
  paragraphsSchema,
  seoSchema,
  slugSchema,
  visibilityShape,
} from "./common";

export const destinationSchema = z.strictObject({
  slug: slugSchema.optional(),
  title: nonEmpty,
  /** e.g. "Jammu & Kashmir, India" */
  region: nonEmpty,
  tagline: nonEmpty,
  description: paragraphsSchema,
  heroImage: imageSchema,
  cardImage: imageSchema,
  gallery: z.array(imageSchema).default([]),
  highlights: z
    .array(z.strictObject({ icon: iconNameSchema, title: nonEmpty, text: nonEmpty }))
    .default([]),
  quickFacts: z
    .strictObject({
      bestTime: nonEmpty,
      idealDuration: nonEmpty,
      language: nonEmpty.optional(),
      currency: nonEmpty.optional(),
    })
    .optional(),
  seo: seoSchema,
  ...visibilityShape,
});
