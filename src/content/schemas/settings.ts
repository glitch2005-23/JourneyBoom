import { z } from "zod";
import { httpsUrlSchema, imageSchema, imageSrcSchema, nonEmpty } from "./common";
import { socialLinkSchema } from "./navigation";

const sizedImageSchema = imageSchema.extend({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const hexColor =z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex colour like \"#12305E\"");

export const themeSchema = z.strictObject({
  colors: z.strictObject({
    navy: hexColor,
    navyDeep: hexColor,
    orange: hexColor,
    orangeSoft: hexColor,
    sky: hexColor,
    palm: hexColor,
    sand: hexColor,
    ink: hexColor,
    muted: hexColor,
    line: hexColor,
  }),
});

export const siteSettingsSchema = z.strictObject({
  siteName: nonEmpty,
  tagline: nonEmpty,
  /** Production URL, used for canonical links, sitemap and OpenGraph. */
  siteUrl: httpsUrlSchema.refine((v) => !v.endsWith("/"), "Remove the trailing \"/\""),
  description: nonEmpty.max(170),
  /** Horizontal logo for the header. */
  logo: sizedImageSchema,
  /** Stacked logo for the footer. */
  footerLogo: sizedImageSchema,
  defaultOgImage: imageSrcSchema,
  fallbackImage: imageSchema,
  locale: nonEmpty.default("en-IN"),
  currency: z.string().length(3).default("INR"),
  contact: z.strictObject({
    phone: z.string().regex(/^\+[0-9]{8,15}$/, "Use international format without spaces, e.g. \"+919876543210\""),
    phoneDisplay: nonEmpty,
    email: z.email(),
    whatsapp: z.string().regex(/^[0-9]{8,15}$/, "Digits only incl. country code, e.g. \"919876543210\"").optional(),
    address: nonEmpty,
    hours: nonEmpty.optional(),
  }),
  social: z.array(socialLinkSchema).default([]),
  theme: themeSchema,
  /** Short trust points shown in the package booking card, e.g. "No hidden charges". */
  bookingAssurances: z.array(nonEmpty).max(4).default([]),
  labels: z.strictObject({
    enquire: nonEmpty.default("Enquire Now"),
    book: nonEmpty.default("Book Now"),
    pay: nonEmpty.default("Pay Now"),
  }),
  enquiry: z.strictObject({
    provider: z.enum(["mailchimp", "mailto"]),
    /** Copy for the enquiry block on category, destination and package pages. */
    title: nonEmpty,
    subtitle: nonEmpty,
    image: imageSchema,
    points: z.array(nonEmpty).max(5).default([]),
    submitLabel: nonEmpty,
    successTitle: nonEmpty,
    successMessage: nonEmpty,
    errorMessage: nonEmpty,
    mailtoSubject: nonEmpty,
    /** Shown after the email app opens (mailto fallback). */
    mailtoSuccessMessage: nonEmpty,
    /** Mailchimp merge tags for each form field (Audience → Settings → Merge tags). */
    mailchimpFields: z.strictObject({
      name: nonEmpty,
      phone: nonEmpty,
      destination: nonEmpty,
      travelDate: nonEmpty,
      travellers: nonEmpty,
      message: nonEmpty,
    }),
  }),
});
