import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function ReportDeleteOverlay(props) {
  return (
    <div></div>
  );
}

const useReportDeleteOverlay = createModalHook(
  ReportDeleteOverlay,
  'report-delete',
  'Report Delete Confirmation',
  '',
);

export { useReportDeleteOverlay };