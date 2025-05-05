import React from "react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge.jsx";
import { AdministratorNavigation } from "@/components/navigation/administrator/index.jsx";

function AdministratorLayout({ children }) {
  const user = true;
  const navigate = useNavigate();

  if (!user) {
    return navigate("/", {replace: true});
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative rounded-lg overflow-hidden bg-gray-50 py-20 px-12 bg-(image:--background-banner-decoration) bg-cover bg-center bg-no-repeat shadow-lg">
        <div className="absolute inset-0 flex flex-row  gap-4 px-8 items-center bg-black/10 backdrop-blur-sm text-white">
          <div className="space-y-2">
            <h1 className="ml-1 text-xl font-semibold">Welcome back, Nicole Bar!</h1>
            <div className="flex flex-row flex-wrap gap-2 text-sm">
              <Badge variant="secondary">
                <span className="font-medium">Administrator</span>{" "}
              </Badge>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-8 md:flex-row">
        <aside className="flex-3/12">
          <AdministratorNavigation />
        </aside>
        <div className="flex-9/12 py-4">{children}</div>
      </section>
    </div>
  );
}

export default AdministratorLayout;
