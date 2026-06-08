"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    { href: "/news", label: "News" },
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
    <nav className="sticky top-0 z-50 w-full glass border-b border-[var(--color-border)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Activity className="h-6 w-6 text-[var(--color-bullish)]" />
            </motion.div>
            <Link href="/" className="font-sans font-bold text-xl tracking-tight text-[var(--color-text-primary)]">
              StockVista
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[var(--color-text-primary)] bg-[var(--color-elevated)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Center: Search Bar (desktop) */}
        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar variant="default" />
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu
              trigger={
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar name={user?.name} size="sm" />
                  <span className="hidden md:block text-sm font-medium text-[var(--color-text-secondary)]">
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
                  size="sm"
                  className="bg-[var(--color-bullish)] hover:bg-[var(--color-bullish-hover)] text-black border-none font-semibold"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] animate-slide-down">
          <div className="p-4">
            <SearchBar variant="default" className="mb-4" />
            <div className="flex flex-col gap-1">
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
