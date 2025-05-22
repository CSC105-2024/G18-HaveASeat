import React, { useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useModalStore } from "@/store/modal.jsx";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { IconUserOff } from "@tabler/icons-react";

function ReservationNoShowOverlay({ reservationId, customerName, onSuccess }) {
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkAsNoShow = async () => {
    if (!reservationId) return;

    try {
      setIsSubmitting(true);
      await axiosInstance.patch(`/reservation/${reservationId}`, {
        status: "NO_SHOW",
      });

      toast.success("Reservation marked as no-show");
      closeModal("reservation-no-show");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating reservation status:", error);
      toast.error("Failed to update reservation status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-amber-100 p-3">
            <IconUserOff className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-medium">Mark as No-Show</h3>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to mark {customerName}'s reservation as a
          no-show?
        </p>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={handleMarkAsNoShow}
          className="flex-1"
          disabled={isSubmitting}
          variant="warning"
        >
          {isSubmitting ? "Processing..." : "Yes, Mark as No-Show"}
        </Button>
        <Button
          onClick={() => closeModal("reservation-no-show")}
          className="flex-1"
          variant="outline"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

const useReservationNoShowOverlay = createModalHook(
  ReservationNoShowOverlay,
  "reservation-no-show",
  "Mark as No-Show",
  null,
);

export { useReservationNoShowOverlay, ReservationNoShowOverlay };
