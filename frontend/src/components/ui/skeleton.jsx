import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * @param {React.ComponentProps<"div">} props
 * @returns {JSX.Element}
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
