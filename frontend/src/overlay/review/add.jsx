import React, { useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { IconStar } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea.jsx";
import { useModalStore } from "@/store/modal.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { cn } from "@/lib/utils.js";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  description: z
    .string()
    .min(3, "Review must be at least 3 characters")
    .max(500, "Review cannot exceed 500 characters"),
});

const replySchema = z.object({
  content: z
    .string()
    .min(3, "Reply must be at least 3 characters")
    .max(500, "Reply cannot exceed 500 characters"),
});

/**
 * @typedef {Object} ReviewAddOverlayProps
 * @property {boolean} [isReply] - Whether this is a reply to a review
 * @property {string} [reviewId] - ID of the review being replied to (for replies)
 * @property {string} [userId] - ID of the user who wrote the review (for replies)
 * @property {string} [userName] - Name of the user who wrote the review (for replies)
 * @property {string} [merchantId] - ID of the merchant being reviewed (for reviews)
 * @property {string} [merchantName] - Name of the merchant being reviewed (for reviews)
 * @property {Function} [onSuccess] - Callback function after successful submission
 */

/**
 * @param {ReviewAddOverlayProps} props
 * @returns {JSX.Element}
 */
function ReviewAddOverlay({
  isReply = false,
  reviewId,
  userId,
  userName,
  merchantId,
  merchantName,
  onSuccess,
}) {
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = isReply ? replySchema : reviewSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: isReply ? { content: "" } : { rating: 0, description: "" },
  });

  const [hoverRating, setHoverRating] = useState(0);
  const rating = form.watch("rating");

  const pluralRules = new Intl.PluralRules("en-US");

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      if (isReply) {
        if (!reviewId) {
          toast.error("Review ID is required");
          return;
        }

        await axiosInstance.post(`/review/${reviewId}/reply`, {
          reviewId,
          content: data.content,
        });

        toast.success("Reply posted successfully");
      } else {
        if (!merchantId) {
          toast.error("Merchant ID is required");
          return;
        }

        await axiosInstance.post("/review", {
          merchantId,
          rating: data.rating,
          description: data.description,
        });

        toast.success("Review posted successfully");
      }

      if (onSuccess) {
        onSuccess();
      }

      closeModal("review-add");
    } catch (error) {
      console.error("Error submitting review/reply:", error);

      if (error.response?.status === 403) {
        toast.error("You don't have permission to post this");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Invalid submission");
      } else if (error.response?.status === 409) {
        toast.error("You have already reviewed this merchant");
      } else {
        toast.error(isReply ? "Failed to post reply" : "Failed to post review");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isReply) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Your Reply to {userName || "the review"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32 bg-gray-50/50"
                      placeholder="Write your reply to the review here..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your reply will be visible to all users
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Reply"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => closeModal("review-add")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating for {merchantName || "this place"}</FormLabel>
              <FormControl>
                <div className="flex justify-center space-x-1">
                  <TooltipProvider>
                    {[1, 2, 3, 4, 5].map((number) => (
                      <Tooltip key={number}>
                        <TooltipTrigger asChild>
                          <IconStar
                            onClick={() => field.onChange(number)}
                            onMouseEnter={() => setHoverRating(number)}
                            onMouseLeave={() => setHoverRating(0)}
                            onTouchStart={() => setHoverRating(number)}
                            onTouchEnd={() => setHoverRating(0)}
                            className={cn(
                              "size-8 cursor-pointer transition-colors duration-150",
                              number <= (hoverRating || field.value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {number}{" "}
                            {pluralRules.select(number) === "one"
                              ? "Star"
                              : "Stars"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </FormControl>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Experience</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-32 bg-gray-50/50"
                  placeholder="Describe what's your experience of this place like?"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your review helps others discover great local businesses
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Submit Review"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => closeModal("review-add")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

const useReviewAddOverlay = createModalHook(
  ReviewAddOverlay,
  "review-add",
  ({ isReply }) => (isReply ? "Reply to Review" : "Write a Review"),
  ({ isReply }) =>
    isReply
      ? "This is the best way to interact with your customers"
      : "Tell us more about this place!",
);

export { useReviewAddOverlay, ReviewAddOverlay };
