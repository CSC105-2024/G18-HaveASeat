import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { useNavigate, useParams } from "react-router";
import { MerchantNavigation } from "@/components/navigation/merchant";
import { Badge } from "@/components/ui/badge.jsx";

function MerchantLayout({ children }) {
  const user = true;
  const { id } = useParams();
  const navigate = useNavigate();

  if (!user || !id) {
    return navigate("/", {replace: true});
  }

  const store = {
    id: id,
    name: "Summy Bar",
    telephone: "+66123456789",
    address:
      "126 Pracha Uthit Rd., Bang Mot Subdistrict, Thung Khru District, Bangkok 10140",
    open_hours: {
      Sunday: "10:00 - 00:00",
      Monday: "10:00 - 00:00",
      Tuesday: "10:00 - 00:00",
      Wednesday: "10:00 - 00:00",
      Thursday: "10:00 - 00:00",
      Friday: "10:00 - 00:00",
      Saturday: "10:00 - 00:00",
    },
    created_at: new Date(),
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-row items-center gap-4 rounded-lg bg-gray-50 px-8 py-16">
        <div className="space-y-2">
          <h1 className="ml-1 text-xl font-semibold">{store.name}</h1>
          <div className="flex flex-row flex-wrap gap-2 text-sm">
            <Badge variant="secondary">
              <span className="font-medium">Since</span>{" "}
              {store.created_at.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </Badge>
            {import.meta.env.DEV && (
              <Badge variant="secondary">
                <span className="font-medium">ID</span> {id}
              </Badge>
            )}
          </div>
        </div>
      </section>
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
