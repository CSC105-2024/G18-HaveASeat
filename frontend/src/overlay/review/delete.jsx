import React, { Fragment, useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

/**
 * @typedef {Object} ReviewDeleteOverlayProps
 * @property {string} reviewId - ID of the review to delete
 * @property {Function} [onSuccess] - Callback function after successful deletion
 */

/**
 * @param {ReviewDeleteOverlayProps} props
 * @returns {JSX.Element}
 */
function ReviewDeleteOverlay({ reviewId, onSuccess }) {
  const { closeModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(false);

  async function onDelete() {
    if (!reviewId) {
      toast.error("No review ID provided");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.delete(`/review/${reviewId}`);
      toast.success("Review deleted successfully");

      if (onSuccess) {
        onSuccess();
      }

      closeModal("review-delete");
    } catch (error) {
      console.error("Error deleting review:", error);

      if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this review");
      } else if (error.response?.status === 404) {
        toast.error("Review not found");
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
        {isLoading ? "Deleting..." : "Delete"}
      </Button>
      <Button
        onClick={() => closeModal("review-delete")}
        className="w-full flex-1"
        variant="secondary"
        disabled={isLoading}
      >
        Cancel
      </Button>
    </div>
  );
}

const useReviewDeleteOverlay = createModalHook(
  ReviewDeleteOverlay,
  "review-delete",
  "Delete Review",
  <Fragment>
    Are you sure you want to delete this review?{" "}
    <span className="text-red-500">This action cannot be undone.</span>
  </Fragment>,
);

export { useReviewDeleteOverlay, ReviewDeleteOverlay };
