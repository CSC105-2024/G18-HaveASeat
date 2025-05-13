import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import MerchantLayout from "@/components/layout/merchant.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { ReservationDataTable } from "@/components/datatable/merchant/reservations/table.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useReservationAddOverlay } from "@/overlay/reservation/add.jsx";
import { IconCalendarPlus, IconRefresh } from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton.jsx";

function Page() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const { open: openReservationAddOverlay } = useReservationAddOverlay();

  const fetchReservations = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/merchant/${id}/reservations`);
      setReservations(response.data.reservations || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [id]);

  const handleAddReservation = () => {
    openReservationAddOverlay({
      isManual: true,
      merchantId: id,
      onSuccess: () => {
        fetchReservations();
        toast.success("Reservation added successfully");
      },
    });
  };

  return (
    <MerchantLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Reservations List</h2>
            <p className="text-muted-foreground text-sm">
              Manage all reservations for your establishment
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchReservations}
              disabled={loading}
            >
              <IconRefresh className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleAddReservation}>
              <IconCalendarPlus className="mr-2 h-4 w-4" />
              Add Reservation
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-12">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <ReservationDataTable
              data={reservations}
              onRefresh={fetchReservations}
            />
          )}
        </div>
      </div>
    </MerchantLayout>
  );
}

export default Page;
