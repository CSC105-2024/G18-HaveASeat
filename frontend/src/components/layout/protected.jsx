import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import Loading from "@/components/layout/loading.jsx";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    toast.error("Sign in required to proceed with this action.");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
