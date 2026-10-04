import type { Metadata } from "next";
import { getContentProvider } from "@/content";
import { SectionRenderer } from "@/components/home/SectionRenderer";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContentProvider();
  const [settings, home] = await Promise.all([content.getSiteSettings(), content.getHomepage()]);
  return buildMetadata({
    settings,
    seo: home.seo ?? { title: `${settings.siteName} — ${settings.tagline}`, description: settings.description },
    path: "/",
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const content = getContentProvider();
  const home = await content.getHomepage();
  return (
    <>
      {home.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} content={content} />
      ))}
    </>
  );
}
