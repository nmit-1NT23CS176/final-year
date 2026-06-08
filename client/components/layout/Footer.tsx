import { Activity } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <Activity className="h-4 w-4 text-[var(--color-bullish)]" />
              <span className="font-semibold text-sm text-[var(--color-text-primary)]">StockVista</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {[
                { label: "Markets", href: "/" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Portfolio", href: "/portfolio" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right */}
          <p className="text-xs text-[var(--color-text-disabled)]">
            © {new Date().getFullYear()} StockVista · Built by Priyanshu
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <p className="text-[11px] text-[var(--color-text-disabled)] leading-relaxed">
            <strong>Disclaimer:</strong> This application is for educational and informational purposes only.
            It is NOT a trading platform and does NOT provide financial advice. Stock market investments are subject
            to market risks. Always consult a SEBI-registered financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
