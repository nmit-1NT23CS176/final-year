import { Activity } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/50 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-[var(--color-bullish)]" />
              <span className="font-bold text-lg">StockVista</span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
              A Groww-inspired stock market tracking platform. Track live prices, build watchlists, and analyze stocks with premium tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-[var(--color-text-primary)]">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Markets", href: "/" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Profile", href: "/profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-bullish)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-[var(--color-text-primary)]">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: "API Docs", href: "#" },
                { label: "GitHub", href: "#" },
                { label: "About", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-bullish)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer + Copyright */}
        <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-disabled)] leading-relaxed mb-3">
            <strong>Disclaimer:</strong> This application is for educational and informational purposes only. 
            It is NOT a trading platform and does NOT provide financial advice. Stock market investments are subject 
            to market risks. Always consult a SEBI-registered financial advisor before making investment decisions.
          </p>
          <p className="text-xs text-[var(--color-text-disabled)]">
            Built with ❤️ by Priyanshu · Inspired by{" "}
            <a href="https://groww.in" target="_blank" rel="noopener noreferrer" className="text-[var(--color-bullish)] hover:underline">
              Groww
            </a>
            {" "}· © {new Date().getFullYear()} StockVista
          </p>
        </div>
      </div>
    </footer>
  );
}
