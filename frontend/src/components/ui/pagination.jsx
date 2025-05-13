import * as React from "react";
import { IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

/**
 * @param {React.ComponentProps<"nav">} props
 * @returns {JSX.Element}
 */
function Pagination({ className, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

/**
 * @param {React.ComponentProps<"ul">} props
 * @returns {JSX.Element}
 */
function PaginationContent({ className, ...props }) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

/**
 * @param {React.ComponentProps<"li">} props
 * @returns {JSX.Element}
 */
function PaginationItem({ ...props }) {
  return <li data-slot="pagination-item" {...props} />;
}

/**
 * @typedef PaginationLinkProps
 * @property {boolean | undefined} [isActive]
 * @property {React.ComponentProps<typeof Button>["size"]} [size]
 * @extends {React.ComponentProps<"a">}
 */

/**
 * @param {PaginationLinkProps} props
 * @returns {JSX.Element}
 */
function PaginationLink({ className, isActive, size = "icon", ...props }) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

/**
 * @param {React.ComponentProps<typeof PaginationLink>} props
 * @returns {JSX.Element}
 */
function PaginationPrevious({ className, ...props }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <IconChevronLeft />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

/**
 * @param {React.ComponentProps<typeof PaginationLink>} props
 * @returns {JSX.Element}
 */
function PaginationNext({ className, ...props }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <IconChevronRight />
    </PaginationLink>
  );
}

/**
 * @param {React.ComponentProps<"span">} props
 * @returns {JSX.Element}
 */
function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <IconDots className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
