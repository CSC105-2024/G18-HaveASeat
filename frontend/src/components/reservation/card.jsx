import React from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { cn } from "@/lib/utils.js";
import { constructAPIUrl } from "@/lib/url.ts";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  IconCalendar,
  IconCalendarEvent,
  IconClipboardCheck,
  IconClock,
  IconMapPin,
  IconSofa,
  IconUsers
} from "@tabler/icons-react";

/**
 * Reservation card component
 *
 * @param {Object} props
 * @param {Object} props.reservation - The reservation data
 * @param {Function} props.onCancelReservation - Callback for canceling a reservation
 * @param {string} props.className - Additional class names
 */
function ReservationCard({ reservation, onCancelReservation, className }) {
  const startDate = new Date(reservation.startTime);
  const endDate = new Date(reservation.endTime);

  const getStatusDetails = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Completed",
          variant: "success",
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: IconClipboardCheck,
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          variant: "destructive",
          color: "text-red-600",
          bgColor: "bg-red-50",
          icon: IconCalendarEvent,
        };
      case "NO_SHOW":
        return {
          label: "No Show",
          variant: "warning",
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          icon: IconCalendarEvent,
        };
      case "CHECKED_IN":
        return {
          label: "Checked In",
          variant: "info",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          icon: IconCalendarEvent,
        };
      default:
        return {
          label: "Pending",
          variant: "outline",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          icon: IconCalendarEvent,
        };
    }
  };

  const statusDetails = getStatusDetails(reservation.status);
  const StatusIcon = statusDetails.icon;

  const isPastReservation =
    reservation.status === "COMPLETED" ||
    reservation.status === "CANCELLED" ||
    reservation.status === "NO_SHOW";

  const isUpcoming = !isPastReservation;

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border transition-all",
        statusDetails.bgColor,
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Merchant Image */}
        <div className="relative h-32 w-full overflow-hidden bg-gray-100 sm:h-auto sm:w-32">
          {reservation.merchantImage ? (
            <img
              src={constructAPIUrl(reservation.merchantImage)}
              alt={reservation.merchantName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <IconCalendar className="h-12 w-12 text-gray-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium">
              <Link
                to={`/merchant/${reservation.merchantId}`}
                className="hover:underline"
              >
                {reservation.merchantName}
              </Link>
            </h3>
            <Badge variant={statusDetails.variant}>{statusDetails.label}</Badge>
          </div>

          {/* Reservation Details */}
          <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="flex items-center text-sm">
              <IconCalendar className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
              <span>{format(startDate, "EEEE, MMM d, yyyy")}</span>
            </div>

            <div className="flex items-center text-sm">
              <IconClock className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
              <span>
                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <IconUsers className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
              <span>
                {reservation.numberOfGuests} guest
                {reservation.numberOfGuests > 1 ? "s" : ""},{" "}
                {reservation.numberOfTables} table
                {reservation.numberOfTables > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <IconSofa className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
              <span>
                Seat #{reservation.seatNumber} ({reservation.seatLocation})
              </span>
            </div>
          </div>

          {reservation.location && (
            <div className="text-muted-foreground flex items-center text-xs">
              <IconMapPin className="mr-1 h-3 w-3" />
              {reservation.location}
            </div>
          )}

          {/* Actions */}
          {isUpcoming && (
            <div className="mt-3 flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancelReservation(reservation)}
                className="text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                Cancel Reservation
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Note section (if any) */}
      {reservation.note && (
        <div className="border-t px-4 py-2">
          <p className="text-muted-foreground text-xs">
            <span className="font-medium">Note:</span> {reservation.note}
          </p>
        </div>
      )}
    </div>
  );
}

export default ReservationCard;
