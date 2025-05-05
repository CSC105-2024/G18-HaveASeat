import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { IconHeartFilled } from "@tabler/icons-react";

/**
 * @typedef {Object} UserFavouriteOverlayProps
 * @property {boolean} [isDelete]
 */

/**
 * @param {UserFavouriteOverlayProps} props
 * @returns {JSX.Element}
 */
function UserFavouriteOverlay({isDelete}) {
  const { closeModal } = useModalStore();

  function onDelete() {
    try {
      //TODO: Implement the logic
      alert("Are you sure you want to delete this user?");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {!isDelete ? (
        <Button onClick={onDelete} className="w-full flex-1 bg-red-500 hover:bg-red-400">
          <IconHeartFilled/>
          Favourite
        </Button>
      ) : (
        <Button onClick={onDelete} className="w-full flex-1" variant="destructive">Remove</Button>
      )}
      
      <Button onClick={() => closeModal('user-delete')} className="w-full flex-1" variant="secondary">Back</Button>
    </div>
  );
}

const useUserFavouriteOverlay = createModalHook(
  UserFavouriteOverlay,
  "user-favourite",
  ({isDelete}) => !isDelete ? "Favourite Place" : "Remove Favourite",
  ({isDelete}) => !isDelete ? "Are you sure that you want to favourite this place?" : "Are you sure that you want to remove this place from favourite?",
);

export { useUserFavouriteOverlay, UserFavouriteOverlay };
