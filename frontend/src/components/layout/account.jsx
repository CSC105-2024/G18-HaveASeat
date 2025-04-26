import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { AccountNavigation } from "@/components/navigation/account/index.jsx";
import { useNavigate } from "react-router";

function AccountLayout({ children }) {
  const user = true;
  const navigate = useNavigate();

  if (!user) {
    return navigate("/", {replace: true});
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative rounded-lg overflow-hidden bg-gray-50 py-20 px-12 bg-(image:--background-banner-secondary) bg-cover bg-center bg-no-repeat shadow-lg">
        <div
          className="absolute inset-0 flex flex-row  gap-4 px-8 items-center bg-black/10 backdrop-blur-sm text-white">
          <Avatar className="size-12 text-black">
            <AvatarFallback className="font-semibold">F</AvatarFallback>
          </Avatar>
          <div className="space-x-4">
            <h1 className="text-xl font-semibold">Nicole Bars</h1>
            <span className="text-sm">A member since 2025</span>
          </div>
        </div>
      </section>
      <section className="flex flex-col md:flex-row gap-8">
        <aside className="flex-3/12">
          <AccountNavigation/>
        </aside>
        <div className="flex-9/12 py-4">
          {children}
        </div>
      </section>
    </div>
  );
}

export default AccountLayout;
