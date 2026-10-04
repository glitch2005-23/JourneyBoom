import { StaticPage, staticPageMetadata } from "@/components/common/StaticPage";

export const generateMetadata = () => staticPageMetadata("terms");

export default function TermsPage() {
  return <StaticPage slug="terms" />;
}
