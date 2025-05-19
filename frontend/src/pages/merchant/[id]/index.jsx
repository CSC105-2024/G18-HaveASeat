import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { cn } from "@/lib/utils.js";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useUserFavouriteOverlay } from "@/overlay/user/favourite.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MerchantBanner } from "@/components/merchant/banner.jsx";
import { MerchantReviewSection } from "@/components/review/section.jsx";
import { useReservationAddOverlay } from "@/overlay/reservation/add.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import axiosInstance from "@/lib/axios";
import { useMerchantContext } from "@/providers/merchant.jsx";
import { useAuthStore } from "@/store/auth";
import { constructAPIUrl } from "@/lib/url.js";

function Page() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const { isOwner, hasCompletedSetup } = useMerchantContext();

  const [loading, setLoading] = useState(true);
  const [merchant, setMerchant] = useState(null);
  const [error, setError] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [checkingFavourite, setCheckingFavourite] = useState(false);

  const { open: openUserFavouriteOverlay } = useUserFavouriteOverlay();
  const { open: openReservationAddOverlay } = useReservationAddOverlay();

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/merchant/${id}`);
        setMerchant(response.data);
      } catch (error) {
        console.error("Error fetching merchant:", error);
        setError("Failed to load merchant data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMerchant();
    }
  }, [id]);

  useEffect(() => {
    const checkFavouriteStatus = async () => {
      if (!isAuthenticated || !id) return;

      try {
        setCheckingFavourite(true);
        const response = await axiosInstance.get("/user/favourites");
        const favourites = response.data?.favourites || [];
        setIsFavourite(favourites.some((fav) => fav.merchantId === id));
      } catch (error) {
        console.error("Error checking favourite status:", error);
      } finally {
        setCheckingFavourite(false);
      }
    };

    checkFavouriteStatus();
  }, [id, isAuthenticated]);

  const handleToggleFavourite = () => {
    openUserFavouriteOverlay({
      merchantId: id,
      onSuccess: () => {
        setIsFavourite((prev) => !prev);
      },
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="flex flex-col gap-8 lg:flex-row">
          <Skeleton className="h-96 w-full lg:w-3/12" />
          <div className="flex w-full flex-col gap-8 lg:w-9/12">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-video" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !merchant || !hasCompletedSetup) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{error || "Merchant not found"}</h1>
        <p className="text-muted-foreground mt-4">
          The merchant you're looking for might not exist or has been removed.
        </p>
        <Link
          to="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-8")}
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Banner Section */}
      <MerchantBanner merchant={merchant} merchantId={id} />

      <section className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="flex-3/12 space-y-4 py-4">
          <div className="">
            <div className="space-y-2">
              <div className="flex flex-row flex-wrap gap-4">
                {isAuthenticated && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handleToggleFavourite}
                        className="max-sm:w-full lg:size-9"
                      >
                        {checkingFavourite ? (
                          <div className="h-4 w-4 animate-pulse rounded-full" />
                        ) : isFavourite ? (
                          <IconHeartFilled className="text-red-500" />
                        ) : (
                          <IconHeart />
                        )}
                        <span className="lg:hidden">
                          {isFavourite ? "Favourited" : "Favourite"}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isFavourite
                          ? "Remove from Favourites"
                          : "Add to Favourites"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Button
                  className="w-full flex-1"
                  onClick={() => openReservationAddOverlay({ merchantId: id })}
                >
                  Make A Reservation
                </Button>
              </div>

              {/* Show reservation list link for merchant owner or admins */}
              {isOwner && (
                <Link
                  to={`/merchant/${id}/reservations`}
                  className={cn(buttonVariants(), "w-full")}
                >
                  Reservation Lists
                </Link>
              )}
            </div>
          </div>

          {/* Merchant Information */}
          <div className="flex flex-col gap-4 rounded bg-gray-50 px-3 py-4">
            {merchant.phone && (
              <div className="space-y-2">
                <h3 className="font-semibold">Phone Number</h3>
                <div className="text-sm">
                  <Link to={`tel:${merchant.phone}`} target="_blank">
                    {merchant.phone}
                  </Link>
                </div>
              </div>
            )}

            {merchant.address && (
              <div className="space-y-2">
                <h3 className="font-semibold">Address</h3>
                <div className="text-sm">
                  <Link
                    to={`https://www.google.com/maps?q=${encodeURIComponent(
                      [
                        merchant.address.address,
                        merchant.address.subDistrict,
                        merchant.address.district,
                        merchant.address.province,
                        merchant.address.zipCode,
                      ]
                        .filter(Boolean)
                        .join(", "),
                    )}`}
                    target="_blank"
                  >
                    {merchant.address.address}, {merchant.address.subDistrict},{" "}
                    {merchant.address.district}, {merchant.address.province}{" "}
                    {merchant.address.zipCode}
                  </Link>
                </div>
              </div>
            )}

            {merchant.openHours && (
              <div className="space-y-2">
                <h3 className="font-semibold">Open Hours</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {merchant.openHours.map((day, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:justify-between"
                    >
                      <span className="font-medium">{day.day}</span>
                      <span>
                        {day.open} - {day.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zones and Seats */}
            {merchant.zones && merchant.zones.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Seating</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {merchant.zones.map((zone, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{zone.name}</span>
                      <Badge variant="outline">
                        {zone.availableSeats}/{zone.totalSeats} seats
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-9/12 flex-col gap-8 py-4">
          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p>{merchant.description || "No description available."}</p>
          </div>

          {/* Promotional Images */}
          {merchant.images && merchant.images.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {merchant.images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-md">
                  <img
                    src={constructAPIUrl(image.url)}
                    alt={`${merchant.name} photo ${index + 1}`}
                    className="aspect-video w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Skeleton className="aspect-video flex-1" />
              <Skeleton className="aspect-video flex-1" />
              <Skeleton className="aspect-video flex-1" />
              <Skeleton className="aspect-video flex-1" />
            </div>
          )}

          {/* Reviews Section */}
          <MerchantReviewSection
            merchant={merchant}
            merchantId={merchant?.id}
          />
        </div>
      </section>
    </div>
  );
}

export default Page;
