import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination, DataTableToolbar } from "@/components/ui/datatable";
import { getColumns, getFacetedFilters } from "./_data";

/**
 * Reservation data table component
 *
 * @param {Object} props
 * @param {Array} props.data - The reservation data
 * @param {Function} props.onRefresh - Callback to refresh data
 * @returns {JSX.Element}
 */
function ReservationDataTable({ data, onRefresh }) {
  const columns = getColumns(onRefresh);

  const [sorting, setSorting] = useState(
    /** @type {import("@tanstack/react-table").SortingState}  */ ([
      {
        id: "startTime",
        desc: true,
      },
    ]),
  );

  const [columnFilters, setColumnFilters] = useState(
    /** @type {import("@tanstack/react-table").ColumnFiltersState} */ ([]),
  );

  const [columnVisibility, setColumnVisibility] = useState(
    /** @type {import("@tanstack/react-table").VisibilityState} */ ({
      reservationType: false,
      status: false,
    }),
  );

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const facetedFilters = getFacetedFilters(table);

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} facetedFilters={facetedFilters} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.columnDef.meta?.className}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    row.original.status === "CANCELLED"
                      ? "bg-red-50/50"
                      : row.original.status === "COMPLETED"
                        ? "bg-green-50/50"
                        : row.original.status === "NO_SHOW"
                          ? "bg-yellow-50/50"
                          : row.original.status === "CHECKED_IN"
                            ? "bg-blue-50/50"
                            : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export { ReservationDataTable };
