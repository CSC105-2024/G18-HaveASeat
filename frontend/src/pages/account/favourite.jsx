import React from "react";
import AccountLayout from "@/components/layout/account.jsx";
import { Separator } from "@/components/ui/separator.jsx";

function Page() {
  return (
    <AccountLayout>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Favourite</h2>
            <p className="text-sm text-muted-foreground">Let's see what you got here!</p>
          </div>
          <Separator />
        </div>
        <div className="flex flex-col gap-12">
          <div className="space-y-4">
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

export default Page;
