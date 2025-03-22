import React from "react";
import { randomSplashText } from "@/lib/splash.js";
import {IconPicnicTable} from "@tabler/icons-react";

function Loading() {
  return (
    <div className="animate-in flex min-h-svh flex-col items-center justify-center text-center">
      <IconPicnicTable className="animate-bounce size-32" aria-label="Loading..." />
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Have A Seat</h1>
        <span className="font-noto-sans-thai">Book It. Sip It. Love It.</span>
      </div>
    </div>
  );
}

export default Loading;
