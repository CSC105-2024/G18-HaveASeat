import React from "react";
import { Link, useParams } from "react-router";
import { cn } from "@/lib/utils.js";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import { IconHeart } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useUserFavouriteOverlay } from "@/overlay/user/favourite.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MerchantBanner } from "@/components/merchant/banner.jsx";
import { MerchantReviewSection } from "@/components/merchant/review.jsx";
import { useReservationAddOverlay } from "@/overlay/reservation/add.jsx";

export const merchantData = {
  name: "Summy Bar",
  telephone: "+66123456789",
  address:
    "126 Pracha Uthit Rd., Bang Mot Subdistrict, Thung Khru District, Bangkok 10140",
  open_hours: {
    Sunday: "10:00 - 00:00",
    Monday: "10:00 - 00:00",
    Tuesday: "10:00 - 00:00",
    Wednesday: "10:00 - 00:00",
    Thursday: "10:00 - 00:00",
    Friday: "10:00 - 00:00",
    Saturday: "10:00 - 00:00",
  },
  created_at: new Date(),
  favourite: 10000,
  rating: 4,
};

function Page() {
  const { id } = useParams();

  const { open: openUserFavouriteOverlay } = useUserFavouriteOverlay();
  const { open: openReservationAddOverlay } = useReservationAddOverlay();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <MerchantBanner merchant={merchantData} merchantId={id} />
      <section className="flex flex-col gap-8 lg:flex-row">
        <aside className="flex-3/12 space-y-4 py-4">
          <div className="">
            <div className="space-y-2">
              <div className="flex flex-row flex-wrap gap-4">
                {/*TODO: Check user role*/}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => openUserFavouriteOverlay({})}
                      className="max-sm:w-full lg:size-9"
                    >
                      <IconHeart />
                      <span className="lg:hidden">Favourite</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Favourite</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  className="w-full flex-1"
                  onClick={() => openReservationAddOverlay({})}
                >
                  Make A Reservation
                </Button>
              </div>
              {/*TODO: Check user role*/}
              <Link
                to={`/merchant/${id}/reservations`}
                className={cn(buttonVariants(), "w-full")}
              >
                Reservation Lists
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded bg-gray-50 px-3 py-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Phone Number</h3>
              <div className="text-sm">
                <Link to={`tel:${merchantData.telephone}`} target="_blank">
                  {merchantData.telephone}
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Address</h3>
              <div className="text-sm">
                <Link
                  to={`https://www.google.com/maps?q=${encodeURIComponent(merchantData.address)}`}
                  target="_blank"
                >
                  {merchantData.address}
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Open Hours</h3>
              <div className="flex flex-col gap-2 text-sm">
                {Object.entries(merchantData.open_hours).map((day) => (
                  <div key={day[0]} className="flex flex-col md:flex-row md:justify-between">
                    <span className="font-medium">{day[0]}</span>
                    <span>{day[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <div className="flex flex-9/12 flex-col gap-8 py-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa
              delectus eveniet, excepturi, ipsam iusto, laboriosam magni nihil
              pariatur perspiciatis porro quaerat quas qui quidem quod repellat
              rerum similique. Architecto, qui.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
          </div>
          <MerchantReviewSection />
        </div>
      </section>
    </div>
  );
}

export default Page;
