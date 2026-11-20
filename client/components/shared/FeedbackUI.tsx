// Shared skeleton shimmer + error banner components
"use client"
import { cn } from "@/lib/utils"

// ── Skeleton shimmer block ─────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-shimmer rounded-lg bg-[var(--color-elevated)]", className)} />
  )
}

// ── Skeleton signal card ────────────────────────────────
export function SkeletonSignalCard() {
  return (
    <div className="p-6 rounded-xl border border-[#1e2535] bg-[#161c28] flex flex-col gap-4">
      <div className="flex gap-2">
        <Skeleton className="h-4 w-10 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <Skeleton className="h-6 w-28" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-8 w-32" />
      <div className="pt-4 border-t border-[#1e2535] flex flex-col gap-3">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-8 w-full rounded" />
      </div>
    </div>
  )
}

// ── Skeleton table row ──────────────────────────────────
export function SkeletonTableRow() {
  return (
    <tr className="border-b border-[#1e2535]">
      {[48, 24, 20, 16, 20, 16, 16, 16].map((w, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className={`h-4 w-${w}`} />
        </td>
      ))}
    </tr>
  )
}

// ── Skeleton stat card ──────────────────────────────────
export function SkeletonStatCard() {
  return (
    <div className="p-4 rounded-xl border border-[#1e2535] bg-[#161c28]">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-8 w-24 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

// ── Inline error banner ─────────────────────────────────
interface ErrorBannerProps {
  section: string
  onRetry?: () => void
  countdown?: number
}

export function ErrorBanner({ section, onRetry, countdown }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#3d0000] bg-[var(--color-elevated)] text-[#ef4444] text-xs font-medium gap-4">
      <span>⚠ Could not load {section}.{countdown ? ` Retrying in ${countdown}s.` : ''}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[#ef4444] underline hover:text-white transition-colors shrink-0"
        >
          Retry now
        </button>
      )}
    </div>
  )
}

// ── Data freshness badge ───────────────────────────────
export function FreshnessBadge({ lastFetchedAt }: { lastFetchedAt: Date | null }) {
  if (!lastFetchedAt) return null
  const ageMs = Date.now() - lastFetchedAt.getTime()
  const ageMin = Math.floor(ageMs / 60_000)

  let color = 'text-[#00d26a]'
  let icon = '●'
  let label = ageMin === 0 ? 'Updated just now' : `Updated ${ageMin} min ago`

  if (ageMin >= 15) {
    color = 'text-[#ef4444]'
    icon = '✕'
    label = 'Data may be stale'
  } else if (ageMin >= 5) {
    color = 'text-yellow-400'
    icon = '⚠'
    label = `Updated ${ageMin} min ago`
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${color}`}>
      {icon} {label}
    </span>
  )
}
