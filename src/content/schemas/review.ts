import { z } from "zod";
import { nonEmpty, visibilityShape } from "./common";

export const reviewSchema = z.strictObject({
  name: nonEmpty,
  location: nonEmpty,
  rating: z.number().int().min(1).max(5),
  text: nonEmpty.max(600, "Keep reviews under 600 characters"),
  /** Trip name shown under the reviewer, e.g. "Kashmir Delight · May 2026". */
  trip: nonEmpty.optional(),
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "Use YYYY-MM or YYYY-MM-DD"),
  /** Optional link to content: "domestic/srinagar" or "domestic/srinagar/kashmir-delight". */
  destination: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/, "Use \"category/destination\"").optional(),
  package: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/, "Use \"category/destination/package\"").optional(),
  ...visibilityShape,
});
