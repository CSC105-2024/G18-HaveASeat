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
      <section className="flex flex-row items-center gap-4 rounded-lg bg-gray-50 px-8 py-16">
        <div className="space-y-2">
          <h1 className="ml-1 text-xl font-semibold">Welcome back, Nicole Bar!</h1>
          <div className="flex flex-row flex-wrap gap-2 text-sm">
            <Badge variant="secondary">
              <span className="font-medium">Administrator</span>{" "}
            </Badge>
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
