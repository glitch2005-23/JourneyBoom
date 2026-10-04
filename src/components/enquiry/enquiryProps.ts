import type { Destination, SiteSettings } from "@/types/content";
import type { EnquiryFormProps } from "./EnquiryForm";

/**
 * Server-side: turns settings + content into the serializable props the client form needs.
 * The Mailchimp form URL is a public embed endpoint (not a secret), read at build time.
 */
export function buildEnquiryFormProps(
  settings: SiteSettings,
  destinations: Destination[],
  context: { destination?: string; packageTitle?: string } = {},
): EnquiryFormProps {
  const { enquiry, contact } = settings;
  return {
    config: {
      provider: enquiry.provider,
      mailchimpFormUrl: process.env.NEXT_PUBLIC_MAILCHIMP_FORM_URL || undefined,
      mailchimpFields: enquiry.mailchimpFields,
      email: contact.email,
      mailtoSubject: enquiry.mailtoSubject,
      mailtoSuccessMessage: enquiry.mailtoSuccessMessage,
    },
    copy: {
      submitLabel: enquiry.submitLabel,
      successTitle: enquiry.successTitle,
      successMessage: enquiry.successMessage,
      errorMessage: enquiry.errorMessage,
    },
    destinations: destinations.map((d) => d.title),
    defaultDestination: context.destination,
    packageTitle: context.packageTitle,
    phone: { href: `tel:${contact.phone}`, label: contact.phoneDisplay },
  };
}
