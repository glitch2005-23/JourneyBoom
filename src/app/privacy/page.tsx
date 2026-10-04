import { StaticPage, staticPageMetadata } from "@/components/common/StaticPage";

export const generateMetadata = () => staticPageMetadata("privacy");

export default function PrivacyPage() {
  return <StaticPage slug="privacy" />;
}
