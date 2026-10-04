import type { PackageAction, SiteSettings, TravelPackage } from "@/types/content";

export interface ResolvedAction {
  label: string;
  href: string;
  external: boolean;
}

/**
 * Turns a package's configured CTAs into links. "enquire" jumps to the on-page enquiry form;
 * "book"/"pay" go to an external booking or payment page (a payment provider can be added
 * later just by setting the URL — no secrets ever live in content or client code).
 */
export function resolvePackageActions(pkg: TravelPackage, labels: SiteSettings["labels"]): ResolvedAction[] {
  const resolve = (action: PackageAction): ResolvedAction => ({
    label: action.label ?? labels[action.type],
    href: action.type === "enquire" || !action.url ? "#enquire" : action.url,
    external: action.type !== "enquire" && Boolean(action.url),
  });
  return [pkg.cta.primary, pkg.cta.secondary].filter((a): a is PackageAction => Boolean(a)).map(resolve);
}
