import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";

function ReviewDeleteOverlay() {
  const { closeModal } = useModalStore();
      
  function onMarkAsComplete() {
    try {
      //TODO: Implement the logic
      alert("Are you sure you want to delete this review?");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Button onClick={onMarkAsComplete} className="w-full flex-1" variant="destructive">Delete</Button>
      <Button onClick={() => closeModal('review-delete')} className="w-full flex-1" variant="secondary">Back</Button>
    </div>
  );
}

const useReviewDeleteOverlay = createModalHook(
  ReviewDeleteOverlay,
  'review-delete',
  "Delete Confirmation",
  <Fragment>
    Are you sure to delete this review?{" "}
    <span className="text-red-500">This action cannot be undone.</span>
  </Fragment>,
);

export { useReviewDeleteOverlay, ReviewDeleteOverlay };