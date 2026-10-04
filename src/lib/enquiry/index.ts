import { createMailchimpProvider, isMailchimpFormUrl } from "./mailchimp";
import { createMailtoProvider } from "./mailto";
import type { EnquiryConfig, EnquiryProvider } from "./types";

/**
 * Picks the enquiry provider from configuration. Mailchimp is used when selected and a
 * valid public form URL is configured; otherwise enquiries fall back to email (mailto).
 * Add new providers (custom API, CRM, …) here — the form only sees EnquiryProvider.
 */
export function createEnquiryProvider(config: EnquiryConfig): EnquiryProvider {
  if (config.provider === "mailchimp" && isMailchimpFormUrl(config.mailchimpFormUrl)) {
    return createMailchimpProvider(config.mailchimpFormUrl, config.mailchimpFields);
  }
  return createMailtoProvider(config.email, config.mailtoSubject, config.mailtoSuccessMessage);
}

export type { EnquiryConfig, EnquiryPayload, EnquiryProvider, EnquiryResult } from "./types";
