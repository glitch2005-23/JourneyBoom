"use client";

import { useEffect } from "react";

/**
 * Makes links to a section on the current page (e.g. "Enquire Now" → #enquire) scroll there
 * on every click. Without this, once the URL already ends in that #hash, Next.js treats the
 * click as "already here" and nothing happens. Runs in the capture phase, before Next.js'
 * own link handling, and only for same-page links whose target exists.
 */
export function InPageLinks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(anchor instanceof HTMLAnchorElement) || (anchor.target && anchor.target !== "_self")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (window.location.hash !== url.hash) {
        window.history.replaceState(window.history.state, "", url.hash);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
