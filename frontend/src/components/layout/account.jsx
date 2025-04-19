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
      <section className="flex flex-row items-center gap-4 rounded-lg bg-gray-50 px-4 py-16">
        <Avatar className="size-12">
          <AvatarFallback className="font-semibold">F</AvatarFallback>
        </Avatar>
        <div className="space-x-4">
          <h1 className="text-xl font-semibold">Nicole Bars</h1>
          <span className="text-sm">A member since 2025</span>
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
