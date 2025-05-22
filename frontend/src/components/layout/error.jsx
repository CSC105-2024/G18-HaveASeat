import React from "react";
import { IconPicnicTable } from "@tabler/icons-react";
import { Button } from "@/components/ui/button.jsx";

function ErrorFallback() {
  return <div>Error has occurred</div>;
}

function ErrorLayout({ error, resetErrorBoundary }) {
  if (!import.meta.env.DEV) {
    return (
      <div className="animate-in flex min-h-svh flex-col items-center justify-center text-center">
        <IconPicnicTable
          className="size-32 animate-pulse text-red-500"
          aria-label="Loading..."
        />
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">Have A Seat</h1>
          <span className="font-noto-sans-thai">Book It. Sip It. Love It</span>
          <div className="my-8 space-y-4">
            <h2 className="font-semibold">Something went wrong!</h2>
            <p>Please try again later or contact administrator.</p>
            <Button className="w-full" onClick={resetErrorBoundary}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in flex min-h-svh flex-col items-center justify-center text-center">
      <IconPicnicTable
        className="size-32 animate-pulse text-red-500"
        aria-label="Loading..."
      />
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Have A Seat</h1>
        <span className="font-noto-sans-thai">Book It. Sip It. Love It</span>
        <div className="my-8 space-y-4">
          <div className="space-y-4">
            <span className="font-semibold">
              The following error has occurred:
            </span>{" "}
            <pre className="word-break mt-2 p-4 text-wrap text-red-500">
              {error.message}
            </pre>
          </div>
          <pre className="max-w-screen overflow-x-auto rounded bg-gray-50 p-4 text-start">
            {error.stack}
          </pre>
          <Button className="w-full" onClick={resetErrorBoundary}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ErrorLayout, ErrorFallback };
