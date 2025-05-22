import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router";
import axiosInstance from "@/lib/axios";

function MerchantSetupGuard({ children }) {
  const { id } = useParams();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [setupStatus, setSetupStatus] = useState(null);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await axiosInstance.get(`/merchant/${id}/status`);
        setSetupStatus(response.data);
      } catch (error) {
        console.error("Error checking merchant setup status:", error);
      } finally {
        setChecking(false);
      }
    };

    if (id) {
      checkSetupStatus();
    }
  }, [id]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (setupStatus && !setupStatus.isComplete) {
    const currentPath = location.pathname;
    if (!currentPath.includes("/settings") && !currentPath.includes("/setup")) {
      return <Navigate to={`/merchant/setup`} replace />;
    }
  }

  return children;
}

export default MerchantSetupGuard;
