import React, { useCallback } from "react";
import { Badge } from "@/components/ui/badge.jsx";
import { IconHeartFilled, IconSettings, IconSparkles, IconStarFilled } from "@tabler/icons-react";
import { formatNumberCompact, formatNumberDecimalPoint } from "@/lib/formatter.js";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils.js";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectGroup, SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.jsx";
import { ReviewCard } from "@/components/reservation/review.jsx";
import {
  Pagination,
  PaginationContent, PaginationEllipsis,
  PaginationItem,
  PaginationLink, PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination.jsx";
import { merchantData } from "@/pages/merchant/[id]/index.jsx";
import { useReviewAddOverlay } from "@/overlay/review/add.jsx";

/**
 * @typedef {Object} SortEntry
 * @property {string} label
 * @property {string} value
 */

/**
 * @type {SortEntry[]}
 */
const sortType = [
  {
    label: "Recent",
    value: "recent",
  },
  {
    label: "Rating",
    value: "rating",
  },
];

/**
 * @type {SortEntry[]}
 */
const sortOrder = [
  {
    label: "Descending",
    value: "desc",
  },
  {
    label: "Ascending",
    value: "asc",
  },
];

function MerchantReviewSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { open: openReviewAddOverlay } = useReviewAddOverlay();

  const onSortTypeChange = useCallback(
    (value) => {
      const lowerValue = value.toLowerCase();

      if (!sortType.find((item) => item.value === lowerValue)) return;

      const newParams = new URLSearchParams(searchParams);
      newParams.set("sort", lowerValue);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const onSortOrderChange = useCallback(
    (value) => {
      const lowerValue = value.toLowerCase();

      if (!sortOrder.find((item) => item.value === lowerValue)) return;

      const newParams = new URLSearchParams(searchParams);
      newParams.set("order", lowerValue);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <span className="flex flex-row items-center gap-2 text-sm">
                    <IconStarFilled className="size-4 text-yellow-300" />
              {formatNumberDecimalPoint(merchantData.rating)} ({formatNumberCompact(2902)} Reviews)
                  </span>
          </div>
          <div className="space-x-2">
            <span className="font-medium">Sort by:</span>
            <Select
              defaultValue={sortType[0].value}
              onValueChange={onSortTypeChange}
            >
              <SelectTrigger className="inline-flex" size="sm">
                <SelectValue placeholder="Sort reviews by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  {sortType.map((item) => (
                    <SelectItem value={item.value} key={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              defaultValue={sortOrder[0].value}
              onValueChange={onSortOrderChange}
            >
              <SelectTrigger className="inline-flex" size="sm">
                <SelectValue placeholder="Order reviews by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Order</SelectLabel>
                  {sortOrder.map((item) => (
                    <SelectItem value={item.value} key={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="text-xs"
          onClick={() =>
            openReviewAddOverlay({
              isReply: false,
            })
          }
        >
          <IconSparkles />
          Review
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <ReviewCard/>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export { MerchantReviewSection };