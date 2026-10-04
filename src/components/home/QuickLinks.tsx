import Link from "next/link";
import type { HomeSectionOf } from "@/types/content";
import { Icon } from "@/components/common/Icon";

/** A compact strip of popular shortcuts (themes, destinations, offers). */
export function QuickLinks({ section }: { section: HomeSectionOf<"quickLinks"> }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="border-b border-line bg-white">
      <div className="container-site flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-8">
        <h2 id={`${section.id}-title`} className="shrink-0 font-display text-xs font-semibold tracking-[0.22em] text-muted uppercase">
          {section.title}
        </h2>
        <ul className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
          {section.links.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-sand/60 px-4 text-sm font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white"
              >
                {link.icon && <Icon name={link.icon} className="size-4 text-orange" />}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
