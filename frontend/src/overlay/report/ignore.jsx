import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function ReportIgnoreOverlay(props) {
  return (
    <div></div>
  );
}

const useReportIgnoreOverlay = createModalHook(
  ReportIgnoreOverlay,
  'report-ignore',
  'Report Ignore Confirmation',
  '',
);

export { useReportIgnoreOverlay, ReportIgnoreOverlay };