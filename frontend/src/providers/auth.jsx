import React, { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import Loading from "@/components/layout/loading.jsx";

export function AuthProvider({ children }) {
  const { fetchCurrentUser, isLoading } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  if (isLoading) {
    return <Loading />;
  }

  return children;
}
