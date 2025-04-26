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
import { IconDots } from "@tabler/icons-react";
import { useReportIgnoreOverlay } from "@/overlay/report/ignore.jsx";
import { useReportDeleteOverlay } from "@/overlay/report/delete.jsx";

/**
 * @typedef {Object} Report
 * @property {string} id
 * @property {string} content
 * @property {User} author
 * @property {Date} created_at
 */

/**
 * @return {import("@tanstack/react-table").ColumnDef<Report>[]}
 */
export const getColumns = () => {
  return [
    {
      id: "content",
      accessorKey: "content",
      header: "Content",
      enableHiding: false,
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
            <Badge variant="destructive" className="md:hidden">
              {
                Intl.DateTimeFormat("en-US", {
                  dateStyle: "long",
                }).format(row.original.created_at)
              }
            </Badge>
          </div>
        );
      },
    },
    {
      id: "Reported Date",
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Reported Date"
            type="date"
          />
        );
      },
      cell: ({ row }) => {
        return Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(row.original.created_at);
      },
      meta: {
        className: "max-md:hidden"
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        const { open: openReportIgnoreOverlay } = useReportIgnoreOverlay();
        const { open: openReportDeleteOverlay } = useReportDeleteOverlay();

        function onReportIgnore() {
          openReportIgnoreOverlay({});
        }

        function onReportDelete() {
          openReportDeleteOverlay({});
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
              <DropdownMenuItem onClick={onReportIgnore}>
                Ignore
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onReportDelete}
                className="text-red-500"
              >
                Delete
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
