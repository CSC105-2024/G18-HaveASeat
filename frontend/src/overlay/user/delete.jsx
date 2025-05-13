import React, { Fragment, useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useModalStore } from "@/store/modal.jsx";
import axiosInstance from "@/lib/axios.js";
import { toast } from "sonner";

/**
 * @typedef {Object} UserDeleteOverlayProps
 * @property {boolean} [userId]
 * @property {boolean} [onSuccess]
 */

/**
 * @param {Object} UserDeleteOverlayProps
 * @returns {Element}
 */
function UserDeleteOverlay({ userId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModalStore();

  async function onDelete() {
    if (!userId) {
      toast.error("No user ID provided");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.delete(`/users/${userId}`);
      toast.success("User deleted successfully");
      closeModal("user-delete");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Delete user error:", error);
      if (error.response?.status === 404) {
        toast.error("User not found");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this user");
      } else {
        toast.error("Failed to delete user");
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
      >
        Delete
      </Button>
      <Button
        onClick={() => closeModal("user-delete")}
        className="w-full flex-1"
        variant="secondary"
      >
        Back
      </Button>
    </div>
  );
}

const useUserDeleteOverlay = createModalHook(
  UserDeleteOverlay,
  "user-delete",
  "Delete Confirmation",
  <Fragment>
    Are you sure to delete this user?{" "}
    <span className="text-red-500">This action cannot be undone.</span>
  </Fragment>,
);

export { useUserDeleteOverlay, UserDeleteOverlay };
