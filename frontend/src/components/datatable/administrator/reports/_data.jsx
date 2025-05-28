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
 * @property {Object} author
 * @property {string} author.id
 * @property {string} author.name
 * @property {boolean} author.isAdmin
 * @property {Date|string} createdAt
 */

/**
 * @param {Object} props
 * @param {() => void} props.onRefre
 * @return {import("@tanstack/react-table").ColumnDef<Report>[]}
 */
export const getColumns = ({ onRefresh }) => {
  return [
    {
      id: "content",
      accessorKey: "content",
      header: "Report Details",
      enableHiding: false,
      cell: ({ row }) => {
        console.log(row.original);
        const review = row.original.review;
        const author = review.user;
        return (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <span className="max-w-[500px] truncate font-medium">
                {author.name}
              </span>
              {author.isAdmin && (
                <Badge variant="destructive">Administrator</Badge>
              )}
            </div>
            <p className="max-w-[600px] whitespace-break-spaces">
              {review.description}
            </p>
            <Badge variant="outline" className="md:hidden">
              {Intl.DateTimeFormat("en-US", {
                dateStyle: "long",
              }).format(new Date(row.original.createdAt))}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "Reported Date",
      accessorKey: "createdAt",
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
        const date = row.original.createdAt;
        return Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(new Date(date));
      },
      meta: {
        className: "max-md:hidden",
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        const { open: openReportIgnoreOverlay } = useReportIgnoreOverlay();
        const { open: openReportDeleteOverlay } = useReportDeleteOverlay();

        function onReportIgnore() {
          openReportIgnoreOverlay({
            reportId: data.id,
            onSuccess: () => {
              onRefresh();
            },
          });
        }

        function onReportDelete() {
          openReportDeleteOverlay({
            reportId: data.id,
            onSuccess: () => {
              onRefresh();
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
