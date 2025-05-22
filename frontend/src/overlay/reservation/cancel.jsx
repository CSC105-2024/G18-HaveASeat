import React, { useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { IconX } from "@tabler/icons-react";
import { format } from "date-fns";

function ReservationCancelOverlay({ reservation, onSuccess }) {
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!reservation?.id) return;

    try {
      setIsSubmitting(true);
      await axiosInstance.patch(`/reservation/${reservation.id}`, {
        status: "CANCELLED",
      });

      toast.success("Reservation cancelled successfully");
      closeModal("reservation-cancel");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Failed to cancel reservation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!reservation) {
    return null;
  }

  const startDate = new Date(reservation.startTime);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <IconX className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to cancel your reservation at{" "}
          <strong>{reservation.merchantName}</strong> on{" "}
          <strong>{format(startDate, "MMMM d, yyyy")}</strong> at{" "}
          <strong>{format(startDate, "h:mm a")}</strong>?
        </p>
        <p className="mt-2 text-xs text-red-500">
          This action cannot be undone.
        </p>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={handleCancel}
          className="flex-1"
          disabled={isSubmitting}
          variant="destructive"
        >
          {isSubmitting ? "Cancelling..." : "Yes, Cancel Reservation"}
        </Button>
        <Button
          onClick={() => closeModal("reservation-cancel")}
          className="flex-1"
          variant="outline"
          disabled={isSubmitting}
        >
          No, Keep It
        </Button>
      </div>
    </div>
  );
}

const useReservationCancelOverlay = createModalHook(
  ReservationCancelOverlay,
  "reservation-cancel",
  "Cancel Reservation",
  null,
);

export { useReservationCancelOverlay, ReservationCancelOverlay };
