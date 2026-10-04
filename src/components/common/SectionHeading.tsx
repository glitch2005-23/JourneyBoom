import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** Optional element (usually a link) shown opposite the heading on wide screens. */
  action?: ReactNode;
  as?: "h1" | "h2";
  tone?: "default" | "light";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
  as: Tag = "h2",
  tone = "default",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-14",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Tag className={cn("heading-2", tone === "light" && "text-white")}>{title}</Tag>
        {subtitle && (
          <p className={cn("lead mt-4", tone === "light" && "text-white/75")}>{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
