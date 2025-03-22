import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";

function ReservationCancelOverlay(props) {
  const { closeModal } = useModalStore();
    
  function onCancel() {
    try {
      //TODO: Implement the logic
      alert("Are you sure you want to cancel this reservation?");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Button onClick={onCancel} className="w-full flex-1" variant="destructive">Confirm</Button>
      <Button onClick={() => closeModal('reservation-cancel')} className="w-full flex-1" variant="secondary">Back</Button>
    </div>
  );
}

const useReservationCancelOverlay = createModalHook(
  ReservationCancelOverlay,
  'reservation-cancel',
  "Cancel Confirmation",
  <Fragment>
    Are you sure to cancel this reservation?{" "}
    <span className="text-red-500">This action cannot be undone.</span>
  </Fragment>,
);

export { useReservationCancelOverlay, ReservationCancelOverlay };