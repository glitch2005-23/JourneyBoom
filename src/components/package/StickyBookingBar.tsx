import type { TravelPackage } from "@/types/content";
import { formatPrice, type MoneyFormat } from "@/lib/utils/format";
import { CTAButton } from "@/components/common/CTAButton";
import type { ResolvedAction } from "./packageActions";

/** Mobile/tablet: price and primary CTA pinned to the bottom of the screen. */
export function StickyBookingBar({ pkg, action, money }: { pkg: TravelPackage; action: ResolvedAction; money: MoneyFormat }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_30px_-20px_rgb(11_43_85/0.4)] backdrop-blur-md lg:hidden">
      <div className="container-site flex items-center justify-between gap-4 py-3">
        <div className="min-w-0 leading-tight">
          <p className="text-xs text-muted">From</p>
          <p className="font-display text-lg font-bold text-navy">
            {formatPrice(pkg.price.amount, money)}
            <span className="ml-1 text-xs font-medium text-muted">{pkg.price.basis}</span>
          </p>
        </div>
        <CTAButton href={action.href} variant="accent" size="sm" className="shrink-0">
          {action.label}
        </CTAButton>
      </div>
    </div>
  );
}
