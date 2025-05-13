/* eslint-disable react-hooks/rules-of-hooks */

import { DataTableColumnHeader } from "@/components/ui/datatable";
import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import { Button } from "@/components/ui/button.jsx";
import { IconCloudNetwork, IconDots, IconWalk } from "@tabler/icons-react";
import { useReservationMarkAsCompleteOverlay } from "@/overlay/reservation/mark-complete.jsx";
import { useReservationCancelOverlay } from "@/overlay/reservation/cancel.jsx";
import { format } from "date-fns";
import { useReservationNoShowOverlay } from "@/overlay/reservation/mark-no-show.jsx";
import { useReservationCheckInOverlay } from "@/overlay/reservation/mark-checkin.jsx";

/**
 * @typedef {Object} Seat
 * @property {string} id
 * @property {number} number
 * @property {string} location
 */

/**
 * @typedef {Object} Reservation
 * @property {string} id
 * @property {string} [userId]
 * @property {string} customerName
 * @property {"WALK_IN"|"ONLINE"} reservationType
 * @property {string} seatId
 * @property {Seat} seat
 * @property {Date} startTime
 * @property {Date} endTime
 * @property {number} numberOfGuests
 * @property {number} numberOfTables
 * @property {string} [note]
 * @property {"COMPLETED"|"CANCELLED"|"NO_SHOW"|"PENDING"} status
 * @property {Date} createdAt
 */

const TypeFacetedFilterOptions = [
  {
    label: "Online",
    value: "ONLINE",
    icon: IconCloudNetwork,
  },
  {
    label: "Walk-in",
    value: "WALK_IN",
    icon: IconWalk,
  },
];

const StatusFacetedFilterOptions = [
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
  {
    label: "No Show",
    value: "NO_SHOW",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
];

/**
 * Get faceted filters for the table
 *
 * @template {Reservation} TData
 * @param {import("@tanstack/react-table").Table<TData>} table
 * @returns {Array<import("@/components/ui/datatable").DataTableFacetedFilterProps<TData, any>>}
 */
export const getFacetedFilters = (table) => {
  /** @type {import("@/components/ui/datatable").DataTableFacetedFilterProps<TData, any>[]} */
  const filters = [
    {
      column: table.getColumn("reservationType"),
      title: "Type",
      options: TypeFacetedFilterOptions,
    },
    {
      column: table.getColumn("status"),
      title: "Status",
      options: StatusFacetedFilterOptions,
    },
  ];

  return filters;
};

/**
 * @return {import("@tanstack/react-table").ColumnDef<Reservation>[]}
 */
export const getColumns = (onRefresh) => {
  return [
    {
      id: "customer",
      header: "Customer",
      enableHiding: false,
      enableSorting: true,
      accessorKey: "customerName",
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            <span className="font-medium">{row.original.customerName}</span>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  row.original.reservationType === "ONLINE"
                    ? "default"
                    : "secondary"
                }
              >
                {row.original.reservationType === "ONLINE"
                  ? "Online"
                  : "Walk-in"}
              </Badge>
              {row.original.status && (
                <Badge
                  variant={
                    row.original.status === "COMPLETED"
                      ? "success"
                      : row.original.status === "CANCELLED"
                        ? "destructive"
                        : row.original.status === "NO_SHOW"
                          ? "warning"
                          : row.original.status === "CHECKED_IN"
                            ? "info"
                            : "outline"
                  }
                >
                  {row.original.status}
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "details",
      header: "Reservation Details",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            <div className="text-sm">
              <span className="font-medium">Guests:</span>{" "}
              {row.original.numberOfGuests}
            </div>
            <div className="text-sm">
              <span className="font-medium">Tables:</span>{" "}
              {row.original.numberOfTables}
            </div>
            <div className="text-sm">
              <span className="font-medium">Seat:</span>{" "}
              {row.original.seat?.number} ({row.original.seat?.location})
            </div>
            {row.original.note && (
              <div className="text-sm">
                <span className="font-medium">Note:</span> {row.original.note}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "startTime",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Time" type="date" />
        );
      },
      accessorKey: "startTime",
      enableSorting: true,
      cell: ({ row }) => {
        const startTime = new Date(row.original.startTime);
        const endTime = new Date(row.original.endTime);

        return (
          <div className="space-y-1">
            <div className="text-sm">
              <span className="font-medium">Date:</span>{" "}
              {format(startTime, "MMM dd, yyyy")}
            </div>
            <div className="text-sm">
              <span className="font-medium">Time:</span>{" "}
              {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
            </div>
            <div className="text-muted-foreground text-xs">
              Reserved on{" "}
              {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
            </div>
          </div>
        );
      },
    },
    {
      id: "reservationType",
      accessorKey: "reservationType",
      header: "Type",
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      enableHiding: true,
      cell: ({ row }) => {
        return row.original.status || "PENDING";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        const isPending = data.status === "PENDING";
        const isCheckIn = data.status === "CHECKED_IN";

        const { open: openReservationMarkAsCompleteOverlay } =
          useReservationMarkAsCompleteOverlay();
        const { open: openReservationCancelOverlay } =
          useReservationCancelOverlay();
        const { open: openReservationNoShowOverlay } =
          useReservationNoShowOverlay();
        const { open: openReservationCheckInOverlay } =
          useReservationCheckInOverlay();

        function onReservationMarkAsComplete() {
          openReservationMarkAsCompleteOverlay({
            reservationId: data.id,
            customerName: data.customerName,
            onSuccess: () => {
              if (onRefresh) onRefresh();
            },
          });
        }

        function onReservationCancel() {
          openReservationCancelOverlay({
            reservation: data,
            customerName: data.customerName,
            onSuccess: () => {
              if (onRefresh) onRefresh();
            },
          });
        }

        function onReservationMarkAsNoShow() {
          openReservationNoShowOverlay({
            reservationId: data.id,
            customerName: data.customerName,
            onSuccess: () => {
              if (onRefresh) onRefresh();
            },
          });
        }

        function onReservationMarkAsCheckedIn() {
          openReservationCheckInOverlay({
            reservationId: data.id,
            customerName: data.customerName,
            onSuccess: () => {
              if (onRefresh) onRefresh();
            },
          });
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <IconDots className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Manage</DropdownMenuLabel>
              {isPending && (
                <>
                  <DropdownMenuItem
                    onClick={onReservationMarkAsCheckedIn}
                    disabled={!isPending}
                  >
                    Mark As Checked in
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onReservationMarkAsNoShow}
                    disabled={!isPending}
                  >
                    Mark As No Show
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onReservationCancel}
                    className="text-red-500"
                    disabled={!isPending}
                  >
                    Cancel
                  </DropdownMenuItem>
                </>
              )}
              {isCheckIn && (
                <DropdownMenuItem
                  onClick={onReservationMarkAsComplete}
                  disabled={!isPending}
                >
                  Mark As Complete
                </DropdownMenuItem>
              )}
              {!isPending && (
                <DropdownMenuItem disabled>
                  Already {data.status.toLowerCase()}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
