import React, { useEffect, useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useModalStore } from "@/store/modal.jsx";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

function UserFavouriteOverlay({ merchantId, onSuccess, onClose }) {
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFavourite = async () => {
      if (!merchantId) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/favourites`);
        const favourites = response.data?.favourites || [];
        setIsFavourite(favourites.some((fav) => fav.merchantId === merchantId));
      } catch (error) {
        console.error("Error checking favourite status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFavourite();
  }, [merchantId]);

  const toggleFavourite = async () => {
    if (!merchantId) return;

    setIsSubmitting(true);
    try {
      if (isFavourite) {
        await axiosInstance.delete(`/user/favourites`, {
          data: { merchantId },
        });
        toast.success("Removed from favourites");
        setIsFavourite(false);
      } else {
        await axiosInstance.post(`/user/favourites`, { merchantId });
        toast.success("Added to favourites");
        setIsFavourite(true);
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

  const handleClose = () => {
    closeModal("user-favourite");
    if (onClose) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
          onClick={() => handleClose}
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
