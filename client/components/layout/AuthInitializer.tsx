"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

/**
 * Client component that initializes auth state from localStorage on mount.
 * Placed in the root layout to run once on app start.
 */
export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
