import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  src?: string
  size?: "sm" | "default" | "lg"
}

function Avatar({ name, src, size = "default", className, ...props }: AvatarProps) {
  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  }

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden bg-[var(--color-elevated)] border border-[var(--color-border)]",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-semibold bg-[var(--color-accent)] text-white",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {initials}
    </div>
  )
}

export { Avatar }
