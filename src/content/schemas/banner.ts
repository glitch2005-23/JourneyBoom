import { z } from "zod";
import { ctaLinkSchema, imageSchema, nonEmpty } from "./common";

export const bannerSchema = z.strictObject({
  eyebrow: nonEmpty.optional(),
  title: nonEmpty,
  text: nonEmpty,
  image: imageSchema,
  cta: ctaLinkSchema.optional(),
  enabled: z.boolean().default(true),
});
