import { z } from "zod";
import { imageSchema, nonEmpty, seoSchema, slugSchema, visibilityShape } from "./common";

export const categorySchema = z.strictObject({
  slug: slugSchema.optional(),
  title: nonEmpty,
  /** Short line shown above titles and in menus, e.g. "Explore India". */
  tagline: nonEmpty,
  description: nonEmpty,
  heroImage: imageSchema,
  cardImage: imageSchema,
  seo: seoSchema,
  ...visibilityShape,
});
