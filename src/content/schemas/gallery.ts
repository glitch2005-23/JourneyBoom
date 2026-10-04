import { z } from "zod";
import { imageSchema, nonEmpty } from "./common";

export const gallerySchema = z.strictObject({
  title: nonEmpty,
  images: z.array(imageSchema).min(1),
});
