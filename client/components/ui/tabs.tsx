"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("Tab components must be used within <Tabs>")
  return context
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
}

function Tabs({ defaultValue, value, onValueChange, className, children, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const activeTab = value ?? internalValue
  const setActiveTab = React.useCallback((tab: string) => {
    setInternalValue(tab)
    onValueChange?.(tab)
  }, [onValueChange])

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg bg-[var(--color-elevated)] p-1",
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 cursor-pointer",
        isActive
          ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { activeTab } = useTabs()
  if (activeTab !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn("mt-3 animate-fade-in", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
