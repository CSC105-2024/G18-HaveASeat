import React from "react";
import { randomSplashText } from "@/lib/splash.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";

function Loading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 text-center fade-in fade-out">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Have A Seat</h1>
        <span>Book It. Sip It. Love It.</span>
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-48 w-72 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <p className="text-xl font-mono">{randomSplashText()}</p>
    </div>
  );
}

export default Loading;