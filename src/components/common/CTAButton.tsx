import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "accent" | "outline" | "light";

interface CTAButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "md" | "sm";
  className?: string;
  ariaLabel?: string;
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Link styled as a button. Internal links use client-side navigation; external ones open safely in a new tab. */
export function CTAButton({ href, children, variant = "primary", size = "md", className, ariaLabel }: CTAButtonProps) {
  const classes = cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", className);
  if (isExternal(href) || href.startsWith("tel:") || href.startsWith("mailto:")) {
    const external = isExternal(href);
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
