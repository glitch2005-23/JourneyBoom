import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getContentProvider } from "@/content";
import type { StaticPageSlug } from "@/lib/content/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/format";
import type { PageBlock, SiteSettings } from "@/types/content";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { buildEnquiryFormProps } from "@/components/enquiry/enquiryProps";
import { Breadcrumbs } from "./Breadcrumbs";
import { PageHero } from "./PageHero";

export async function staticPageMetadata(slug: StaticPageSlug): Promise<Metadata> {
  const content = getContentProvider();
  const [settings, page] = await Promise.all([content.getSiteSettings(), content.getPage(slug)]);
  if (!page) return {};
  return buildMetadata({ settings, seo: page.seo, path: `/${slug}/`, image: page.heroImage?.src });
}

function Block({ block }: { block: PageBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="heading-3 mt-10 first:mt-0">{block.text}</h2>;
    case "paragraph":
      return <p className="mt-4 leading-relaxed text-ink/80">{block.text}</p>;
    case "list":
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-ink/80">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-orange" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      );
  }
}

function ContactDetails({ settings }: { settings: SiteSettings }) {
  const { contact } = settings;
  const rows = [
    { icon: Phone, label: "Call us", value: contact.phoneDisplay, href: `tel:${contact.phone}` },
    contact.whatsapp && { icon: MessageCircle, label: "WhatsApp", value: "Chat with a travel expert", href: `https://wa.me/${contact.whatsapp}` },
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: "Visit us", value: contact.address, href: undefined },
  ].filter((r): r is { icon: typeof Phone; label: string; value: string; href: string | undefined } => Boolean(r));
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {rows.map(({ icon: IconComponent, label, value, href }) => (
        <li key={label} className="card flex gap-4 p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-orange/10 text-orange">
            <IconComponent className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm text-muted">{label}</span>
            {href ? (
              <a href={href} className="block font-display font-semibold break-words text-navy hover:text-orange" {...(href.startsWith("https") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {value}
              </a>
            ) : (
              <span className="block font-display font-semibold text-navy">{value}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Generic renderer for content/pages/<slug>.json (about, contact, terms, privacy). */
export async function StaticPage({ slug }: { slug: StaticPageSlug }) {
  const content = getContentProvider();
  const [settings, page, destinations] = await Promise.all([
    content.getSiteSettings(),
    content.getPage(slug),
    content.getAllDestinations(),
  ]);
  if (!page) notFound();

  const crumbs = [
    { label: "Home", href: "/" },
    { label: page.title, href: `/${slug}/` },
  ];

  return (
    <>
      {page.heroImage ? (
        <PageHero image={page.heroImage} breadcrumbs={crumbs} siteUrl={settings.siteUrl} eyebrow={page.eyebrow} title={page.title} description={page.intro} />
      ) : (
        <section className="border-b border-line bg-white">
          <div className="container-site py-14 md:py-20">
            <Breadcrumbs items={crumbs} siteUrl={settings.siteUrl} tone="dark" className="mb-6" />
            {page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
            <h1 className="heading-1 mt-3">{page.title}</h1>
            <p className="lead mt-4 max-w-2xl">{page.intro}</p>
            {page.updated && <p className="mt-4 text-sm text-muted">Last updated {formatDate(page.updated, settings.locale)}</p>}
          </div>
        </section>
      )}

      <section className="section">
        <div className={page.showEnquiryForm ? "container-site grid gap-12 lg:grid-cols-12" : "container-site"}>
          <div className={page.showEnquiryForm ? "lg:col-span-6" : "max-w-3xl"}>
            {page.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            {page.showContactDetails && (
              <div className={page.blocks.length ? "mt-10" : undefined}>
                <ContactDetails settings={settings} />
              </div>
            )}
          </div>
          {page.showEnquiryForm && (
            <div className="relative lg:col-span-6">
              <div className="card p-6 sm:p-8">
                <h2 className="heading-3">{settings.enquiry.title}</h2>
                <p className="mt-2 mb-6 text-muted">{settings.enquiry.subtitle}</p>
                <EnquiryForm {...buildEnquiryFormProps(settings, destinations)} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
