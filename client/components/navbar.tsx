"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, User as UserIcon, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
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
    { href: "/", label: "Markets" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/insights", label: "Insights" },
    { href: "/products", label: "Products" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--color-background)]/80 backdrop-blur-2xl border-b border-[var(--color-border)] shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[var(--color-bullish-muted)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="h-5 w-5 text-[var(--color-bullish)]" />
              </div>
              <span className="font-extrabold text-[17px] tracking-tight text-[var(--color-text-primary)]">
                StockVista
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8 ml-4 h-full">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center h-16 text-[13px] uppercase tracking-widest font-bold transition-colors duration-200 ${
                      isActive
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-bullish)] shadow-[0_0_12px_rgba(0,230,118,0.8)] rounded-t-md" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Auth */}
          <div className="flex items-center gap-3">
            {/* Search Bar (desktop) */}
            <div className="hidden md:block w-48">
              <SearchBar variant="default" />
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
                  <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] rounded-full px-4">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full shadow-green-glow px-5"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-full hover:bg-[var(--color-elevated)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-2xl rounded-b-2xl overflow-hidden animate-fade-in">
            <div className="p-4">
              <SearchBar variant="default" className="mb-4" />
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-[var(--color-text-primary)] bg-[var(--color-elevated)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]"
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
