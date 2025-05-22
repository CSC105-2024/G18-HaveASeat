import React, { useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { useFavoritesStore } from "@/store/favorites";
import { toast } from "sonner";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

function UserFavouriteOverlay({ merchantId, onSuccess }) {
  const { closeModal } = useModalStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFavourite = merchantId ? isFavorite(merchantId) : false;

  const toggleFavourite = async () => {
    if (!merchantId) return;

    setIsSubmitting(true);
    try {
      if (isFavourite) {
        await removeFavorite(merchantId);
        toast.success("Removed from favourites");
      } else {
        await addFavorite(merchantId);
        toast.success("Added to favourites");
      }

      if (onSuccess) {
        onSuccess();
      }
      closeModal("user-favourite");
    } catch (error) {
      console.error("Error toggling favourite:", error);
      toast.error(
        isFavourite
          ? "Failed to remove from favourites"
          : "Failed to add to favourites",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          {isFavourite ? (
            <IconHeartFilled className="h-16 w-16 text-red-500" />
          ) : (
            <IconHeart className="h-16 w-16 text-gray-400" />
          )}
        </div>
        <h3 className="mb-2 text-lg font-medium">
          {isFavourite
            ? "This merchant is in your favourites"
            : "Add this merchant to your favourites?"}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isFavourite
            ? "You can remove it from your favourites if you wish."
            : "You'll be able to find it easily later."}
        </p>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={toggleFavourite}
          className="flex-1"
          disabled={isSubmitting}
          variant={isFavourite ? "destructive" : "default"}
        >
          {isSubmitting
            ? isFavourite
              ? "Removing..."
              : "Adding..."
            : isFavourite
              ? "Remove from Favourites"
              : "Add to Favourites"}
        </Button>
        <Button
          onClick={() => closeModal("user-favourite")}
          className="flex-1"
          variant="outline"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

const useUserFavouriteOverlay = createModalHook(
  UserFavouriteOverlay,
  "user-favourite",
  "Favourite",
  null,
);

export { useUserFavouriteOverlay, UserFavouriteOverlay };
