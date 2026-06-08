"use client";

import { useRouter } from "next/navigation";
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
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Profile Header */}
          <Card className="mb-5">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
                <Avatar name={profileUser.name} size="lg" />
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{profileUser.name}</h1>
                  <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    {profileUser.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-[var(--color-bearish)] border-[var(--color-border)] hover:bg-[var(--color-bearish-muted)] hover:border-[var(--color-bearish)]"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[var(--color-elevated)]">
                  <div className="flex items-center gap-1.5 text-[var(--color-text-disabled)] text-[11px] mb-1">
                    <Calendar className="w-3 h-3" />
                    Member Since
                  </div>
                  <p className="font-semibold text-sm text-[var(--color-text-primary)]">{memberSince}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-elevated)]">
                  <div className="flex items-center gap-1.5 text-[var(--color-text-disabled)] text-[11px] mb-1">
                    <Bookmark className="w-3 h-3" />
                    Watchlist
                  </div>
                  <p className="font-semibold text-sm text-[var(--color-text-primary)]">4 stocks</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-elevated)]">
                  <div className="flex items-center gap-1.5 text-[var(--color-text-disabled)] text-[11px] mb-1">
                    <User className="w-3 h-3" />
                    Account
                  </div>
                  <Badge variant="bullish" className="mt-0.5">Free Tier</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Watchlist Overview */}
          <Card className="mb-5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm flex items-center gap-2 text-[var(--color-text-primary)]">
                  <Bookmark className="w-4 h-4 text-[var(--color-accent)]" />
                  Watchlist Overview
                </h2>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] text-xs">
                    View All <ArrowRight className="ml-1 w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-1">
                {[
                  { symbol: "RELIANCE.NS", name: "Reliance Industries", change: 1.24 },
                  { symbol: "TCS.NS", name: "Tata Consultancy Services", change: 0.85 },
                  { symbol: "HDFCBANK.NS", name: "HDFC Bank Limited", change: -0.45 },
                  { symbol: "INFY.NS", name: "Infosys Limited", change: 0.74 },
                ].map((stock) => (
                  <Link
                    key={stock.symbol}
                    href={`/stocks/${encodeURIComponent(stock.symbol)}`}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--color-elevated)] transition-colors duration-100"
                  >
                    <div>
                      <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                        {stock.symbol}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-disabled)] ml-2">
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

          {/* Account Settings */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-sm mb-4 text-[var(--color-text-primary)]">Account Settings</h2>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Display Name</p>
                    <p className="text-xs text-[var(--color-text-disabled)]">{profileUser.name}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] text-xs">Edit</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Email Address</p>
                    <p className="text-xs text-[var(--color-text-disabled)]">{profileUser.email}</p>
                  </div>
                  <Badge variant="outline">Verified</Badge>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Password</p>
                    <p className="text-xs text-[var(--color-text-disabled)]">Last changed: Never</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] text-xs">Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
