import React, { Fragment, useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.js";

/**
 * @typedef {Object} ReportIgnoreOverlayProps
 * @property {boolean} [reportId]
 * @property {boolean} [onSuccess]
 */

/**
 * @param {Object} ReportIgnoreOverlayProps
 * @returns {JSX.Element}
 */
function ReportIgnoreOverlay({ reportId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModalStore();

  async function onIgnore() {
    if (!reportId) {
      toast.error("No report ID provided");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.patch(`/reports/${reportId}/ignore`);
      toast.success("Report ignored successfully");
      closeModal("report-ignore");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Ignore report error:", error);
      toast.error("Failed to ignore report");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Button onClick={onIgnore} className="w-full flex-1" disabled={isLoading}>
        {isLoading ? "Processing..." : "Ignore"}
      </Button>
      <Button
        onClick={() => closeModal("report-ignore")}
        className="w-full flex-1"
        variant="secondary"
        disabled={isLoading}
      >
        Cancel
      </Button>
    </div>
  );
}

const useReportIgnoreOverlay = createModalHook(
  ReportIgnoreOverlay,
  "report-ignore",
  "Ignore Report",
  <Fragment>
    Are you sure to ignore this report?{" "}
    <span className="text-amber-500">
      This will mark the report as reviewed.
    </span>
  </Fragment>,
);

export { useReportIgnoreOverlay, ReportIgnoreOverlay };
