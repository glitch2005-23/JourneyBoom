import { StaticPage, staticPageMetadata } from "@/components/common/StaticPage";

export const generateMetadata = () => staticPageMetadata("about");

export default function AboutPage() {
  return <StaticPage slug="about" />;
}
