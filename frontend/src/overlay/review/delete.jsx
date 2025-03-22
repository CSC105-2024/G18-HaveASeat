import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function ReviewDeleteOverlay() {
  return (
    <div></div>
  );
}

const useReviewDeleteOverlay = createModalHook(
  ReviewDeleteOverlay,
  'review-delete',
  'Review Delete Confirmation',
  '',
);

export { useReviewDeleteOverlay };