import type { EnquiryPayload, EnquiryProvider, EnquiryResult } from "./types";

const ENDPOINT = "https://api.web3forms.com/submit";
const TIMEOUT_MS = 20000;

/** Web3Forms access keys are UUIDs. They are designed to be public (used from the browser). */
export function isWeb3FormsKey(key: string | undefined): key is string {
  return !!key && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);
}

/** The fields shown in the notification email, with readable labels. */
export function buildWeb3FormsBody(accessKey: string, siteName: string, payload: EnquiryPayload) {
  const about = payload.packageTitle || payload.destination || "General enquiry";
  return {
    access_key: accessKey,
    subject: `New enquiry: ${payload.name} — ${about}`,
    from_name: `${siteName} Website`,
    // Web3Forms uses "email" as the Reply-To, so replying answers the customer directly.
    name: payload.name,
    email: payload.email,
    Phone: payload.phone,
    Destination: payload.destination || "Not sure yet",
    Package: payload.packageTitle || "—",
    "Travel date": payload.travelDate || "Not decided",
    Travellers: String(payload.travellers),
    "Marketing emails": payload.marketingConsent ? "Yes" : "No",
    message: payload.message || "—",
    "Sent from": payload.source || "—",
    // Web3Forms' own spam trap; real visitors never fill this.
    botcheck: "",
  };
}

/**
 * Sends enquiries to Web3Forms (free plan, 250/month), which emails them to the address the
 * access key was created for. Submitted with fetch, so the visitor stays on the page.
 */
export function createWeb3FormsProvider(accessKey: string, siteName: string): EnquiryProvider {
  return {
    id: "web3forms",
    async submit(payload: EnquiryPayload): Promise<EnquiryResult> {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(buildWeb3FormsBody(accessKey, siteName, payload)),
          signal: controller.signal,
        });
        const data = (await res.json()) as { success?: boolean };
        return { ok: res.ok && data.success === true };
      } catch {
        return { ok: false };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
