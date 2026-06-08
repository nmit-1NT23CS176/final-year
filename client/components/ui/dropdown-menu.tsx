"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
  className?: string
}

function DropdownMenu({ trigger, children, align = "right", className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  React.useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("keydown", handleEsc)
      return () => document.removeEventListener("keydown", handleEsc)
    }
  }, [open])

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute top-full mt-2 z-50 min-w-[180px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 card-shadow-lg animate-scale-in",
            align === "right" ? "right-0" : "left-0"
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean
}

function DropdownItem({ className, destructive, children, ...props }: DropdownItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left",
        destructive
          ? "text-[var(--color-bearish)] hover:bg-[var(--color-bearish-muted)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("my-1 h-px bg-[var(--color-border)]", className)} {...props} />
}

function DropdownLabel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-3 py-1.5 text-xs font-medium text-[var(--color-text-disabled)]", className)} {...props}>
      {children}
    </div>
  )
}

export { DropdownMenu, DropdownItem, DropdownSeparator, DropdownLabel }
