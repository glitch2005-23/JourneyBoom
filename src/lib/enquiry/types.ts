export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  destination: string;
  /** ISO date (YYYY-MM-DD) or empty when not decided. */
  travelDate: string;
  travellers: number;
  message: string;
  /** Opted in to marketing emails (unticked by default). */
  marketingConsent: boolean;
  /** Package the enquiry was made from, when applicable. */
  packageTitle?: string;
  /** Page URL the enquiry was sent from. */
  source?: string;
}

export interface EnquiryResult {
  ok: boolean;
  /** Optional provider-specific message shown instead of the configured default. */
  message?: string;
}

/**
 * Where enquiries go. Swap implementations (Web3Forms, Mailchimp, mailto; a CRM or
 * form service tomorrow) without touching the form UI.
 */
export interface EnquiryProvider {
  readonly id: string;
  submit(payload: EnquiryPayload): Promise<EnquiryResult>;
}

/** Serializable configuration handed from the server to the client form. */
export interface EnquiryConfig {
  provider: "web3forms" | "mailchimp" | "mailto";
  /** Web3Forms access key — public by design (it only allows sending to your own email). */
  web3formsAccessKey?: string;
  /** Used in notification email subjects/sender name. */
  siteName: string;
  /** Public Mailchimp embedded-form action URL (not a secret). */
  mailchimpFormUrl?: string;
  mailchimpFields: {
    name: string;
    phone: string;
    destination: string;
    travelDate: string;
    travellers: string;
    message: string;
  };
  email: string;
  mailtoSubject: string;
  mailtoSuccessMessage: string;
}
