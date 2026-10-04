export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  destination: string;
  /** ISO date (YYYY-MM-DD) or empty when not decided. */
  travelDate: string;
  travellers: number;
  message: string;
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
 * Where enquiries go. Swap implementations (Mailchimp today; a custom API, CRM or form
 * service tomorrow) without touching the form UI.
 */
export interface EnquiryProvider {
  readonly id: string;
  submit(payload: EnquiryPayload): Promise<EnquiryResult>;
}

/** Serializable configuration handed from the server to the client form. */
export interface EnquiryConfig {
  provider: "mailchimp" | "mailto";
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
