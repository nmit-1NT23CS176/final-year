// Shared skeleton shimmer + error banner components
"use client"
import { cn } from "@/lib/utils"

// ── Skeleton shimmer block ─────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-shimmer rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] shadow-sm", className)} />
  )
}

// ── Skeleton signal card ────────────────────────────────
export function SkeletonSignalCard() {
  return (
    <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-4 shadow-card">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-6 w-24 rounded-md mb-1.5" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <Skeleton className="h-3 w-16 mb-1.5 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div>
          <Skeleton className="h-3 w-20 mb-1.5 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>
      <div className="mt-2">
        <div className="flex justify-between mb-1.5">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  )
}

// ── Skeleton table row ──────────────────────────────────
export function SkeletonTableRow() {
  return (
    <tr className="border-b border-[var(--color-border)]">
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
    <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card">
      <Skeleton className="h-3 w-20 mb-3 rounded-md" />
      <Skeleton className="h-8 w-28 mb-2 rounded-md" />
      <Skeleton className="h-3 w-16 rounded-md" />
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 mb-4 rounded-xl border border-[var(--color-bearish-muted)] bg-red-50 text-[var(--color-bearish)] text-sm font-medium gap-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="shrink-0 bg-[var(--color-bearish)] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">!</span>
        <span>Could not load {section}.{countdown ? ` Retrying in ${countdown}s.` : ''}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-white border border-[var(--color-border)] px-4 py-1.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm shrink-0 font-semibold"
        >
          Retry Now
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

  let color = 'text-[var(--color-bullish)]'
  let bg = 'bg-[var(--color-bullish-muted)]'
  let icon = '●'
  let label = ageMin === 0 ? 'Updated just now' : `Updated ${ageMin} min ago`

  if (ageMin >= 15) {
    color = 'text-[var(--color-bearish)]'
    bg = 'bg-[var(--color-bearish-muted)]'
    icon = '✕'
    label = 'Data may be stale'
  } else if (ageMin >= 5) {
    color = 'text-yellow-600'
    bg = 'bg-yellow-100'
    icon = '⚠'
    label = `Updated ${ageMin} min ago`
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${color} ${bg}`}>
      {icon} {label}
    </span>
  )
}
