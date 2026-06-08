"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/services/auth-api";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        router.push("/dashboard");
      } else {
        setError(res.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full bg-[var(--color-bullish)] opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Activity className="h-8 w-8 text-[var(--color-bullish)]" />
            <span className="font-bold text-2xl">StockVista</span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Sign in to access your dashboard and watchlist
          </p>
        </div>

        <Card className="bg-[var(--color-surface)]/80 backdrop-blur-md border-[var(--color-border)] card-shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error message */}
              {error && (
                <div className="px-4 py-3 rounded-lg bg-[var(--color-bearish-muted)] border border-[var(--color-bearish)]/20 text-sm text-[var(--color-bearish)] animate-slide-down">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-disabled)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bullish)] focus:border-transparent transition-all"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-disabled)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bullish)] focus:border-transparent transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-disabled)] hover:text-[var(--color-text-secondary)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[var(--color-bullish)] hover:bg-[var(--color-bullish-hover)] text-black border-none font-semibold text-sm rounded-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Link to register */}
            <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-[var(--color-bullish)] hover:underline font-medium">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
