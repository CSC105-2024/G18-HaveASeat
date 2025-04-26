import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { useNavigate, useParams } from "react-router";
import { MerchantNavigation } from "@/components/navigation/merchant";
import { Badge } from "@/components/ui/badge.jsx";
import { MerchantBanner } from "@/components/merchant/banner.jsx";
import { merchantData } from "@/pages/merchant/[id]/index.jsx";

function MerchantLayout({ children }) {
  const user = true;
  const { id } = useParams();
  const navigate = useNavigate();

  if (!user || !id) {
    return navigate("/", {replace: true});
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <MerchantBanner merchant={merchantData} merchantId={id} />
      <section className="flex flex-col gap-8 md:flex-row">
        <aside className="flex-3/12">
          <MerchantNavigation merchantId={id} />
        </aside>
        <div className="flex-9/12 py-4">{children}</div>
      </section>
    </div>
  );
}

export default MerchantLayout;
