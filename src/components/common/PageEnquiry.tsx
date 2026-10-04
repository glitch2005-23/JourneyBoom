import type { Destination, SiteSettings } from "@/types/content";
import { EnquirySection } from "@/components/home/EnquirySection";
import { buildEnquiryFormProps } from "@/components/enquiry/enquiryProps";

/** The enquiry block used on category, destination and package pages (anchor: #enquire). */
export function PageEnquiry({
  settings,
  destinations,
  destination,
  packageTitle,
  title,
}: {
  settings: SiteSettings;
  destinations: Destination[];
  destination?: string;
  packageTitle?: string;
  title?: string;
}) {
  const { enquiry } = settings;
  return (
    <EnquirySection
      id="enquire"
      eyebrow={settings.siteName}
      title={title ?? enquiry.title}
      subtitle={enquiry.subtitle}
      image={enquiry.image}
      points={enquiry.points}
      form={buildEnquiryFormProps(settings, destinations, { destination, packageTitle })}
    />
  );
}
