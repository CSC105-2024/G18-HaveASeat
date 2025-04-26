import React from "react";
import { IconArrowBack, IconFlag, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { formatNumberDecimalPoint } from "@/lib/formatter.js";
import { Button } from "@/components/ui/button.jsx";
import { useReviewReportOverlay } from "@/overlay/review/report.jsx";
import { useReviewDeleteOverlay } from "@/overlay/review/delete.jsx";
import { useReviewAddOverlay } from "@/overlay/review/add.jsx";

function ReviewCard() {
  const { open: openReviewAddOverlay } = useReviewAddOverlay();
  const { open: openReviewReportOverlay } = useReviewReportOverlay();
  const { open: openReviewDeleteOverlay } = useReviewDeleteOverlay();

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="flex-grow space-y-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
                      <span className="text-base font-semibold">
                        Nicole Bars
                      </span>
            <div className="flex items-center">
              <IconStarFilled className="h-4 w-4 text-yellow-400" />
              <span className="ml-1 text-xs">{formatNumberDecimalPoint(4)}</span>
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
  );
}

export { ReviewCard };