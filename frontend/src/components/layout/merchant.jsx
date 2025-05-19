import React from "react";
import { MerchantNavigation } from "@/components/navigation/merchant";
import { MerchantBanner } from "@/components/merchant/banner.jsx";
import ProtectedRoute from "@/components/layout/protected.jsx";
import MerchantSetupGuard from "@/components/merchant/setup-guard.jsx";
import { useAuthStore } from "@/store/auth.js";
import Loading from "@/components/layout/loading.jsx";
import { useMerchantContext } from "@/providers/merchant.jsx";
import { Navigate, useParams } from "react-router";

function MerchantLayout({ children }) {
  const {id} = useParams();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const {
    merchantId,
    merchant,
    loading: isMerchantLoading,
    hasCompletedSetup,
  } = useMerchantContext();

  if (isAuthLoading || isMerchantLoading) {
    return <Loading />;
  }

  if (!merchant || merchant && merchant.ownerId !== user?.id) {
    if (merchant?.id) {
      return <Navigate to={`/merchant/${id}`} replace={true} />;
    }

    if (!id) {
      return <Navigate to={`/`} replace={true} />;
    }
  }

  return (
    <ProtectedRoute>
      <MerchantSetupGuard>
        <div className="mx-auto max-w-7xl space-y-8">
          <MerchantBanner merchant={merchant} merchantId={merchantId} />
          <section className="flex flex-col gap-8 md:flex-row">
            <aside className="flex-3/12">
              <MerchantNavigation merchantId={merchantId} hasCompletedSetup={hasCompletedSetup} />
            </aside>
            <div className="flex-9/12 py-4">{children}</div>
          </section>
        </div>
      </MerchantSetupGuard>
    </ProtectedRoute>
  );
}

export default MerchantLayout;
