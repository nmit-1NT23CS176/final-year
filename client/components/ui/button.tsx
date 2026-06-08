import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger" | "success"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-border)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-[var(--color-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]": variant === "default",
            "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface)]": variant === "outline",
            "hover:bg-[var(--color-surface)]": variant === "ghost",
            "bg-[var(--color-bearish)] text-white hover:bg-[var(--color-bearish-hover)]": variant === "danger",
            "bg-[var(--color-bullish)] text-white hover:bg-[var(--color-bullish-hover)]": variant === "success",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
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
