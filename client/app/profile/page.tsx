"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Bookmark, LogOut, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Mock profile data for demo when not authenticated
  const profileUser = user || {
    name: "Priyanshu Sharma",
    email: "priyanshu@example.com",
    createdAt: "2026-06-01T00:00:00.000Z",
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const memberSince = new Date(profileUser.createdAt || Date.now()).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Profile Header Card */}
            <Card className="bg-[var(--color-surface)] border-[var(--color-border)] mb-6 overflow-hidden">
              {/* Gradient banner */}
              <div className="h-24 bg-gradient-to-r from-[var(--color-bullish)]/20 via-[var(--color-accent)]/10 to-[var(--color-bullish)]/20" />
              
              <CardContent className="p-6 -mt-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
                  <Avatar name={profileUser.name} size="lg" className="ring-4 ring-[var(--color-background)]" />
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-1">
                      <Mail className="w-3.5 h-3.5" />
                      {profileUser.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-[var(--color-bearish)] border-[var(--color-border)] hover:bg-[var(--color-bearish-muted)] hover:border-[var(--color-bearish)]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-[var(--color-elevated)]/50">
                    <div className="flex items-center gap-2 text-[var(--color-text-disabled)] text-xs mb-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Member Since
                    </div>
                    <p className="font-semibold text-sm">{memberSince}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[var(--color-elevated)]/50">
                    <div className="flex items-center gap-2 text-[var(--color-text-disabled)] text-xs mb-1.5">
                      <Bookmark className="w-3.5 h-3.5" />
                      Watchlist
                    </div>
                    <p className="font-semibold text-sm">4 stocks</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[var(--color-elevated)]/50 sm:col-span-1 col-span-2">
                    <div className="flex items-center gap-2 text-[var(--color-text-disabled)] text-xs mb-1.5">
                      <User className="w-3.5 h-3.5" />
                      Account Type
                    </div>
                    <Badge variant="bullish" className="mt-0.5">Free Tier</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Watchlist Overview */}
            <Card className="bg-[var(--color-surface)] border-[var(--color-border)] mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-[var(--color-bullish)]" />
                    Watchlist Overview
                  </h2>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)]">
                      View All <ArrowRight className="ml-1 w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {[
                    { symbol: "RELIANCE.NS", name: "Reliance Industries", change: 1.24 },
                    { symbol: "TCS.NS", name: "Tata Consultancy Services", change: 0.85 },
                    { symbol: "HDFCBANK.NS", name: "HDFC Bank Limited", change: -0.45 },
                    { symbol: "INFY.NS", name: "Infosys Limited", change: 0.74 },
                  ].map((stock) => (
                    <Link
                      key={stock.symbol}
                      href={`/stocks/${encodeURIComponent(stock.symbol)}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-elevated)]/50 transition-colors group"
                    >
                      <div>
                        <span className="font-semibold text-sm group-hover:text-[var(--color-bullish)] transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-xs text-[var(--color-text-disabled)] ml-2">
                          {stock.name}
                        </span>
                      </div>
                      <Badge variant={stock.change >= 0 ? "bullish" : "bearish"}>
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Settings placeholder */}
            <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
                    <div>
                      <p className="text-sm font-medium">Display Name</p>
                      <p className="text-xs text-[var(--color-text-disabled)]">{profileUser.name}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)]">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
                    <div>
                      <p className="text-sm font-medium">Email Address</p>
                      <p className="text-xs text-[var(--color-text-disabled)]">{profileUser.email}</p>
                    </div>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">Password</p>
                      <p className="text-xs text-[var(--color-text-disabled)]">Last changed: Never</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)]">Change</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
