import React, { useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useModalStore } from "@/store/modal.jsx";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { IconFlag } from "@tabler/icons-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const reportSchema = z.object({
  reason: z.enum(["SPAM", "OFFENSIVE", "FALSE_INFORMATION", "OTHER"], {
    required_error: "Please select a reason for reporting",
  }),
  details: z.string().optional(),
});

function ReportReasonLabel({ reason }) {
  switch (reason) {
    case "SPAM":
      return "Spam content";
    case "OFFENSIVE":
      return "Offensive or inappropriate";
    case "FALSE_INFORMATION":
      return "Contains false information";
    case "OTHER":
      return "Other reason";
    default:
      return reason;
  }
}

function ReviewReportOverlay({ reviewId, onSuccess }) {
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reason: undefined,
      details: "",
    },
  });

  const onSubmit = async (data) => {
    if (!reviewId) {
      toast.error("Review ID is missing");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axiosInstance.post(`/review/${reviewId}/report`, {
        reviewId,
        reason: data.reason,
        details: data.details || undefined,
      });

      toast.success("Review reported successfully");
      closeModal("review-report");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error reporting review:", error);

      if (error.response?.status === 409) {
        toast.error("You have already reported this review");
      } else {
        toast.error("Failed to report review");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-amber-100 p-3">
            <IconFlag className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-medium">Report Review</h3>
        <p className="text-muted-foreground text-sm">
          Please tell us why you're reporting this review.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SPAM">Spam content</SelectItem>
                    <SelectItem value="OFFENSIVE">
                      Offensive or inappropriate
                    </SelectItem>
                    <SelectItem value="FALSE_INFORMATION">
                      Contains false information
                    </SelectItem>
                    <SelectItem value="OTHER">Other reason</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide any additional details that would help us understand your report"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This information will only be used for moderation purposes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
            <Button
              type="button"
              onClick={() => closeModal("review-report")}
              className="flex-1"
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const useReviewReportOverlay = createModalHook(
  ReviewReportOverlay,
  "review-report",
  "Report Review",
  null,
);

export { useReviewReportOverlay, ReviewReportOverlay };
