import React from "react";
import { Navigate } from "react-router";
import ProtectedRoute from "@/components/layout/protected.jsx";
import MerchantSetup from "@/components/merchant/setup.jsx";
import { useMerchantContext } from "@/providers/merchant.jsx";

function Page() {
  const { hasCompletedSetup, hasMerchant } = useMerchantContext();

  if (!hasMerchant) {
    return <Navigate to={`/`} replace={true} />;
  }

  if (!hasCompletedSetup) {
    return <Navigate to={`/merchant/setup`} replace={true} />;
  }

  return (
    <ProtectedRoute>
      <MerchantSetup />
    </ProtectedRoute>
  );
}

export default Page;
