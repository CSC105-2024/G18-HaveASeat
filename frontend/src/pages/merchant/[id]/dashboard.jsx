import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import MerchantLayout from "@/components/layout/merchant.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { IconCalendarEvent, IconStar, IconUsers } from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import MerchantSetupGuard from "@/components/merchant/setup-guard.jsx";
import { Button } from "@/components/ui/button.jsx";

const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "NO_SHOW":
      return "bg-yellow-100 text-yellow-800";
    case "PENDING":
    default:
      return "bg-blue-100 text-blue-800";
  }
};

function MerchantDashboard() {
  const { id } = useParams();
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/merchant/${id}/settings`);
        setMerchant(response.data);
      } catch (error) {
        console.error("Error fetching merchant data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMerchantData();
    }
  }, [id]);

  if (loading) {
    return (
      <MerchantLayout>
        <MerchantSetupGuard>
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        </MerchantSetupGuard>
      </MerchantLayout>
    );
  }

  if (!merchant) {
    return (
      <MerchantLayout>
        <MerchantSetupGuard>
          <div className="py-8 text-center">
            <h2 className="text-2xl font-bold">Merchant not found</h2>
          </div>
        </MerchantSetupGuard>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <MerchantSetupGuard>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">{merchant.name}</h1>
            <p className="text-gray-500">Welcome to your merchant dashboard</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Seats
                </CardTitle>
                <IconUsers className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {merchant.statistics.totalSeats ?? 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  {merchant.statistics.availableSeats} available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <IconStar className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {merchant.statistics.averageRating ?? 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  From {merchant.statistics.totalReviews} reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Reservations
                </CardTitle>
                <IconCalendarEvent className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {merchant.statistics.upcomingReservations ?? 0}
                </div>
                <p className="text-muted-foreground text-xs">Scheduled</p>
              </CardContent>
            </Card>
          </div>

          {/* Zone Information */}
          <Card>
            <CardHeader>
              <CardTitle>Zone Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(merchant.zones)?.map(([zoneName, zoneData]) => (
                  <div key={zoneName} className="rounded-lg border p-4">
                    <h3 className="mb-2 font-semibold">{zoneName}</h3>
                    <div className="space-y-1 text-sm">
                      <p>Total Seats: {zoneData.totalSeats}</p>
                      <p>Available: {zoneData.availableSeats}</p>
                      <p>Currently Occupied: {zoneData.occupiedSeats}</p>
                      <p>
                        Upcoming Reservations: {zoneData.currentReservations}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Reservations */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              {merchant.upcomingReservations?.length > 0 ? (
                <div className="space-y-4">
                  {merchant.upcomingReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {reservation.customerName}
                          </span>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(reservation.startTime).toLocaleDateString()}{" "}
                          {new Date(reservation.startTime).toLocaleTimeString()}{" "}
                          - {new Date(reservation.endTime).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Zone: {reservation.seatLocation} •
                          {reservation.numberOfGuests} g uests •
                          {reservation.numberOfTables} tables
                        </p>
                        {reservation.userName && (
                          <p className="text-sm text-gray-500">
                            Booked by: {reservation.userName}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            /* Add reservation management logic */
                          }}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming reservations.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </MerchantSetupGuard>
    </MerchantLayout>
  );
}

export default MerchantDashboard;
