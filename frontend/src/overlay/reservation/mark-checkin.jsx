import React, { useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useModalStore } from "@/store/modal.jsx";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { IconUserCheck } from "@tabler/icons-react";

function ReservationCheckInOverlay({ reservationId, customerName, onSuccess }) {
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckIn = async () => {
    if (!reservationId) return;

    try {
      setIsSubmitting(true);
      await axiosInstance.patch(`/reservation/${reservationId}`, {
        status: "CHECKED_IN",
      });

      toast.success("Customer checked in successfully");
      closeModal("reservation-check-in");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error checking in customer:", error);
      toast.error("Failed to check in customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <IconUserCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-medium">Check In Customer</h3>
        <p className="text-muted-foreground text-sm">
          Confirm that {customerName} has arrived for their reservation?
        </p>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={handleCheckIn}
          className="flex-1"
          disabled={isSubmitting}
          variant="default"
        >
          {isSubmitting ? "Processing..." : "Yes, Check In"}
        </Button>
        <Button
          onClick={() => closeModal("reservation-check-in")}
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

const useReservationCheckInOverlay = createModalHook(
  ReservationCheckInOverlay,
  "reservation-check-in",
  "Check In Customer",
  null,
);

export { useReservationCheckInOverlay, ReservationCheckInOverlay };
