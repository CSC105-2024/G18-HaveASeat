import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function ReviewReportOverlay() {
  return (
    <div></div>
  );
}

const useReviewReportOverlay = createModalHook(
  ReviewReportOverlay,
  'review-report',
  'Review Report Confirmation',
  '',
);

export { useReviewReportOverlay };