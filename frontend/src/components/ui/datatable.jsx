"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  IconAdjustmentsHorizontal,
  IconArrowDown,
  IconArrowsSort,
  IconArrowUp,
  IconCalendarDown,
  IconCalendarUp,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEyeOff,
  IconFilter,
  IconSortAscendingLetters,
  IconSortAscendingNumbers,
  IconSortDescendingLetters,
  IconSortDescendingNumbers,
  IconX
} from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";

/**
 * @template TData
 * @template TValue
 * @typedef {Object} DataTableFacetedFilterProps
 * @property {import("@tanstack/react-table").Column<TData, TValue>} [column]
 * @property {string} [title]
 * @property {FilterOption[]} options
 */

/**
 * @param {("ascending"|"descending")} order
 * @param {("string"|"date"|"numeric")} type
 * @returns {string}
 */
function getSortingPhrase(order, type) {
  switch (type) {
    case "string":
      return order === "ascending" ? "Sort from A-Z" : "Sort from Z-A";
    case "date":
      return order === "ascending" ? "Oldest to Newest" : "Newest to Oldest";
    case "numeric":
      return order === "ascending" ? "Lowest to Highest" : "Highest to Lowest";
  }
}

/**
 * @param {Object} props
 * @param {("ascending"|"descending")} props.order
 * @param {("string"|"date"|"numeric")} props.type
 * @returns {JSX.Element}
 */
function SortingIcon({ order, type }) {
  let Icon = null;

  if (type === "string") {
    Icon =
      order === "ascending"
        ? IconSortAscendingLetters
        : IconSortDescendingLetters;
  } else if (type === "date") {
    Icon = order === "ascending" ? IconCalendarUp : IconCalendarDown;
  } else if (type === "numeric") {
    Icon =
      order === "ascending"
        ? IconSortAscendingNumbers
        : IconSortDescendingNumbers;
  }

  return <Icon className="text-muted-foreground/70 size-3.5" />;
}

/**
 * @template TData
 * @template TValue
 * @param {Object} props
 * @param {import("@tanstack/react-table").Column<TData, TValue>} props.column
 * @param {string} props.title
 * @param {string} [props.className]
 * @param {("string"|"date"|"numeric")} [props.type='numeric']
 * @returns {JSX.Element}
 */
export function DataTableColumnHeader({
  column,
  title,
  className,
  type = "numeric",
}) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <IconArrowDown className="size-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconArrowUp className="size-4" />
            ) : (
              <IconArrowsSort className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <SortingIcon order="ascending" type={type} />
            {getSortingPhrase("ascending", type)}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <SortingIcon order="descending" type={type} />
            {getSortingPhrase("descending", type)}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <IconEyeOff className="text-muted-foreground/70 size-3.5" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * @template TData
 * @param {Object} props
 * @param {import("@tanstack/react-table").Table<TData>} props.table
 * @returns {JSX.Element}
 */
export function DataTablePagination({ table }) {
  return (
    <div className="flex flex-col flex-wrap items-start justify-between gap-4 px-2 md:flex-row md:items-center">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(1, table.getPageCount())}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * @template TData
 * @param {Object} props
 * @param {import("@tanstack/react-table").Table<TData>} props.table
 * @returns {JSX.Element|undefined}
 */
export function DataTableViewOptions({ table }) {
  const visibleColumn = useMemo(() => {
    return table
      .getAllColumns()
      .filter(
        (column) =>
          typeof column.accessorFn !== "undefined" && column.getCanHide(),
      );
  }, [table]);

  if (visibleColumn.length === 0) {
    return;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <IconAdjustmentsHorizontal className="mr-2 size-4" stroke={1.5} />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleColumn.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * @typedef {Object} FilterOption
 * @property {string} label
 * @property {string} value
 * @property {React.ComponentType<{className?: string}>} [icon]
 */

/**
 * @template TData
 * @template TValue
 * @param {Object} props
 * @param {import("@tanstack/react-table").Column<TData, TValue>} [props.column]
 * @param {string} [props.title]
 * @param {FilterOption[]} props.options
 * @returns {JSX.Element}
 */
export function DataTableFacetedFilter({ column, title, options }) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() || []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <IconFilter className="mr-0.5 size-4" strokeWidth={1} />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex size-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <IconCheck className={cn("size-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 size-4" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
 * @template TData
 * @template TValue
 * @param {Object} props
 * @param {import("@tanstack/react-table").Table<TData>} props.table
 * @param {string} [props.filterColumn]
 * @param {Array<import("./datatable").DataTableFacetedFilterProps<TData, TValue>>} [props.facetedFilters]
 * @param {string} [props.placeholder]
 * @returns {JSX.Element}
 */
export function DataTableToolbar({
  table,
  filterColumn,
  facetedFilters,
  placeholder,
}) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2 space-x-2">
        {filterColumn && (
          <Input
            placeholder={placeholder}
            value={table.getColumn(filterColumn)?.getFilterValue() || ""}
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="w-[150px] max-md:flex-1 lg:w-[250px]"
          />
        )}
        {facetedFilters?.map((filter) => (
          <DataTableFacetedFilter
            key={filter.title}
            column={filter.column}
            title={filter.title}
            options={filter.options}
          />
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <IconX className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
