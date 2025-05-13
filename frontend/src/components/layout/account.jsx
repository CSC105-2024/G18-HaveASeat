import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { AccountNavigation } from "@/components/navigation/account/index.jsx";
import ProtectedRoute from "@/components/layout/protected.jsx";
import { useAuthStore } from "@/store/auth.js";
import { format } from "date-fns";
import Loading from "@/components/layout/loading.jsx";

function AccountLayout({ children }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-lg bg-gray-50 bg-(image:--background-banner-secondary) bg-cover bg-center bg-no-repeat px-12 py-20 shadow-lg">
          <div className="absolute inset-0 flex flex-row items-center gap-4 bg-black/10 px-8 text-white backdrop-blur-sm">
            <Avatar className="size-12 text-black">
              <AvatarFallback className="font-semibold">
                {user?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {user && (
              <div className="space-x-4">
                <h1 className="text-xl font-semibold">{user?.name}</h1>
                {user.createdAt && (
                  <span className="text-sm">
                    A member since {format(user.createdAt, "MMMM yyyy")}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-8 md:flex-row">
          <aside className="flex-3/12">
            <AccountNavigation />
          </aside>
          <div className="flex-9/12 py-4">{children}</div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

export default AccountLayout;
