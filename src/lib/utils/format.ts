import type { TravelPackage } from "@/types/content";

export interface MoneyFormat {
  locale: string;
  currency: string;
}

/** 24999 → "₹24,999" (en-IN / INR); grouping follows the locale (e.g. ₹1,24,999). */
export function formatPrice(amount: number, { locale, currency }: MoneyFormat): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

/** { nights: 5, days: 6 } → "5N / 6D" */
export function formatDurationShort({ nights, days }: TravelPackage["duration"]): string {
  return `${nights}N / ${days}D`;
}

/** { nights: 5, days: 6 } → "5 Nights · 6 Days" */
export function formatDurationLong({ nights, days }: TravelPackage["duration"]): string {
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  return `${plural(nights, "Night")} · ${plural(days, "Day")}`;
}

/** [{ city: "Srinagar", nights: 3 }, …] → "Srinagar 3N · Gulmarg 1N" */
export function formatRoute(route: TravelPackage["route"]): string {
  return route.map((r) => (r.nights ? `${r.city} ${r.nights}N` : r.city)).join(" · ");
}

/** "2026-05" or "2026-05-12" → "May 2026" */
export function formatMonth(date: string, locale: string): string {
  const [year, month] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, 1)),
  );
}

export function formatDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
