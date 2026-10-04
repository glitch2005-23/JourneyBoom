import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getContentProvider } from "@/content";
import { CTAButton } from "@/components/common/CTAButton";
import { DestinationCard } from "@/components/common/DestinationCard";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default async function NotFound() {
  const content = getContentProvider();
  const [settings, destinations] = await Promise.all([content.getSiteSettings(), content.getAllDestinations()]);
  const money = { locale: settings.locale, currency: settings.currency };
  const suggestions = destinations.slice(0, 3);

  return (
    <section className="section">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-7xl font-bold text-orange/90 sm:text-8xl">404</p>
          <h1 className="heading-1 mt-4">This road doesn&rsquo;t lead anywhere</h1>
          <p className="lead mt-4">
            The page you&rsquo;re looking for may have moved, or the trip is no longer available. Let&rsquo;s get you back on track.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row">
            <CTAButton href="/" variant="primary">
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
            </CTAButton>
            <CTAButton href="/contact/" variant="outline">
              Talk to a travel expert
            </CTAButton>
          </div>
        </div>
        {suggestions.length > 0 && (
          <div className="mt-16">
            <h2 className="heading-3 mb-6 text-center">Popular destinations</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((d) => (
                <DestinationCard key={d.href} destination={d} money={money} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
