"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Activity, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/services/auth-api";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = useMemo(() => ({
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }), [password]);

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (passwordStrength < 3) {
      setError("Please use a stronger password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.register(name, email, password);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        router.push("/dashboard");
      } else {
        setError(res.error || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Activity className="h-6 w-6 text-[var(--color-bullish)]" />
            <span className="font-bold text-xl text-[var(--color-text-primary)]">StockVista</span>
          </Link>
          <h1 className="text-xl font-bold mb-1 text-[var(--color-text-primary)]">Create your account</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Start tracking stocks in under 30 seconds
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <div className="px-3 py-2.5 rounded-lg bg-[var(--color-bearish-muted)] border border-[var(--color-bearish)]/20 text-sm text-[var(--color-bearish)]">
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-disabled)]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priyanshu Sharma"
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all duration-150"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
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
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all duration-150"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-disabled)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full h-10 pl-10 pr-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all duration-150"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-disabled)] hover:text-[var(--color-text-secondary)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                            passwordStrength >= level
                              ? passwordStrength <= 2 ? "bg-[var(--color-bearish)]"
                                : passwordStrength === 3 ? "bg-[var(--color-warning)]"
                                : "bg-[var(--color-bullish)]"
                              : "bg-[var(--color-border)]"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { key: "length", label: "6+ characters" },
                        { key: "uppercase", label: "Uppercase" },
                        { key: "lowercase", label: "Lowercase" },
                        { key: "number", label: "Number" },
                      ].map((check) => (
                        <div
                          key={check.key}
                          className={`flex items-center gap-1 text-[11px] ${
                            passwordChecks[check.key as keyof typeof passwordChecks]
                              ? "text-[var(--color-bullish)]"
                              : "text-[var(--color-text-disabled)]"
                          }`}
                        >
                          {passwordChecks[check.key as keyof typeof passwordChecks] ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          {check.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="w-full h-10"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Link to login */}
            <div className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[var(--color-accent)] hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
