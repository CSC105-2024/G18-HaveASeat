import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";

function ReviewReportOverlay() {
  const { closeModal } = useModalStore();
        
  function onMarkAsComplete() {
    try {
      //TODO: Implement the logic
      alert("Are you sure you want to report this review?");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Button onClick={onMarkAsComplete} className="w-full flex-1" variant="destructive">Report</Button>
      <Button onClick={() => closeModal('review-report')} className="w-full flex-1" variant="secondary">Back</Button>
    </div>
  );
}

const useReviewReportOverlay = createModalHook(
  ReviewReportOverlay,
  'review-report',
  "Report Confirmation",
  <Fragment>
    Are you sure to report this review?{" "}
    <span className="text-red-500">The platform adimistrator will process this report as soon as possible.</span>
  </Fragment>,
);

export { useReviewReportOverlay, ReviewReportOverlay };