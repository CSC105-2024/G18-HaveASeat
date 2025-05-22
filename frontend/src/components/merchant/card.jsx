import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  IconHeart,
  IconHeartFilled,
  IconStarFilled,
} from "@tabler/icons-react";
import { formatNumberDecimalPoint } from "@/lib/formatter.js";
import { cn } from "@/lib/utils.js";
import { constructAPIUrl } from "@/lib/url.js";
import { useAuthStore } from "@/store/auth";
import { useUserFavouriteOverlay } from "@/overlay/user/favourite.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

/**
 * @param {Object} props
 * @param {string} props.merchantId
 * @param {string} props.image
 * @param {string} props.name
 * @param {string} props.location
 * @param {number|string} props.rating
 * @param {boolean} props.favorite
 * @param {boolean} props.isFavoriteCount
 * @param {string} props.description
 * @param {Function} props.onFavoriteToggle
 * @param {string} props.className
 */
function MerchantCard({
  merchantId,
  image,
  name,
  location,
  rating,
  favorite = false,
  isFavoriteCount = false,
  description,
  onFavoriteToggle,
  className,
}) {
  const { isAuthenticated } = useAuthStore();
  const { modals } = useModalStore();
  const [isFavorite, setIsFavorite] = useState(favorite);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const { open: openUserFavouriteOverlay } = useUserFavouriteOverlay();
  const loadingTimeoutRef = useRef(null);

  useEffect(() => {
    const isModalOpen = modals["user-favourite"]?.isOpen;

    if (favoriteLoading && !isModalOpen) {
      setFavoriteLoading(false);
    }
  }, [modals, favoriteLoading]);

  useEffect(() => {
    const checkFavouriteStatus = async () => {
      if (!isAuthenticated || !merchantId) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/user/favourites`);
        const favourites = response.data?.favourites || [];
        const isCurrentlyFavorite = favourites.some((fav) => fav.merchantId === merchantId);
        setIsFavorite(isCurrentlyFavorite);
      } catch (_) {
        setIsFavorite(favorite);
      }
    };

    checkFavouriteStatus();
  }, [isAuthenticated, merchantId, favorite]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to add to favorites");
      return;
    }

    if (!merchantId) {
      console.error("Missing merchant ID");
      return;
    }

    setFavoriteLoading(true);

    loadingTimeoutRef.current = setTimeout(() => {
      setFavoriteLoading(false);
    }, 10000);

    openUserFavouriteOverlay({
      merchantId,
      onSuccess: async () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }

        try {
          const response = await axiosInstance.get(`/user/favourites`);
          const favourites = response.data?.favourites || [];
          const newFavoriteState = favourites.some((fav) => fav.merchantId === merchantId);

          setIsFavorite(newFavoriteState);

          if (onFavoriteToggle) {
            onFavoriteToggle(merchantId, newFavoriteState);
          }
        } catch (error) {
          console.error("Error syncing favourite status:", error);
          // Fallback to simple toggle if sync fails
          const newFavoriteState = !isFavorite;
          setIsFavorite(newFavoriteState);
          if (onFavoriteToggle) {
            onFavoriteToggle(merchantId, newFavoriteState);
          }
        } finally {
          setFavoriteLoading(false);
        }
      },
    });
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border transition-all hover:shadow-md",
        className,
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image.startsWith("http") ? image : constructAPIUrl(image)}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <IconHeart className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* Favorite Button */}
        {isAuthenticated && merchantId && (
          <button
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
            className={cn(
              "absolute top-2 right-2 rounded-full bg-white/80 p-2 shadow-sm transition-opacity hover:bg-white",
              isFavorite ? "text-red-500" : "text-gray-400",
              favoriteLoading
                ? "cursor-not-allowed opacity-50"
                : "group-hover:opacity-100",
              !isFavorite && "opacity-0",
            )}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <IconHeartFilled className="h-5 w-5" />
            ) : (
              <IconHeart className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <Link
        to={merchantId ? `/merchant/${merchantId}` : "#"}
        className="flex flex-1 flex-col p-4"
      >
        <h3 className="mb-1 line-clamp-1 font-medium">{name}</h3>

        {/* Location */}
        {location && (
          <p className="text-muted-foreground text-xs">{location}</p>
        )}

        {/* Rating or Favorite Count */}
        <div className="mt-2 flex items-center gap-1">
          {isFavoriteCount ? (
            <>
              <IconHeartFilled className="h-4 w-4 text-red-500" />
              <span className="text-sm">{rating}</span>
              <span className="text-muted-foreground text-xs">favorites</span>
            </>
          ) : (
            <>
              <IconStarFilled className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">
                {typeof rating === "number"
                  ? formatNumberDecimalPoint(rating || 0)
                  : rating}
              </span>
              {typeof rating === "number" && (
                <span className="text-muted-foreground text-xs">rating</span>
              )}
            </>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
            {description}
          </p>
        )}
      </Link>
    </div>
  );
}

export { MerchantCard };