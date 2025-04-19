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
              <p className="text-sm text-muted-foreground">Don't forget these X reservations!</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Past Reservations</h2>
              <p className="text-sm text-muted-foreground">Look like your have made X reservations with us.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-6 max-w-6xl w-full">
          {/* Card 1 */}
          <div className="bg-gray-100 p-4 rounded-xl shadow-md w-full max-w-sm">
            <img
              src="https://i.pinimg.com/736x/fc/84/ec/fc84ecf119dabf3cef590de566548469.jpg"
              alt="Bar"
              className="object-cover w-full h-48 rounded-lg"
            />
            <h2 className="text-xl mt-4">Bar Name</h2>
            <div className="text-gray-500 mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconCalendar size={16} />
                  <span className="text-sm">Date & Time: 18 July 2025 at 18:00</span>
                </div>
                <IconChevronRight size={16} />
              </div>
              <div className="flex items-center gap-2">
                <IconUsers size={16} />
                <span className="text-sm">Guests: 8</span>
              </div>
              <div className="flex items-center gap-2">
                <IconTag size={16} />
                <span className="text-sm">Tables: 2 (A12, A13)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AccountLayout>
  );
}

export default Page;