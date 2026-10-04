import { formatPrice, type MoneyFormat } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface PriceDisplayProps {
  amount: number;
  originalAmount?: number;
  basis?: string;
  money: MoneyFormat;
  size?: "sm" | "lg";
  label?: string;
  tone?: "default" | "light";
  className?: string;
}

export function PriceDisplay({
  amount,
  originalAmount,
  basis,
  money,
  size = "sm",
  label = "Starting from",
  tone = "default",
  className,
}: PriceDisplayProps) {
  const light = tone === "light";
  return (
    <div className={cn("leading-tight", className)}>
      <p className={cn("text-xs font-medium", light ? "text-white/70" : "text-muted")}>{label}</p>
      <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            size === "lg" ? "text-3xl" : "text-xl",
            light ? "text-white" : "text-navy",
          )}
        >
          {formatPrice(amount, money)}
        </span>
        {originalAmount && (
          <s className={cn("text-sm", light ? "text-white/60" : "text-muted")}>
            <span className="sr-only">Was </span>
            {formatPrice(originalAmount, money)}
          </s>
        )}
      </p>
      {basis && <p className={cn("text-xs", light ? "text-white/70" : "text-muted")}>{basis}</p>}
    </div>
  );
}
