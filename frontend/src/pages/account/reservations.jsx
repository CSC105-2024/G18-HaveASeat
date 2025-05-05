import React from "react";
import AccountLayout from "@/components/layout/account.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { IconCalendar, IconChevronRight, IconUsers, IconTag } from "@tabler/icons-react";

function Page() {
  return (
    <AccountLayout>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Reservations</h2>
            <p className="text-sm text-muted-foreground">Book It. Sip It. Love It.!</p>
          </div>
          <Separator />
        </div>

        <div className="flex flex-col gap-12">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Up-coming Reservations</h2>
              <p className="text-sm text-muted-foreground">Don't forget these 0 reservations!</p>
            </div>
            <p>There is no reservation at this moment.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Past Reservations</h2>
              <p className="text-sm text-muted-foreground">Look like your have made 0 reservations with us.</p>
            </div>
            <p>There is no reservation at this moment.</p>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

export default Page;