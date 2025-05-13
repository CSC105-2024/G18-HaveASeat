import React from "react";
import {
  IconArrowBack,
  IconClock,
  IconFlag,
  IconShieldCheckFilled,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button.jsx";
import { useReviewReportOverlay } from "@/overlay/review/report.jsx";
import { useReviewDeleteOverlay } from "@/overlay/review/delete.jsx";
import { useReviewAddOverlay } from "@/overlay/review/add.jsx";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge.jsx";
import { cn } from "@/lib/utils.js";
import { useAuthStore } from "@/store/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";

function ReviewCard({ review, onUpdated, isOwner }) {
  const { open: openReviewAddOverlay } = useReviewAddOverlay();
  const { open: openReviewReportOverlay } = useReviewReportOverlay();
  const { open: openReviewDeleteOverlay } = useReviewDeleteOverlay();
  const { user, isAuthenticated } = useAuthStore();

  if (!review) return null;

  const {
    id: reviewId,
    rating,
    description,
    createdAt,
    user: reviewUser,
    replies = [],
  } = review;

  const canDelete =
    isAuthenticated &&
    (reviewUser?.id === user?.id || isOwner || user?.isAdmin);

  const canReply = isAuthenticated && isOwner;
  const canReport = isAuthenticated && reviewUser?.id !== user?.id;
  const formattedDate = format(new Date(createdAt), "MMM d, yyyy");

  const handleReply = () => {
    openReviewAddOverlay({
      isReply: true,
      reviewId,
      onSuccess: () => {
        if (onUpdated) onUpdated();
      },
    });
  };

  const handleReport = () => {
    openReviewReportOverlay({
      reviewId,
      onSuccess: () => {
        if (onUpdated) onUpdated();
      },
    });
  };

  const handleDelete = () => {
    openReviewDeleteOverlay({
      reviewId,
      onSuccess: () => {
        if (onUpdated) onUpdated();
      },
    });
  };

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <Avatar>
                  <AvatarFallback>{reviewUser?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{reviewUser?.name}</span>
                  {reviewUser?.isAdmin && (
                    <Badge variant="destructive" className="ml-1 text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <div className="flex items-center">
                    <IconClock className="mr-1 h-3 w-3" />
                    {formattedDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <IconStarFilled
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < rating ? "text-yellow-400" : "text-gray-200",
                  )}
                />
              ))}
            </div>
          </div>

          <p className="text-sm">{description}</p>

          <div className="flex justify-end gap-2">
            {canReport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReport}
                className="text-muted-foreground hover:text-destructive text-xs"
              >
                <IconFlag className="mr-1 h-3 w-3" />
                Report
              </Button>
            )}

            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReply}
                className="text-xs"
              >
                <IconArrowBack className="mr-1 h-3 w-3" />
                Reply
              </Button>
            )}

            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-muted-foreground hover:text-destructive text-xs"
              >
                <IconTrash className="mr-1 h-3 w-3" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {replies && replies.length > 0 && (
        <div className="border-t">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-muted/30 p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                      <IconShieldCheckFilled className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {reply.merchant?.name}
                        </span>
                        <Badge variant="outline" className="ml-1 text-xs">
                          Owner
                        </Badge>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <div className="flex items-center">
                          <IconClock className="mr-1 h-3 w-3" />
                          {format(new Date(reply.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { ReviewCard };
