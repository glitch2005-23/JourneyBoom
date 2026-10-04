import type { ContentImage } from "@/types/content";

/** Navigation data prepared on the server (from content) and passed to the client header. */
export interface NavMenu {
  label: string;
  tagline: string;
  href: string;
  items: { label: string; href: string; region: string; image: ContentImage; startingPrice: string | null }[];
}

export interface NavData {
  logo: { src: string; alt: string; width: number; height: number };
  homeLabel: string;
  menus: NavMenu[];
  links: { label: string; href: string }[];
  cta?: { label: string; href: string };
  phone: { href: string; label: string };
  whatsapp?: string;
}
