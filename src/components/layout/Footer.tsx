import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Category, Destination, Footer as FooterContent, SiteSettings } from "@/types/content";
import { SocialIcon } from "./SocialIcon";

interface FooterProps {
  footer: FooterContent;
  settings: SiteSettings;
  categories: Category[];
  destinations: Destination[];
}

export function Footer({ footer, settings, categories, destinations }: FooterProps) {
  const { contact } = settings;
  const year = new Date().getFullYear();
  const copyright = footer.copyright.replace("{year}", String(year));

  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white/75">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-orange/10 blur-3xl" aria-hidden="true" />
      <div className="container-site relative grid gap-12 py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-block rounded-2xl bg-white p-3 shadow-card" aria-label={`${settings.siteName} — home`}>
            <Image
              src={settings.footerLogo.src}
              alt={settings.footerLogo.alt}
              width={settings.footerLogo.width}
              height={settings.footerLogo.height}
              sizes="220px"
              className="h-auto w-44"
            />
          </Link>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed">{footer.about}</p>
          {settings.social.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {settings.social.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-orange hover:bg-orange hover:text-navy-deep"
                    aria-label={s.platform}
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-display text-sm font-semibold tracking-[0.18em] text-white uppercase">{column.title}</h2>
              <ul className="mt-5 space-y-3 text-[15px]">
                {column.source === "categories"
                  ? categories.flatMap((category) => [
                      <li key={category.href}>
                        <Link href={category.href} className="font-semibold text-white transition-colors hover:text-amber">
                          {category.title}
                        </Link>
                      </li>,
                      ...destinations
                        .filter((d) => d.categorySlug === category.slug)
                        .map((d) => (
                          <li key={d.href} className="pl-3">
                            <Link href={d.href} className="transition-colors hover:text-amber">
                              {d.title}
                            </Link>
                          </li>
                        )),
                    ])
                  : column.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="transition-colors hover:text-amber">
                          {link.label}
                        </Link>
                      </li>
                    ))}
              </ul>
            </div>
          ))}
        </div>

        <address className="not-italic lg:col-span-3">
          <h2 className="font-display text-sm font-semibold tracking-[0.18em] text-white uppercase">Get in touch</h2>
          <ul className="mt-5 space-y-4 text-[15px]">
            <li>
              <a href={`tel:${contact.phone}`} className="flex items-start gap-3 transition-colors hover:text-amber">
                <Phone className="mt-0.5 size-4 shrink-0 text-orange" aria-hidden="true" />
                {contact.phoneDisplay}
              </a>
            </li>
            {contact.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-amber"
                >
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-orange" aria-hidden="true" />
                  WhatsApp us
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-start gap-3 break-all transition-colors hover:text-amber">
                <Mail className="mt-0.5 size-4 shrink-0 text-orange" aria-hidden="true" />
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-orange" aria-hidden="true" />
              <span>
                {contact.address}
                {contact.hours && <span className="mt-1 block text-sm text-white/55">{contact.hours}</span>}
              </span>
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>{copyright}</p>
          {footer.legal.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footer.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
