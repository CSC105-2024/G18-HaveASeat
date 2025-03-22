import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function ReservationMarkAsCompleteOverlay(props) {
  return (
    <div></div>
  );
}

const useReservationMarkAsCompleteOverlay = createModalHook(
  ReservationMarkAsCompleteOverlay,
  'reservation-mark-as-complete',
  'Reservation Mark As Completed Confirmation',
  '',
);

export { useReservationMarkAsCompleteOverlay, ReservationMarkAsCompleteOverlay };