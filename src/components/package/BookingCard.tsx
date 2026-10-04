import { Clock, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import type { SiteSettings, TravelPackage } from "@/types/content";
import { formatDurationLong, type MoneyFormat } from "@/lib/utils/format";
import { CTAButton } from "@/components/common/CTAButton";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import type { ResolvedAction } from "./packageActions";

/** Sticky price + CTA card beside the package content (desktop). */
export function BookingCard({
  pkg,
  actions,
  settings,
  money,
}: {
  pkg: TravelPackage;
  actions: ResolvedAction[];
  settings: SiteSettings;
  money: MoneyFormat;
}) {
  const { contact } = settings;
  return (
    <aside aria-label="Book this package" className="card overflow-hidden">
      <div className="border-b border-line bg-sand/60 p-6">
        <PriceDisplay amount={pkg.price.amount} originalAmount={pkg.price.originalAmount} basis={pkg.price.basis} money={money} size="lg" />
        {pkg.price.note && <p className="mt-2 text-xs text-muted">{pkg.price.note}</p>}
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy">
          <Clock className="size-4 text-orange" aria-hidden="true" />
          {formatDurationLong(pkg.duration)}
        </p>
      </div>
      <div className="space-y-3 p-6">
        {actions.map((action, i) => (
          <CTAButton key={action.label} href={action.href} variant={i === 0 ? "accent" : "primary"} className="w-full">
            {action.label}
          </CTAButton>
        ))}
        <div className="grid grid-cols-2 gap-3">
          <a href={`tel:${contact.phone}`} className="btn btn-outline btn-sm">
            <Phone className="size-4" aria-hidden="true" /> Call
          </a>
          {contact.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hi! I'm interested in ${pkg.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
            </a>
          )}
        </div>
      </div>
      {settings.bookingAssurances.length > 0 && (
        <ul className="space-y-2.5 border-t border-line px-6 py-5">
          {settings.bookingAssurances.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-ink/80">
              <ShieldCheck className="size-4 shrink-0 text-palm" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
