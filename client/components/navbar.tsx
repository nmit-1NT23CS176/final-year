"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-[var(--color-border)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 mr-4">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-[var(--color-bullish)] ${pathname === '/' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
              Markets
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-[var(--color-bullish)] ${pathname === '/dashboard' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                Dashboard
              </Link>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <UserIcon className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm" className="bg-[var(--color-bullish)] hover:bg-[var(--color-bullish-hover)] text-black border-none">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
