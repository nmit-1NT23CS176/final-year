import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "ghost" | "danger" | "success"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-bullish)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-background)] disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--color-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]": variant === "default",
            "bg-[var(--color-bullish)] text-[#050816] font-semibold hover:bg-[var(--color-bullish-hover)] hover:shadow-green-glow": variant === "primary",
            "border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]": variant === "outline",
            "text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]": variant === "ghost",
            "bg-[var(--color-bearish)] text-white hover:bg-[var(--color-bearish-hover)]": variant === "danger",
            "bg-[var(--color-bullish)] text-[#050816] font-semibold hover:bg-[var(--color-bullish-hover)] hover:shadow-green-glow": variant === "success",
            "h-9 px-4 py-2": size === "default",
            "h-8 px-3 text-[13px]": size === "sm",
            "h-10 px-6": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
