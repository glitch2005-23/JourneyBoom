import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { cn } from "@/lib/utils/cn";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  label: string;
  href: string;
}

/** Visible breadcrumb trail plus BreadcrumbList structured data. The last crumb is the current page. */
export function Breadcrumbs({
  items,
  siteUrl,
  tone = "light",
  className,
}: {
  items: Crumb[];
  siteUrl: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <>
      <nav aria-label="Breadcrumb" className={className}>
        <ol
          className={cn(
            "flex flex-wrap items-center gap-1.5 text-[13px] font-medium",
            tone === "light" ? "text-white/80" : "text-muted",
          )}
        >
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className={tone === "light" ? "text-white" : "text-navy"}>
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className={cn("transition-colors", tone === "light" ? "hover:text-white" : "hover:text-navy")}
                    >
                      {item.label}
                    </Link>
                    <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items, siteUrl)} />
    </>
  );
}
