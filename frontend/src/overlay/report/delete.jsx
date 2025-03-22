import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";

function ReportDeleteOverlay(props) {
  const { closeModal } = useModalStore();

  function onDelete() {
    try {
      //TODO: Implement the logic
      alert("Are you sure you want to delete this report?");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Button onClick={onDelete} className="w-full flex-1" variant="destructive">Delete</Button>
      <Button onClick={() => closeModal('report-delete')} className="w-full flex-1" variant="secondary">Back</Button>
    </div>
  );
}

const useReportDeleteOverlay = createModalHook(
  ReportDeleteOverlay,
  'report-delete',
  "Delete Confirmation",
  <Fragment>
    Are you sure to delete this report?{" "}
    <span className="text-red-500">This action cannot be undone.</span>
  </Fragment>,
);

export { useReportDeleteOverlay, ReportDeleteOverlay };