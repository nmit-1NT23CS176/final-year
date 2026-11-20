import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "bullish" | "bearish" | "outline" | "accent" | "warning"
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold leading-tight tracking-wide",
          {
            "bg-[var(--color-elevated)] text-[var(--color-text-secondary)]": variant === "default",
            "bg-[var(--color-bullish-muted)] text-[var(--color-bullish)]": variant === "bullish",
            "bg-[var(--color-bearish-muted)] text-[var(--color-bearish)]": variant === "bearish",
            "border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)]": variant === "outline",
            "bg-[var(--color-accent-muted)] text-[var(--color-accent)]": variant === "accent",
            "bg-[var(--color-warning-muted)] text-[var(--color-warning)]": variant === "warning",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
