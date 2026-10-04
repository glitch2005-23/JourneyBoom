import { StaticPage, staticPageMetadata } from "@/components/common/StaticPage";

export const generateMetadata = () => staticPageMetadata("contact");

export default function ContactPage() {
  return <StaticPage slug="contact" />;
}
