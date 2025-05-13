import React from "react";
import { Badge } from "@/components/ui/badge.jsx";
import { AdministratorNavigation } from "@/components/navigation/administrator/index.jsx";
import ProtectedRoute from "@/components/layout/protected.jsx";
import { useAuthStore } from "@/store/auth.js";
import Loading from "@/components/layout/loading.jsx";

function AdministratorLayout({ children }) {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-lg bg-gray-50 bg-(image:--background-banner-decoration) bg-cover bg-center bg-no-repeat px-12 py-20 shadow-lg">
          <div className="absolute inset-0 flex flex-row items-center gap-4 bg-black/10 px-8 text-white backdrop-blur-sm">
            <div className="space-y-2">
              <h1 className="ml-1 text-xl font-semibold">
                Welcome back, Nicole Bar!
              </h1>
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
    </ProtectedRoute>
  );
}

export default AdministratorLayout;
