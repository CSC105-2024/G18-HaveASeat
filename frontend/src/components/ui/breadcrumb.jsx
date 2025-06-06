import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { IconChevronRight, IconDots } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/**
 * @param {React.ComponentProps<"nav">} props
 * @returns {JSX.Element}
 */
function Breadcrumb({ ...props }) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

/**
 * @param {React.ComponentProps<"ol">} props
 * @returns {JSX.Element}
 */
function BreadcrumbList({ className, ...props }) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

/**
 * @param {React.ComponentProps<"li">} props
 * @returns {JSX.Element}
 */
function BreadcrumbItem({ className, ...props }) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

/**
 * @param {React.ComponentProps<"a"> & { asChild?: boolean }} props
 * @returns {JSX.Element}
 */
function BreadcrumbLink({ asChild, className, ...props }) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
}

/**
 * @param {React.ComponentProps<"span">} props
 * @returns {JSX.Element}
 */
function BreadcrumbPage({ className, ...props }) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  );
}

/**
 * @param {React.ComponentProps<"li">} props
 * @returns {JSX.Element}
 */
function BreadcrumbSeparator({ children, className, ...props }) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <IconChevronRight />}
    </li>
  );
}

/**
 * @param {React.ComponentProps<"span">} props
 * @returns {JSX.Element}
 */
function BreadcrumbEllipsis({ className, ...props }) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <IconDots className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
