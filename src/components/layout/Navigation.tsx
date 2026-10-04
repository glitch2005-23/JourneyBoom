"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { NavMenu } from "./types";

/** Desktop navigation: category mega-menus (hover, click and keyboard accessible) plus plain links. */
export function Navigation({ menus, links, pathname }: { menus: NavMenu[]; links: { label: string; href: string }[]; pathname: string }) {
  // A mega-menu stays open only on the page it was opened on, so navigating closes it.
  const [openMenu, setOpenMenu] = useState<{ index: number; path: string } | null>(null);
  const openIndex = openMenu?.path === pathname ? openMenu.index : null;
  const setOpenIndex = (index: number | null) => setOpenMenu(index === null ? null : { index, path: pathname });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openIndex]);

  const hoverOpen = (i: number) => {
    clearTimeout(closeTimer.current);
    setOpenIndex(i);
  };
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 160);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);
  const itemClass = (active: boolean) =>
    cn(
      "relative flex h-10 items-center gap-1 rounded-full px-4 font-display text-[14px] font-semibold transition-colors",
      active ? "text-navy" : "text-ink/75 hover:text-navy",
      "after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:origin-left after:rounded-full after:bg-orange after:transition-transform after:duration-300",
      active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
    );

  return (
    <nav ref={navRef} aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {menus.map((menu, i) => {
          const open = openIndex === i;
          return (
            <li key={menu.href} onMouseEnter={() => hoverOpen(i)} onMouseLeave={hoverClose}>
              <button
                type="button"
                className={itemClass(isActive(menu.href))}
                aria-expanded={open}
                aria-controls={`mega-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                {menu.label}
                <ChevronDown className={cn("size-4 transition-transform duration-300", open && "rotate-180")} aria-hidden="true" />
              </button>
              <div
                id={`mega-${i}`}
                hidden={!open}
                className="absolute inset-x-0 top-full border-t border-line bg-white shadow-lift"
              >
                <div className="container-site grid grid-cols-12 gap-8 py-8">
                  <div className="col-span-3 flex flex-col">
                    <p className="eyebrow">{menu.tagline}</p>
                    <p className="mt-2 font-display text-2xl font-bold text-navy">{menu.label}</p>
                    <Link href={menu.href} className="btn btn-outline btn-sm mt-auto w-fit">
                      View all {menu.label.toLowerCase()} <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                  <ul className="col-span-9 grid grid-cols-3 gap-4">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="group flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-sand"
                        >
                          <span className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                            <Image src={item.image.src} alt="" fill sizes="80px" className="zoom-img object-cover" />
                          </span>
                          <span>
                            <span className="block font-display font-semibold text-navy">{item.label}</span>
                            <span className="block text-xs text-muted">{item.region}</span>
                            {item.startingPrice && (
                              <span className="mt-1 block text-xs font-semibold text-orange">from {item.startingPrice}</span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={itemClass(isActive(link.href))} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
