"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      restoreSession();
    }
  }, [restoreSession]);

  return <>{children}</>;
}
