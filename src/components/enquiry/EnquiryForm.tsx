"use client";

import { useId, useMemo, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Mail, Phone, Send } from "lucide-react";
import { createEnquiryProvider, type EnquiryConfig, type EnquiryPayload } from "@/lib/enquiry";
import { buildMailtoUrl } from "@/lib/enquiry/mailto";
import { validateEnquiry, type EnquiryErrors } from "@/lib/enquiry/validate";
import { cn } from "@/lib/utils/cn";

export interface EnquiryFormProps {
  config: EnquiryConfig;
  copy: { submitLabel: string; successTitle: string; successMessage: string; errorMessage: string };
  /** Destination names offered in the dropdown (from content). */
  destinations: string[];
  defaultDestination?: string;
  packageTitle?: string;
  phone: { href: string; label: string };
}

type Status = { state: "idle" | "submitting" } | { state: "success"; message: string } | { state: "error" };

const EMPTY: Omit<EnquiryPayload, "destination"> = {
  name: "",
  email: "",
  phone: "",
  travelDate: "",
  travellers: 2,
  message: "",
};

export function EnquiryForm({ config, copy, destinations, defaultDestination, packageTitle, phone }: EnquiryFormProps) {
  const uid = useId();
  const provider = useMemo(() => createEnquiryProvider(config), [config]);
  const [values, setValues] = useState<EnquiryPayload>({ ...EMPTY, destination: defaultDestination ?? "" });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [honeypot, setHoneypot] = useState("");

  const set = <K extends keyof EnquiryPayload>(key: K, value: EnquiryPayload[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const payload = (): EnquiryPayload => ({ ...values, packageTitle, source: window.location.href });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }
    if (honeypot) {
      setStatus({ state: "success", message: copy.successMessage });
      return;
    }
    setStatus({ state: "submitting" });
    const result = await provider.submit(payload());
    setStatus(result.ok ? { state: "success", message: result.message ?? copy.successMessage } : { state: "error" });
  }

  if (status.state === "success") {
    return (
      <div role="status" className="flex flex-col items-center px-4 py-10 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-palm/10 text-palm">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h3 className="heading-3 mt-5">{copy.successTitle}</h3>
        <p className="mt-2 max-w-sm text-muted">{status.message}</p>
        <button
          type="button"
          className="btn btn-outline btn-sm mt-6"
          onClick={() => {
            setValues({ ...EMPTY, destination: defaultDestination ?? "" });
            setStatus({ state: "idle" });
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = (key: keyof EnquiryPayload) => ({
    id: `${uid}-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-error` : undefined,
  });
  const errorText = (key: keyof EnquiryPayload) =>
    errors[key] && (
      <p id={`${uid}-${key}-error`} className="mt-1.5 text-[13px] font-medium text-red-600">
        {errors[key]}
      </p>
    );
  const submitting = status.state === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2" aria-busy={submitting}>
      <div>
        <label htmlFor={`${uid}-name`} className="field-label">
          Full name <span aria-hidden="true" className="text-orange">*</span>
        </label>
        <input {...field("name")} className="field" autoComplete="name" required value={values.name} onChange={(e) => set("name", e.target.value)} />
        {errorText("name")}
      </div>
      <div>
        <label htmlFor={`${uid}-email`} className="field-label">
          Email <span aria-hidden="true" className="text-orange">*</span>
        </label>
        <input {...field("email")} type="email" className="field" autoComplete="email" required value={values.email} onChange={(e) => set("email", e.target.value)} />
        {errorText("email")}
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className="field-label">
          Phone <span aria-hidden="true" className="text-orange">*</span>
        </label>
        <input {...field("phone")} type="tel" className="field" autoComplete="tel" inputMode="tel" required placeholder="+91" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
        {errorText("phone")}
      </div>
      <div>
        <label htmlFor={`${uid}-travellers`} className="field-label">
          Travellers
        </label>
        <input {...field("travellers")} type="number" min={1} max={50} className="field" value={values.travellers} onChange={(e) => set("travellers", Number(e.target.value))} />
        {errorText("travellers")}
      </div>
      <div>
        <label htmlFor={`${uid}-destination`} className="field-label">
          Destination
        </label>
        <div className="relative">
          <select {...field("destination")} className="field appearance-none pr-10" value={values.destination} onChange={(e) => set("destination", e.target.value)}>
            <option value="">Not sure yet</option>
            {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-travelDate`} className="field-label">
          Travel date
        </label>
        <input {...field("travelDate")} type="date" className="field" value={values.travelDate} onChange={(e) => set("travelDate", e.target.value)} />
        {errorText("travelDate")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-message`} className="field-label">
          Message
        </label>
        <textarea
          {...field("message")}
          rows={4}
          className="field h-auto resize-y py-3"
          placeholder={packageTitle ? `I'm interested in ${packageTitle}…` : "Tell us about your dream trip — dates, hotels, special occasions…"}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
        {errorText("message")}
      </div>

      {/* Spam trap: invisible to people, tempting to bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      {status.state === "error" && (
        <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:col-span-2">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p>{copy.errorMessage}</p>
            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-semibold">
              <a href={buildMailtoUrl(config.email, config.mailtoSubject, payload())} className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                <Mail className="size-4" aria-hidden="true" /> Email us instead
              </a>
              <a href={phone.href} className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                <Phone className="size-4" aria-hidden="true" /> {phone.label}
              </a>
            </p>
          </div>
        </div>
      )}

      <div className="sm:col-span-2">
        <button type="submit" disabled={submitting} className={cn("btn btn-accent w-full", submitting && "cursor-wait opacity-80")}>
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
          {copy.submitLabel}
        </button>
      </div>
    </form>
  );
}
