import { CheckCircle2, Phone } from "lucide-react";
import type { ContentImage } from "@/types/content";
import { EnquiryForm, type EnquiryFormProps } from "@/components/enquiry/EnquiryForm";
import { Reveal } from "@/components/common/Reveal";
import { SmartImage } from "@/components/common/SmartImage";

interface EnquirySectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: ContentImage;
  points: string[];
  form: EnquiryFormProps;
}

/** Split layout: an inspiring image with reassurance points beside the enquiry form. */
export function EnquirySection({ id, eyebrow, title, subtitle, image, points, form }: EnquirySectionProps) {
  return (
    <section id={id} className="section bg-sand">
      <div className="container-site">
        <div className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-card lg:grid-cols-12">
          <div className="relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden bg-navy-deep p-8 sm:p-10 lg:col-span-5 lg:p-12">
            <SmartImage image={image} sizes="(min-width: 1024px) 40vw, 100vw" className="-z-20" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-deep via-navy-deep/60 to-navy-deep/10" aria-hidden="true" />
            {eyebrow && <p className="eyebrow text-amber">{eyebrow}</p>}
            <h2 className="heading-2 mt-3 text-white">{title}</h2>
            {subtitle && <p className="mt-4 text-white/80">{subtitle}</p>}
            {points.length > 0 && (
              <ul className="mt-8 space-y-3">
                {points.map((point) => (
                  <li key={point} className="flex gap-3 text-[15px] text-white/90">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-amber" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
            <a href={form.phone.href} className="mt-8 inline-flex items-center gap-3 font-display font-semibold text-white">
              <span className="grid size-11 place-items-center rounded-full bg-white/15">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              {form.phone.label}
            </a>
          </div>
          <Reveal className="relative p-6 sm:p-10 lg:col-span-7 lg:p-12">
            <EnquiryForm {...form} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
