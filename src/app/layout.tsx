import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import { DM_Sans, Montserrat } from "next/font/google";
import { getContentProvider } from "@/content";
import { JsonLd } from "@/components/common/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { buildNavData } from "@/components/layout/navData";
import { travelAgencyJsonLd } from "@/lib/seo/jsonld";
import type { SiteSettings } from "@/types/content";
import "./globals.css";

const heading = Montserrat({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getContentProvider().getSiteSettings();
  return {
    metadataBase: new URL(settings.siteUrl),
    title: { default: `${settings.siteName} — ${settings.tagline}`, template: `%s | ${settings.siteName}` },
    description: settings.description,
    applicationName: settings.siteName,
    openGraph: { siteName: settings.siteName, type: "website", images: [settings.defaultOgImage] },
    twitter: { card: "summary_large_image" },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getContentProvider().getSiteSettings();
  return { themeColor: settings.theme.colors.navy };
}

/** Maps settings.theme.colors onto the CSS custom properties used by the design system. */
function themeStyle({ theme: { colors } }: SiteSettings): CSSProperties {
  return {
    "--brand-navy": colors.navy,
    "--brand-navy-deep": colors.navyDeep,
    "--brand-orange": colors.orange,
    "--brand-orange-soft": colors.orangeSoft,
    "--brand-sky": colors.sky,
    "--brand-palm": colors.palm,
    "--brand-sand": colors.sand,
    "--brand-ink": colors.ink,
    "--brand-muted": colors.muted,
    "--brand-line": colors.line,
  } as CSSProperties;
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const content = getContentProvider();
  const [settings, navigation, footer, categories, destinations] = await Promise.all([
    content.getSiteSettings(),
    content.getNavigation(),
    content.getFooter(),
    content.getCategories(),
    content.getAllDestinations(),
  ]);

  return (
    <html lang={settings.locale} className={`${heading.variable} ${body.variable}`} style={themeStyle(settings)}>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-navy px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <TopBar settings={settings} />
        <Header nav={buildNavData(settings, navigation, categories, destinations)} />
        <main id="main">{children}</main>
        <Footer footer={footer} settings={settings} categories={categories} destinations={destinations} />
        <JsonLd data={travelAgencyJsonLd(settings)} />
      </body>
    </html>
  );
}
