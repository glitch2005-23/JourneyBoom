import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import type { SiteSettings } from "@/types/content";

/** Slim contact strip above the header (desktop only); scrolls away while the header stays. */
export function TopBar({ settings }: { settings: SiteSettings }) {
  const { contact } = settings;
  return (
    <div className="hidden bg-navy-deep text-[13px] text-white/75 md:block">
      <div className="container-site flex h-9 items-center justify-between gap-6">
        <p className="truncate font-display tracking-[0.16em] text-white/60 uppercase">{settings.tagline}</p>
        <ul className="flex items-center gap-6">
          {contact.hours && (
            <li className="hidden items-center gap-2 lg:flex">
              <Clock className="size-3.5 text-amber" aria-hidden="true" />
              {contact.hours}
            </li>
          )}
          <li>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 transition-colors hover:text-white">
              <Mail className="size-3.5 text-amber" aria-hidden="true" />
              {contact.email}
            </a>
          </li>
          <li>
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 transition-colors hover:text-white">
              <Phone className="size-3.5 text-amber" aria-hidden="true" />
              {contact.phoneDisplay}
            </a>
          </li>
          {contact.whatsapp && (
            <li>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <MessageCircle className="size-3.5 text-amber" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
