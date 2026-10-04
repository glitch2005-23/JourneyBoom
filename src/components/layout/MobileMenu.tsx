"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronDown, MessageCircle, Phone, X } from "lucide-react";
import type { NavData } from "./types";

interface MobileMenuProps {
  nav: NavData;
  open: boolean;
  onClose: () => void;
}

/** Full-height drawer built on <dialog>: focus is contained, Esc closes, focus returns to the toggle. */
export function MobileMenu({ nav, open, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      aria-label="Menu"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-white p-0 shadow-lift backdrop:bg-navy-deep/50 lg:hidden"
    >
      <div className="flex h-full flex-col">
        <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-5">
          <span className="font-display text-sm font-semibold tracking-[0.2em] text-muted uppercase">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full bg-sand text-navy"
            aria-label="Close menu"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="divide-y divide-line">
            <li>
              <Link href="/" className="block py-4 font-display text-lg font-semibold text-navy">
                {nav.homeLabel}
              </Link>
            </li>
            {nav.menus.map((menu) => (
              <li key={menu.href}>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between py-4 font-display text-lg font-semibold text-navy">
                    {menu.label}
                    <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <ul className="mb-4 space-y-1 rounded-2xl bg-sand p-2">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-white">
                          <span>
                            <span className="block font-semibold text-navy">{item.label}</span>
                            <span className="block text-xs text-muted">{item.region}</span>
                          </span>
                          {item.startingPrice && <span className="text-xs font-semibold text-orange">from {item.startingPrice}</span>}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href={menu.href} className="block rounded-xl px-3 py-3 text-sm font-semibold text-navy underline-offset-4 hover:underline">
                        View all {menu.label.toLowerCase()} →
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            ))}
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block py-4 font-display text-lg font-semibold text-navy">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-line p-5">
          {nav.cta && (
            <Link href={nav.cta.href} className="btn btn-accent w-full">
              {nav.cta.label}
            </Link>
          )}
          <div className="grid grid-cols-2 gap-3">
            <a href={nav.phone.href} className="btn btn-outline btn-sm">
              <Phone className="size-4" aria-hidden="true" /> Call
            </a>
            {nav.whatsapp && (
              <a href={nav.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
