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
import { useReservationMarkAsCompleteOverlay } from "@/overlay/reservation/mark-as-complete.jsx";
import { useReservationCancelOverlay } from "@/overlay/reservation/cancel.jsx";

/**
 * @typedef {Object} Zone
 * @property {string} id
 * @property {name} name
 */

/**
 * @typedef {Object} Reservation
 * @property {string} id
 * @property {number} guest
 * @property {number} table
 * @property {Zone[]} zone
 * @property {string} [note]
 * @property {"ONLINE"|"ONSITE"} type
 * @property {string} [reserved_for]
 * @property {UserModel} [reserved_by]
 * @property {Date} reserved_start
 * @property {Date} reserved_end
 * @property {Date} created_at
 */

const StatusFacetedFilterOptions = [
  {
    label: 'Online',
    value: 'ONLINE',
    icon: IconCloudNetwork,
  },
  {
    label: 'Walk-in',
    value: 'ONSITE',
    icon: IconWalk,
  },
];

/**
 * Get faceted filters for the table
 *
 * @template {Reservation} TData
 * @param {import('@tanstack/react-table').Table<TData>} table
 * @returns {Array<import('@/components/ui/datatable').DataTableFacetedFilterProps<TData, any>>}
 */
export const getFacetedFilters = (
  table
) => {
  /** @type {import('@/components/ui/datatable').DataTableFacetedFilterProps<TData, any>[]} */
  const status = [
    {
      column: table.getColumn('Type'),
      title: 'Type',
      options: StatusFacetedFilterOptions,
    },
  ];

  return [...status];
};

/**
 * @return {import("@tanstack/react-table").ColumnDef<Reservation>[]}
 */
export const getColumns = () => {
  return [
    {
      id: "detail",
      header: "Details",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <span className="max-w-[500px] truncate font-medium capitalize">
                {row.original.author.name}
              </span>
              {row.original.author.isAdmin && (
                <Badge variant="destructive">Administrator</Badge>
              )}
            </div>
            <p className="whitespace-break-spaces">{row.original.content}</p>
          </div>
        );
      },
    },
    {
      id: "Type",
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        switch (row.original.type) {
          case "ONLINE":
            return "Online";
          case "ONSITE":
            return "Walk-in";
          default:
            return "Unknown";
        }
      },
    },
    {
      id: "Reserved Date",
      accessorKey: "reserved_at",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Reserved Date"
            type="date"
          />
        );
      },
      cell: ({ row }) => {
        const startDate = Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(row.original.reserved_start);

        const endDate = Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(row.original.reserved_end);

        return `${startDate} - ${endDate}`;
      },
    },
    {
      id: "Reserved At",
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Reserved At"
            type="date"
          />
        );
      },
      cell: ({ row }) => {
        return Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(row.original.created_at);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        const { open: openReservationMarkAsCompleteOverlay } = useReservationMarkAsCompleteOverlay();
        const { open: openReservationCancelOverlay } = useReservationCancelOverlay();

        function onReservationMarkAsComplete() {
          openReservationMarkAsCompleteOverlay({});
        }

        function onReservationCancel() {
          openReservationCancelOverlay({});
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
              <DropdownMenuItem onClick={onReservationMarkAsComplete}>
                Mark As Complete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onReservationCancel}
                className="text-red-500"
              >
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
