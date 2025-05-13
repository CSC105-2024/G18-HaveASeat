import React, { Fragment, useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.js";

/**
 * @typedef {Object} ReportDeleteOverlayProps
 * @property {boolean} [reportId]
 * @property {boolean} [onSuccess]
 */

/**
 * @param {Object} ReportDeleteOverlayProps
 * @returns {JSX.Element}
 */
function ReportDeleteOverlay({ reportId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModalStore();

  async function onDelete() {
    if (!reportId) {
      toast.error("No report ID provided");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.delete(`/reports/${reportId}`);
      toast.success("Report deleted successfully");
      closeModal("report-delete");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Delete report error:", error);
      if (error.response?.status === 403) {
        toast.error("You are not authorized to delete this review");
      } else {
        toast.error("Failed to delete review");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Button
        onClick={onDelete}
        className="w-full flex-1"
        variant="destructive"
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Yes, Delete"}
      </Button>
      <Button
        onClick={() => closeModal("report-delete")}
        className="w-full flex-1"
        variant="secondary"
        disabled={isLoading}
      >
        Cancel
      </Button>
    </div>
  );
}

const useReportDeleteOverlay = createModalHook(
  ReportDeleteOverlay,
  "report-delete",
  "Delete Report",
  <Fragment>
    Are you sure you want to delete this report?{" "}
    <span className="text-red-500">This action cannot be undone.</span>
  </Fragment>,
);

export { useReportDeleteOverlay, ReportDeleteOverlay };
