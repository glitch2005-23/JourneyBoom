import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolvePackageActions } from "@/components/package/packageActions";
import { createEnquiryProvider, type EnquiryConfig, type EnquiryPayload } from "@/lib/enquiry";
import { buildMailchimpUrl, isMailchimpFormUrl } from "@/lib/enquiry/mailchimp";
import { buildMailtoUrl } from "@/lib/enquiry/mailto";
import { validateEnquiry } from "@/lib/enquiry/validate";
import { formatDurationShort, formatMonth, formatPrice, formatRoute } from "@/lib/utils/format";
import { load, ROOT } from "./helpers";

const payload: EnquiryPayload = {
  name: "Asha Rao",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  destination: "Kashmir",
  travelDate: "2030-05-01",
  travellers: 2,
  message: "Anniversary trip",
  packageTitle: "Kashmir Delight",
};

const fields: EnquiryConfig["mailchimpFields"] = {
  name: "FNAME",
  phone: "PHONE",
  destination: "DEST",
  travelDate: "TDATE",
  travellers: "PAX",
  message: "MESSAGE",
};

const config = (overrides: Partial<EnquiryConfig> = {}): EnquiryConfig => ({
  provider: "mailchimp",
  mailchimpFields: fields,
  email: "hello@example.com",
  mailtoSubject: "Holiday enquiry",
  mailtoSuccessMessage: "Email app opened",
  ...overrides,
});

describe("enquiry validation", () => {
  const today = new Date("2026-10-04T00:00:00Z");

  it("accepts a complete enquiry", () => {
    expect(validateEnquiry(payload, today)).toEqual({});
  });

  it("flags invalid fields", () => {
    const errors = validateEnquiry(
      { ...payload, name: " ", email: "nope", phone: "12", travellers: 0, travelDate: "2020-01-01" },
      today,
    );
    expect(Object.keys(errors).sort()).toEqual(["email", "name", "phone", "travelDate", "travellers"]);
  });

  it("treats travel date as optional", () => {
    expect(validateEnquiry({ ...payload, travelDate: "" }, today)).toEqual({});
  });
});

describe("enquiry providers", () => {
  it("only accepts real Mailchimp embed URLs", () => {
    expect(isMailchimpFormUrl("https://journeyboom.us21.list-manage.com/subscribe/post?u=a&id=b")).toBe(true);
    expect(isMailchimpFormUrl("http://journeyboom.us21.list-manage.com/subscribe/post?u=a")).toBe(false);
    expect(isMailchimpFormUrl("https://evil.example.com/subscribe/post")).toBe(false);
    expect(isMailchimpFormUrl(undefined)).toBe(false);
  });

  it("builds the JSONP request with mapped merge fields", () => {
    const url = new URL(
      buildMailchimpUrl("https://x.us21.list-manage.com/subscribe/post?u=a&id=b", fields, payload, "cb"),
    );
    expect(url.pathname).toBe("/subscribe/post-json");
    expect(url.searchParams.get("EMAIL")).toBe(payload.email);
    expect(url.searchParams.get("FNAME")).toBe(payload.name);
    expect(url.searchParams.get("PAX")).toBe("2");
    expect(url.searchParams.get("MESSAGE")).toContain("Package: Kashmir Delight");
    expect(url.searchParams.get("c")).toBe("cb");
  });

  it("falls back to mailto when Mailchimp is not configured", () => {
    expect(createEnquiryProvider(config()).id).toBe("mailto");
    expect(createEnquiryProvider(config({ provider: "mailto", mailchimpFormUrl: "https://x.us1.list-manage.com/subscribe/post?u=1" })).id).toBe("mailto");
    expect(createEnquiryProvider(config({ mailchimpFormUrl: "https://x.us1.list-manage.com/subscribe/post?u=1" })).id).toBe("mailchimp");
  });

  it("builds a readable mailto link", () => {
    const url = buildMailtoUrl("hello@example.com", "Holiday enquiry", payload);
    expect(url.startsWith("mailto:hello@example.com?subject=")).toBe(true);
    expect(decodeURIComponent(url)).toContain("Travellers: 2");
    expect(decodeURIComponent(url)).toContain("Holiday enquiry — Kashmir Delight");
  });
});

describe("package actions", () => {
  const tree = load(path.join(ROOT, "content")).tree!;
  const labels = tree.settings.labels;

  it("maps enquire to the on-page form and pay to the external URL", () => {
    const dubai = tree.packages.find((p) => p.slug === "dubai-deluxe")!;
    const [primary, secondary] = resolvePackageActions(dubai, labels);
    expect(primary).toEqual({ label: labels.enquire, href: "#enquire", external: false });
    expect(secondary?.external).toBe(true);
    expect(secondary?.href.startsWith("https://")).toBe(true);
  });
});

describe("formatting", () => {
  it("formats INR with Indian digit grouping", () => {
    expect(formatPrice(124999, { locale: "en-IN", currency: "INR" })).toBe("₹1,24,999");
  });

  it("formats durations, routes and months", () => {
    expect(formatDurationShort({ nights: 5, days: 6 })).toBe("5N / 6D");
    expect(formatRoute([{ city: "Srinagar", nights: 2 }, { city: "Gulmarg", nights: 1 }])).toBe("Srinagar 2N · Gulmarg 1N");
    expect(formatMonth("2026-05", "en-IN")).toBe("May 2026");
  });
});
