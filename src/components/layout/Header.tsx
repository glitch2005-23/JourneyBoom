"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MobileMenu } from "./MobileMenu";
import { Navigation } from "./Navigation";
import type { NavData } from "./types";

/** Sticky header: compacts and gains a shadow once the page scrolls. */
export function Header({ nav }: { nav: NavData }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu is open only on the page it was opened on, so navigating closes it.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const menuOpen = menuOpenOn === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 supports-[backdrop-filter]:bg-white/85",
        scrolled ? "shadow-[0_1px_0_var(--brand-line),0_10px_30px_-20px_rgb(11_43_85/0.3)]" : "shadow-[0_1px_0_var(--brand-line)]",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between gap-6 transition-[height] duration-300",
          scrolled ? "h-16 lg:h-[4.25rem]" : "h-[4.5rem] lg:h-20",
        )}
      >
        <Link href="/" className="shrink-0" aria-label={`${nav.logo.alt} — home`}>
          <Image
            src={nav.logo.src}
            alt={nav.logo.alt}
            width={nav.logo.width}
            height={nav.logo.height}
            priority
            sizes="240px"
            className={cn("w-auto transition-[height] duration-300", scrolled ? "h-9 lg:h-10" : "h-10 lg:h-12")}
          />
        </Link>

        <Navigation menus={nav.menus} links={nav.links} pathname={pathname} />

        <div className="flex items-center gap-2">
          <a
            href={nav.phone.href}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-sand xl:flex"
          >
            <Phone className="size-4 text-orange" aria-hidden="true" />
            {nav.phone.label}
          </a>
          {nav.cta && (
            <Link href={nav.cta.href} className="btn btn-accent btn-sm hidden sm:inline-flex">
              {nav.cta.label}
            </Link>
          )}
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-navy transition-colors hover:bg-sand lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpenOn(pathname)}
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileMenu nav={nav} open={menuOpen} onClose={() => setMenuOpenOn(null)} />
    </header>
  );
}
