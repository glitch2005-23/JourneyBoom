import type { EnquiryPayload, EnquiryProvider } from "./types";

/** A readable, pre-filled email for the enquiry. */
export function buildMailtoUrl(to: string, subject: string, payload: EnquiryPayload): string {
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    payload.packageTitle && `Package: ${payload.packageTitle}`,
    payload.destination && `Destination: ${payload.destination}`,
    payload.travelDate && `Travel date: ${payload.travelDate}`,
    `Travellers: ${payload.travellers}`,
    payload.message && `\n${payload.message}`,
    payload.source && `\nSent from: ${payload.source}`,
  ].filter(Boolean);
  const fullSubject = payload.packageTitle ? `${subject} — ${payload.packageTitle}` : subject;
  return `mailto:${to}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

/** Fallback provider: opens the visitor's email app with the enquiry ready to send. */
export function createMailtoProvider(to: string, subject: string, successMessage: string): EnquiryProvider {
  return {
    id: "mailto",
    async submit(payload) {
      window.location.href = buildMailtoUrl(to, subject, payload);
      return { ok: true, message: successMessage };
    },
  };
}
