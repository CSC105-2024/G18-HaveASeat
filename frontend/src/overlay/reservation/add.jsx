import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

/**
 * @typedef {Object} ReservationAddOverlayProps
 * @property {boolean | undefined} isManual
 */

/**
 * @param {ReservationAddOverlayProps} props
 * @returns {JSX.Element}
 */
function ReservationAddOverlay({isManual = false}) {
  return (
    <div></div>
  );
}

const useReservationAddOverlay = createModalHook(
  ReservationAddOverlay,
  'reservation-add-modal',
  'Reservation Add',
  '',
);

export { useReservationAddOverlay };