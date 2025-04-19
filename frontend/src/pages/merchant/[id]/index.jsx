import React, { useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { Badge } from "@/components/ui/badge.jsx";
import { cn } from "@/lib/utils.js";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import {
  IconArrowBack,
  IconFlag,
  IconSettings,
  IconSparkles,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useReviewAddOverlay } from "@/overlay/review/add.jsx";
import { useReviewReportOverlay } from "@/overlay/review/report.jsx";
import { useReviewDeleteOverlay } from "@/overlay/review/delete.jsx";

const store = {
  name: "Summy Bar",
  telephone: "+66123456789",
  address:
    "126 Pracha Uthit Rd., Bang Mot Subdistrict, Thung Khru District, Bangkok 10140",
  open_hours: {
    Sunday: "10:00 - 00:00",
    Monday: "10:00 - 00:00",
    Tuesday: "10:00 - 00:00",
    Wednesday: "10:00 - 00:00",
    Thursday: "10:00 - 00:00",
    Friday: "10:00 - 00:00",
    Saturday: "10:00 - 00:00",
  },
  created_at: new Date(),
};

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

function Page() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { open: openReviewAddOverlay } = useReviewAddOverlay();
  const { open: openReviewReportOverlay } = useReviewReportOverlay();
  const { open: openReviewDeleteOverlay } = useReviewDeleteOverlay();

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
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative flex flex-row items-center gap-4 rounded-lg bg-gray-50 px-8 py-16">
        <div className="space-y-2">
          <h1 className="ml-1 text-xl font-semibold">{store.name}</h1>
          <div className="flex flex-row flex-wrap gap-2 text-sm">
            <Badge variant="secondary">
              <span className="font-medium">Since</span>{" "}
              {store.created_at.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </Badge>
            {import.meta.env.DEV && (
              <Badge variant="secondary">
                <span className="font-medium">ID</span> {id}
              </Badge>
            )}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Link
            to={`/merchant/${id}/settings`}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "flex w-full items-center justify-center",
            )}
          >
            <IconSettings />
            Settings
          </Link>
        </div>
      </section>
      <section className="flex flex-col gap-8 md:flex-row">
        <aside className="flex-3/12 space-y-4 py-4">
          <div className="">
            <div className="space-y-2">
              {/*TODO: Check user role*/}
              <Link
                to={`/merchant/${id}/reservation`}
                className={cn(buttonVariants(), "w-full")}
              >
                Make A Reservation
              </Link>
              {/*TODO: Check user role*/}
              <Link
                to={`/merchant/${id}/reservations`}
                className={cn(buttonVariants(), "w-full")}
              >
                Reservation Lists
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded bg-gray-50 px-3 py-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Phone Number</h3>
              <div className="text-sm">
                <Link to={`tel:${store.telephone}`} target="_blank">
                  {store.telephone}
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Address</h3>
              <div className="text-sm">
                <Link
                  to={`https://www.google.com/maps?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                >
                  {store.address}
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Open Hours</h3>
              <div className="flex flex-col gap-2 text-sm">
                {Object.entries(store.open_hours).map((day) => (
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="font-medium">{day[0]}</span>
                    <span>{day[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <div className="flex flex-9/12 flex-col gap-8 py-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa
              delectus eveniet, excepturi, ipsam iusto, laboriosam magni nihil
              pariatur perspiciatis porro quaerat quas qui quidem quod repellat
              rerum similique. Architecto, qui.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
            <Skeleton className="aspect-video flex-1" />
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-row items-center gap-2">
                  <h2 className="text-xl font-semibold">Reviews</h2>
                  <span className="flex flex-row items-center gap-2 text-sm">
                    <IconStarFilled className="size-4 text-yellow-300" />
                    4.3 (2902 Reviews)
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
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex-grow space-y-2">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold">
                        Nicole Bars
                      </span>
                      <div className="flex items-center">
                        <IconStarFilled className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-xs text-yellow-400">4</span>
                      </div>
                    </div>

                    <div className="ml-2 flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs"
                        onClick={openReviewReportOverlay}
                      >
                        <IconFlag />
                        Report
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          openReviewAddOverlay({
                            isReply: true,
                          })
                        }
                      >
                        <IconArrowBack />
                        Reply
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={openReviewDeleteOverlay}
                      >
                        <IconTrash />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
