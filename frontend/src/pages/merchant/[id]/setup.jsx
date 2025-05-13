import React from "react";
import ProtectedRoute from "@/components/layout/protected.jsx";
import MerchantSetup from "@/components/merchant/setup.jsx";

function Page() {
  return (
    <ProtectedRoute>
      <MerchantSetup />
    </ProtectedRoute>
  );
}

export default Page;
