import React from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { randomSplashText } from "@/lib/splash.js";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils.js";
import { buttonVariants } from "@/components/ui/button.jsx";

function Page() {
  return (
    <div
      data-status="404"
      className="fade-in fade-out flex flex-1 flex-col items-center justify-center gap-8 text-center"
    >
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Page Not Found</h1>
        <span>{randomSplashText()}</span>
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-48 w-72 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <NavLink
        to="/"
        className={cn("font-mono text-xl", buttonVariants({ size: "lg" }))}
      >
        Go Back to Home Page
      </NavLink>
    </div>
  );
}

export default Page;
