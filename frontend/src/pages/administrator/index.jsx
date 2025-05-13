import React from "react";
import AdministratorLayout from "@/components/layout/administrator.jsx";
import { managementMenu } from "@/components/navigation/administrator/index.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Link } from "react-router";

function Page() {
  return (
    <AdministratorLayout>
      <div className="flex flex-col gap-8 px-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Administrator Dashboard</h2>
          <Separator />
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          {managementMenu.map((item) => (
            <Link
              key={item.pathname}
              to={item.pathname}
              className="flex w-full flex-col items-center justify-center gap-4 rounded bg-gray-50 py-8 transition hover:scale-105"
            >
              <item.icon className="size-8" />
              <h3 className="font-medium">{item.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </AdministratorLayout>
  );
}

export default Page;
