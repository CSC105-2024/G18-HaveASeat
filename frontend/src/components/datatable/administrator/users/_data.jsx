/* eslint-disable react-hooks/rules-of-hooks */

import { DataTableColumnHeader } from '@/components/ui/datatable';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import { Button } from "@/components/ui/button.jsx";
import { IconDots, IconDotsCircleHorizontal } from "@tabler/icons-react";
import { useUserEditOverlay } from "@/overlay/user/edit.jsx";
import { useUserDeleteOverlay } from "@/overlay/user/delete.jsx";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 * @property {Date} dob
 * @property {boolean} isAdmin
 * @property {Date} created_at
 */

/**
 * @return {import('@tanstack/react-table').ColumnDef<User>[]}
 */
export const getColumns = () => {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium capitalize">
              {row.original.name}
            </span>
            {row.original.isAdmin && (
              <Badge variant="destructive">
                Administrator
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: 'Member Since',
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Member Since"
            type="date"
          />
        );
      },
      cell: ({ row }) => {
        return Intl.DateTimeFormat('en-US', {
          dateStyle: 'long',
        }).format(row.original.created_at);
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const data = row.original;

        const { open: openUserEditOverlay } = useUserEditOverlay();
        const { open: openUserDeleteOverlay } = useUserDeleteOverlay();

        function onUserEdit() {
          openUserEditOverlay({ editMode: true });
        }

        function onUserDelete() {
          openUserDeleteOverlay({});
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
              <DropdownMenuItem onClick={onUserEdit}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onUserDelete} className="text-red-500">
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