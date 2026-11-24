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
    /** Structured address for search engines (Google Business / rich results). */
    postalAddress: z
      .strictObject({
        streetAddress: nonEmpty,
        locality: nonEmpty,
        region: nonEmpty.optional(),
        postalCode: nonEmpty,
        country: z.string().length(2, "Use the 2-letter country code, e.g. \"IN\""),
      })
      .optional(),
    hours: nonEmpty.optional(),
  }),
  social: z.array(socialLinkSchema).default([]),
  /** Google Search Console "HTML tag" verification code (the content="..." value only). */
  googleSiteVerification: nonEmpty.optional(),
  theme: themeSchema,
  /** Short trust points shown in the package booking card, e.g. "No hidden charges". */
  bookingAssurances: z.array(nonEmpty).max(4).default([]),
  labels: z.strictObject({
    enquire: nonEmpty.default("Enquire Now"),
    book: nonEmpty.default("Book Now"),
    pay: nonEmpty.default("Pay Now"),
  }),
  enquiry: z.strictObject({
    /** "web3forms" emails each enquiry to you (free); "mailto" opens the visitor's email app. */
    provider: z.enum(["web3forms", "mailchimp", "mailto"]),
    /** Web3Forms access key from web3forms.com (see docs/ENQUIRY_SETUP.md). Public by design — not a secret. */
    web3formsAccessKey: z
      .string()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Paste the access key from Web3Forms (looks like xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)")
      .optional(),
    /** Label for the optional marketing opt-in checkbox on the form. */
    consentLabel: nonEmpty.default("Send me occasional travel offers and updates from Journey Boom"),
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
