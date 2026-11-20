"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, User as UserIcon, LogOut, LayoutDashboard, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { DropdownMenu, DropdownItem, DropdownSeparator, DropdownLabel } from "./ui/dropdown-menu";
import { SearchBar } from "./stocks/SearchBar";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/market", label: "MARKETS" },
    { href: "/stocks", label: "STOCKS" },
    { href: "/screener", label: "SCREENER" },
    { 
      href: "/signals", 
      label: "AI SIGNALS",
      dropdown: [
        { label: "Bullish Signals", href: "/signals?filter=bullish" },
        { label: "Bearish Signals", href: "/signals?filter=bearish" },
        { label: "No Signal / Neutral", href: "/signals?filter=neutral" },
        { label: "Signals By Sector", href: "/signals?filter=sector" },
      ]
    },
    { href: "/ai-performance", label: "PERFORMANCE" },
    { 
      href: "/learn", 
      label: "LEARN",
      dropdown: [
        { label: "How It Works", href: "/learn/how-it-works" },
        { label: "Technical Indicators", href: "/learn/indicators" },
        { label: "Market Glossary", href: "/learn/glossary" },
        { label: "FAQs & Methodology", href: "/learn/faqs" },
      ]
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-[var(--color-border)] shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-bullish)] flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-[var(--color-bullish-muted)]">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-[19px] tracking-tight text-[var(--color-text-primary)]">
              StockVista
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden xl:flex items-center gap-7 h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              
              if (link.dropdown) {
                return (
                  <div key={link.label} className="relative group/nav flex items-center h-16">
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1.5 text-[13px] tracking-wide font-semibold transition-colors duration-200 ${
                        isActive
                          ? "text-[var(--color-text-primary)]"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover/nav:rotate-180 transition-transform" />
                    </Link>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--color-bullish)] rounded-t-md" />
                    )}

                    {/* Dropdown Menu */}
                    <div className="absolute top-14 left-0 hidden group-hover/nav:block w-56 py-2 bg-white border border-[var(--color-border)] rounded-xl shadow-xl animate-slide-down">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-2.5 text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50 transition-colors font-medium"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center h-16 text-[13px] tracking-wide font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--color-bullish)] rounded-t-md" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Search, Live Badge, Auth */}
        <div className="flex items-center gap-4">
          {/* Search Bar (desktop) */}
          <div className="hidden md:block w-44 lg:w-56">
            <SearchBar variant="default" />
          </div>

          {/* Live Badge Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-elevated)] border border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-secondary)]">
            <span className="live-dot" />
            <span>LIVE</span>
          </div>

          {isAuthenticated ? (
            <DropdownMenu
              trigger={
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity p-1 pr-3 rounded-full bg-[var(--color-elevated)] border border-[var(--color-border)]">
                  <Avatar name={user?.name} size="sm" />
                  <span className="hidden sm:block text-[13px] font-medium text-[var(--color-text-secondary)]">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>
              }
              align="right"
            >
              <DropdownLabel>
                {user?.email}
              </DropdownLabel>
              <DropdownSeparator />
              <DropdownItem onClick={() => router.push("/dashboard")}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </DropdownItem>
              <DropdownItem onClick={() => router.push("/profile")}>
                <UserIcon className="w-4 h-4" />
                Profile
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem destructive onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-full px-4 text-sm font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-full bg-[var(--color-bullish)] hover:bg-[var(--color-bullish-hover)] text-white px-5 py-1.5 text-sm font-bold border-0 shadow-sm"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="xl:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-full hover:bg-[var(--color-elevated)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-2xl rounded-b-2xl overflow-hidden animate-fade-in">
          <div className="p-4">
            <SearchBar variant="default" className="mb-4" />
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider block transition-colors ${
                      pathname === link.href
                        ? "text-[var(--color-text-primary)] bg-[var(--color-elevated)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-6 flex flex-col gap-1 my-1">
                      {link.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isAuthenticated && (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]"
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

