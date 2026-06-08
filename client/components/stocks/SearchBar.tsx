"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { stockApi } from "@/services/stock-api";
import { Stock } from "../../../shared/types/stock";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  variant?: "default" | "hero";
}

export function SearchBar({ className, placeholder = "Search stocks (e.g., RELIANCE, TCS)...", variant = "default" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    stockApi.searchStocks(debouncedQuery, 8)
      .then((res) => {
        if (!cancelled) {
          setResults(res.data || []);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setIsOpen(true);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        navigateToStock(results[selectedIndex].symbol);
      } else if (query.trim()) {
        navigateToStock(query.trim().toUpperCase());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const navigateToStock = (symbol: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/stocks/${encodeURIComponent(symbol)}`);
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-150",
          isOpen ? "text-[var(--color-accent)]" : "text-[var(--color-text-disabled)]"
        )} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-8 rounded-lg border transition-all duration-150 focus:outline-none",
            variant === "default"
              ? "h-9 text-sm bg-[var(--color-elevated)] border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
              : "h-11 text-sm bg-[var(--color-surface)] border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]",
            "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]"
          )}
        />
        {query && (
          <button
            onClick={clearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-disabled)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute top-full mt-1.5 left-0 right-0 z-50 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg overflow-hidden animate-fade-in">
          {isLoading ? (
            <div className="px-4 py-5 text-center text-sm text-[var(--color-text-secondary)]">
              <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto">
              {results.map((stock, i) => (
                <button
                  key={stock.symbol}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors duration-100",
                    i === selectedIndex
                      ? "bg-[var(--color-elevated)]"
                      : "hover:bg-[var(--color-elevated)]"
                  )}
                  onClick={() => navigateToStock(stock.symbol)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[var(--color-text-primary)]">{stock.symbol}</div>
                    <div className="text-xs text-[var(--color-text-disabled)] truncate">
                      {stock.companyName}
                    </div>
                  </div>
                  {stock.exchange && (
                    <span className="text-[11px] text-[var(--color-text-disabled)] ml-2 shrink-0">
                      {stock.exchange}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">No results found</p>
              <button
                onClick={() => navigateToStock(query.trim().toUpperCase())}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Search for &quot;{query.trim().toUpperCase()}&quot; →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
