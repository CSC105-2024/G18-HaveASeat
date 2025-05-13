import React, { useEffect, useState } from "react";
import AccountLayout from "@/components/layout/account.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Link } from "react-router";
import { IconCalendar, IconRefresh } from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import ReservationCard from "@/components/reservation/card.jsx";
import { useReservationCancelOverlay } from "@/overlay/reservation/cancel.jsx";
import { cn } from "@/lib/utils";

function Page() {
  const [loading, setLoading] = useState(true);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const { open: openReservationCancelOverlay } = useReservationCancelOverlay();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/user/reservations");
      setUpcomingReservations(response.data.upcoming || []);
      setPastReservations(response.data.past || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelReservation = (reservation) => {
    openReservationCancelOverlay({
      reservation,
      onSuccess: () => {
        fetchReservations();
      },
    });
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} className="h-40 w-full" />
      ))}
    </div>
  );

  const renderEmptyState = (type) => (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
      <IconCalendar className="text-muted-foreground mb-4 h-12 w-12" />
      <h3 className="text-lg font-medium">No {type} Reservations</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        {type === "Upcoming"
          ? "You don't have any upcoming reservations. Explore merchants and make a reservation!"
          : "You haven't completed any reservations yet."}
      </p>
      <Link to="/" className="mt-6">
        <Button>Browse Merchants</Button>
      </Link>
    </div>
  );

  return (
    <AccountLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Reservations</h2>
            <p className="text-muted-foreground text-sm">
              Book It. Sip It. Love It!
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchReservations}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <IconRefresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <Separator />

        <div className="flex flex-col gap-12">
          {/* Upcoming Reservations */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Upcoming Reservations</h2>
              <p className="text-muted-foreground text-sm">
                Just a little reminder for your upcoming reservation(s).
              </p>
            </div>

            {loading ? (
              renderSkeletons()
            ) : upcomingReservations.length === 0 ? (
              renderEmptyState("Upcoming")
            ) : (
              <div className="space-y-4">
                {upcomingReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onCancelReservation={handleCancelReservation}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Past Reservations */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Past Reservations</h2>
              <p className="text-muted-foreground text-sm">
                Looks like you have made{" "}
                {loading ? "..." : pastReservations.length} reservations with
                us.
              </p>
            </div>

            {loading ? (
              renderSkeletons()
            ) : pastReservations.length === 0 ? (
              renderEmptyState("Past")
            ) : (
              <div className="space-y-4">
                {pastReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    className={cn(
                      reservation.status === "CANCELLED" && "opacity-75",
                      reservation.status === "NO_SHOW" && "opacity-75",
                    )}
                  />
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
