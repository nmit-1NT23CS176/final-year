import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

/* Pre-built skeleton patterns for common use cases */

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)} {...props}>
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

function SkeletonTable({ rows = 5, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { rows?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

function SkeletonChart({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4", className)} {...props}>
      <Skeleton className="w-full h-[400px] rounded-lg" />
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonChart }
