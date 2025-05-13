import React, { useEffect, useState } from "react";
import AccountLayout from "@/components/layout/account.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Button } from "@/components/ui/button.jsx";
import { constructAPIUrl } from "@/lib/url.js";
import {
  IconHeart,
  IconHeartFilled,
  IconStarFilled,
} from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { formatNumberDecimalPoint } from "@/lib/formatter.js";
import { useUserFavouriteOverlay } from "@/overlay/user/favourite.jsx";

function Page() {
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);
  const { open: openUserFavouriteOverlay } = useUserFavouriteOverlay();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/user/favourites");
        setFavourites(response.data.favourites || []);
      } catch (error) {
        console.error("Error fetching favourites:", error);
        toast.error("Failed to load favourites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const handleRemoveFavourite = (merchantId) => {
    openUserFavouriteOverlay({
      merchantId,
      onSuccess: () => {
        setFavourites((prev) =>
          prev.filter((fav) => fav.merchantId !== merchantId),
        );
      },
    });
  };

  return (
    <AccountLayout>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">My Favourites</h2>
            <p className="text-muted-foreground text-sm">
              Let's see what you got here!
            </p>
          </div>
          <Separator />
        </div>
        <div className="flex flex-col gap-12">
          <div className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : favourites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <IconHeart className="mb-4 h-16 w-16 text-gray-300" />
                <h3 className="text-lg font-medium">No Favourites Yet</h3>
                <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                  You haven't added any merchants to your favourites list.
                  Browse merchants and click the heart icon to add them here.
                </p>
                <Link to="/" className="mt-6">
                  <Button>Explore Merchants</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favourites.map((favourite) => (
                  <div
                    key={favourite.merchantId}
                    className="group relative flex flex-col overflow-hidden rounded-lg border transition-all hover:shadow-md"
                  >
                    {/* Banner Image */}
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                      {favourite.bannerImage ? (
                        <img
                          src={constructAPIUrl(favourite.bannerImage)}
                          alt={favourite.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <IconHeart className="h-12 w-12 text-gray-300" />
                        </div>
                      )}

                      {/* Remove favorite button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFavourite(favourite.merchantId);
                        }}
                        className="absolute top-2 right-2 rounded-full bg-white/80 p-2 text-red-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white"
                        aria-label="Remove from favourites"
                      >
                        <IconHeartFilled className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <Link
                      to={`/merchant/${favourite.merchantId}`}
                      className="flex flex-1 flex-col p-4"
                    >
                      <h3 className="mb-1 font-medium">{favourite.name}</h3>

                      {/* Location */}
                      {favourite.location && (
                        <p className="text-muted-foreground text-xs">
                          {favourite.location}
                        </p>
                      )}

                      {/* Rating */}
                      <div className="mt-2 flex items-center gap-1">
                        <IconStarFilled className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">
                          {formatNumberDecimalPoint(
                            favourite.averageRating || 0,
                          )}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          ({favourite.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Description */}
                      {favourite.description && (
                        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                          {favourite.description}
                        </p>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

export default Page;
