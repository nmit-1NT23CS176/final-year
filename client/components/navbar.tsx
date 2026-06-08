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
    ...(isAuthenticated ? [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/orders", label: "Orders" }
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--color-background)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[var(--color-bullish)]" />
            <span className="font-bold text-base tracking-tight text-[var(--color-text-primary)]">
              StockVista
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--color-accent)] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Center: Search Bar (desktop) */}
        <div className="hidden md:block flex-1 max-w-xs">
          <SearchBar variant="default" />
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu
              trigger={
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar name={user?.name} size="sm" />
                  <span className="hidden md:block text-[13px] font-medium text-[var(--color-text-secondary)]">
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
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)]">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="primary"
                  size="sm"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] animate-fade-in">
          <div className="p-4">
            <SearchBar variant="default" className="mb-3" />
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-[var(--color-text-primary)] bg-[var(--color-elevated)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)]"
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
