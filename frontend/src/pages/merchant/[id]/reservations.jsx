import React from "react";
import { useParams } from "react-router";
import MerchantLayout from "@/components/layout/merchant.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { ReservationDataTable } from "@/components/datatable/merchant/reservations/table.jsx";

function Page() {
  const { id } = useParams();

  return (
    <MerchantLayout>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Reservations List</h2>
          <Separator />
        </div>
        <div className="flex flex-col gap-12">
          <div className="space-y-4">
            <ReservationDataTable data={[]}/>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}

export default Page;