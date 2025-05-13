import React, { Fragment, useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

/**
 * @typedef {Object} ReservationMarkAsCompleteOverlayProps
 * @property {string} reservationId - ID of the reservation to mark as complete
 * @property {Function} [onSuccess] - Callback function after successful completion
 */

/**
 * @param {ReservationMarkAsCompleteOverlayProps} props
 * @returns {JSX.Element}
 */
function ReservationMarkAsCompleteOverlay({ reservationId, onSuccess }) {
  const { closeModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(false);

  async function onMarkAsComplete() {
    if (!reservationId) {
      toast.error("No reservation ID provided");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.patch(`/reservation/${reservationId}`, {
        status: "COMPLETED",
      });

      toast.success("Reservation marked as completed");

      if (onSuccess) {
        onSuccess();
      }

      closeModal("reservation-mark-as-complete");
    } catch (error) {
      console.error("Error marking reservation as complete:", error);

      if (error.response?.status === 403) {
        toast.error("You don't have permission to update this reservation");
      } else if (error.response?.status === 404) {
        toast.error("Reservation not found");
      } else if (error.response?.status === 400) {
        toast.error(
          error.response.data.error || "Reservation cannot be updated",
        );
      } else {
        toast.error("Failed to update reservation");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Button
        onClick={onMarkAsComplete}
        className="w-full flex-1"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Confirm"}
      </Button>
      <Button
        onClick={() => closeModal("reservation-mark-as-complete")}
        className="w-full flex-1"
        variant="secondary"
        disabled={isLoading}
      >
        Back
      </Button>
    </div>
  );
}

const useReservationMarkAsCompleteOverlay = createModalHook(
  ReservationMarkAsCompleteOverlay,
  "reservation-mark-as-complete",
  "Mark Reservation as Completed",
  <Fragment>
    Are you sure you want to mark this reservation as completed?{" "}
    <span className="text-blue-500">
      This will update the reservation status and free up the seat for new
      reservations.
    </span>
  </Fragment>,
  "sm",
);

export {
  useReservationMarkAsCompleteOverlay,
  ReservationMarkAsCompleteOverlay,
};
