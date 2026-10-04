import type { Destination, SiteSettings, TravelPackage } from "@/types/content";
import { PageEnquiry } from "@/components/common/PageEnquiry";

/** Enquiry block for a package page, with the package and destination pre-filled. */
export function EnquiryCTA({
  pkg,
  settings,
  destinations,
}: {
  pkg: TravelPackage;
  settings: SiteSettings;
  destinations: Destination[];
}) {
  return (
    <PageEnquiry
      settings={settings}
      destinations={destinations}
      destination={pkg.destinationTitle}
      packageTitle={pkg.title}
      title={`Enquire about ${pkg.title}`}
    />
  );
}
