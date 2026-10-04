import type { EnquiryConfig, EnquiryPayload, EnquiryProvider, EnquiryResult } from "./types";

const TIMEOUT_MS = 15000;

/** Accepts only Mailchimp's public embedded-form endpoint. */
export function isMailchimpFormUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".list-manage.com") && parsed.pathname.includes("/subscribe/post");
  } catch {
    return false;
  }
}

/** Builds the JSONP URL for Mailchimp's embedded form ("/post" → "/post-json"). */
export function buildMailchimpUrl(
  formUrl: string,
  fields: EnquiryConfig["mailchimpFields"],
  payload: EnquiryPayload,
  callback: string,
): string {
  const url = new URL(formUrl.replace("/subscribe/post", "/subscribe/post-json"));
  const message = [payload.packageTitle && `Package: ${payload.packageTitle}`, payload.message, payload.source && `Page: ${payload.source}`]
    .filter(Boolean)
    .join("\n");
  url.searchParams.set("EMAIL", payload.email);
  url.searchParams.set(fields.name, payload.name);
  url.searchParams.set(fields.phone, payload.phone);
  url.searchParams.set(fields.destination, payload.destination);
  url.searchParams.set(fields.travelDate, payload.travelDate);
  url.searchParams.set(fields.travellers, String(payload.travellers));
  url.searchParams.set(fields.message, message);
  url.searchParams.set("c", callback);
  return url.toString();
}

/**
 * Sends enquiries to a Mailchimp audience through the public embedded-form endpoint
 * (JSONP, as Mailchimp's own embed does). No API key is involved, so nothing secret
 * ever reaches the browser.
 */
export function createMailchimpProvider(formUrl: string, fields: EnquiryConfig["mailchimpFields"]): EnquiryProvider {
  return {
    id: "mailchimp",
    submit(payload: EnquiryPayload): Promise<EnquiryResult> {
      return new Promise((resolve) => {
        const callback = `__mc_${Date.now().toString(36)}`;
        const script = document.createElement("script");
        const globals = window as unknown as Record<string, unknown>;
        const cleanup = () => {
          delete globals[callback];
          script.remove();
          clearTimeout(timer);
        };
        const timer = setTimeout(() => {
          cleanup();
          resolve({ ok: false });
        }, TIMEOUT_MS);

        globals[callback] = (response: { result?: string }) => {
          cleanup();
          resolve({ ok: response.result === "success" });
        };
        script.onerror = () => {
          cleanup();
          resolve({ ok: false });
        };
        script.src = buildMailchimpUrl(formUrl, fields, payload, callback);
        document.body.appendChild(script);
      });
    },
  };
}
