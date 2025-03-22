import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function ReservationCancelOverlay(props) {
  return (
    <div></div>
  );
}

const useReservationCancelOverlay = createModalHook(
  ReservationCancelOverlay,
  'reservation-cancel',
  'Reservation Cancel Confirmation',
  '',
);

export { useReservationCancelOverlay };