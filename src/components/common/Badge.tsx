import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const TONES = {
  orange: "bg-orange text-navy-deep",
  palm: "bg-palm text-white",
  navy: "bg-navy text-white",
  white: "bg-white/95 text-navy shadow-sm",
  soft: "bg-navy/5 text-navy",
} as const;

export function Badge({
  children,
  tone = "white",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return <span className={cn("chip", TONES[tone], className)}>{children}</span>;
}
