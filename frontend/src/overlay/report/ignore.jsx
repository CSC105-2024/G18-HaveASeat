import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";

function ReportIgnoreOverlay(props) {
  const { closeModal } = useModalStore();
  
  function onIgnore() {
    try {
      //TODO: Implement the logic
      alert("Are you sure you want to ignore this report?");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Button onClick={onIgnore} className="w-full flex-1">Confirm</Button>
      <Button onClick={() => closeModal('report-ignore')} className="w-full flex-1" variant="secondary">Back</Button>
    </div>
  );
}

const useReportIgnoreOverlay = createModalHook(
  ReportIgnoreOverlay,
  'report-ignore',
  "Ignore Confirmation",
  <Fragment>
    Are you sure to ignore this report?{" "}
    <span className="text-red-500">This action cannot be undone.</span>
  </Fragment>,
);

export { useReportIgnoreOverlay, ReportIgnoreOverlay };