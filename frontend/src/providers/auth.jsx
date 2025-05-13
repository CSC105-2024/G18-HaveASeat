import React, { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import Loading from "@/components/layout/loading.jsx";

export function AuthProvider({ children }) {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <Loading />;
  }

  return children;
}
