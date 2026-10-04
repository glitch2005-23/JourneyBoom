import type { EnquiryPayload } from "./types";

export type EnquiryErrors = Partial<Record<keyof EnquiryPayload, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9\s-]{7,15}$/;

/**
 * Client-side validation for the enquiry form. Dependency-free on purpose so the form
 * ships no schema library to the browser. `today` is injectable for testing.
 */
export function validateEnquiry(payload: EnquiryPayload, today = new Date()): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (payload.name.trim().length < 2) errors.name = "Please enter your name";
  if (!EMAIL.test(payload.email.trim())) errors.email = "Please enter a valid email address";
  if (!PHONE.test(payload.phone.trim())) errors.phone = "Please enter a valid phone number, e.g. +91 98765 43210";
  if (!Number.isInteger(payload.travellers) || payload.travellers < 1 || payload.travellers > 50) {
    errors.travellers = "Between 1 and 50 travellers";
  }
  if (payload.travelDate) {
    const todayIso = today.toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.travelDate)) errors.travelDate = "Please choose a valid date";
    else if (payload.travelDate < todayIso) errors.travelDate = "Travel date can't be in the past";
  }
  if (payload.message.length > 1000) errors.message = "Please keep your message under 1000 characters";
  return errors;
}
