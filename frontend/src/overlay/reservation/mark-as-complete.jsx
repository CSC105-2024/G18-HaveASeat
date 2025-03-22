import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";

function ReservationMarkAsCompleteOverlay(props) {
  const { closeModal } = useModalStore();
      
  function onMarkAsComplete() {
    try {
      //TODO: Implement the logic
      alert("Are you sure you want to mark this reservation as completed?");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Button onClick={onMarkAsComplete} className="w-full flex-1">Confirm</Button>
      <Button onClick={() => closeModal('reservation-mark-as-complete')} className="w-full flex-1" variant="secondary">Back</Button>
    </div>
  );
}

const useReservationMarkAsCompleteOverlay = createModalHook(
  ReservationMarkAsCompleteOverlay,
  'reservation-mark-as-complete',
  "Mark as Completed Confirmation",
  <Fragment>
    Are you sure to mark this reservation as completed?{" "}
    <span className="text-red-500">This action cannot be undone.</span>
  </Fragment>,
);

export { useReservationMarkAsCompleteOverlay, ReservationMarkAsCompleteOverlay };