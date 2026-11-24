import { createMailchimpProvider, isMailchimpFormUrl } from "./mailchimp";
import { createMailtoProvider } from "./mailto";
import type { EnquiryConfig, EnquiryProvider } from "./types";
import { createWeb3FormsProvider, isWeb3FormsKey } from "./web3forms";

/**
 * Picks the enquiry provider from configuration. The chosen provider is used when its key
 * or URL is configured and valid; otherwise enquiries fall back to email (mailto).
 * Add new providers (custom API, CRM, …) here — the form only sees EnquiryProvider.
 */
export function createEnquiryProvider(config: EnquiryConfig): EnquiryProvider {
  if (config.provider === "web3forms" && isWeb3FormsKey(config.web3formsAccessKey)) {
    return createWeb3FormsProvider(config.web3formsAccessKey, config.siteName);
  }
  if (config.provider === "mailchimp" && isMailchimpFormUrl(config.mailchimpFormUrl)) {
    return createMailchimpProvider(config.mailchimpFormUrl, config.mailchimpFields);
  }
  return createMailtoProvider(config.email, config.mailtoSubject, config.mailtoSuccessMessage);
}

export type { EnquiryConfig, EnquiryPayload, EnquiryProvider, EnquiryResult } from "./types";
