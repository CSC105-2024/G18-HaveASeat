import React, { Fragment, useEffect, useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { useModalStore } from "@/store/modal.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRequiredLabel,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.jsx";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";
import { format } from "date-fns";
import { IconCalendarWeekFilled } from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar.jsx";
import { z } from "zod";
import axiosInstance from "@/lib/axios.js";

const FormSchema = z
  .object({
    newPassword: z.string().min(8, "Please enter at least 8 characters"),
    reNewPassword: z
      .string()
      .min(1, "Please enter a new password confirmation"),
  })
  .refine((data) => data.newPassword === data.reNewPassword, {
    message: "New passwords do not match",
    path: ["reNewPassword"],
  });

/**
 * @typedef {Object} UserEditSecurityOverlayProps
 * @property {boolean} [userId]
 * @property {boolean} [userData]
 * @property {boolean} [onSuccess]
 */

/**
 * @param {Object} UserEditSecurityOverlayProps
 * @returns {Element}
 */
function UserEditSecurityOverlay({ userId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModalStore();

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof formSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      reNewPassword: "",
    },
  });

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  async function onSubmitForm(data) {
    if (!userId) {
      toast.error("User not found");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post(`/users/${userId}/security`, {
        newPassword: data.newPassword,
      });

      if(onSuccess) {
        onSuccess();
      }

      toast.success("Password changed successfully");
      closeModal('user-edit-security')
      form.reset();
    } catch (error) {
      console.error("Change password error:", error);
      if (error.response?.status === 400) {
        toast.error("Current password is incorrect");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to change the password");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4 pt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitForm)}
          className="space-y-8"
        >
          <div className="space-y-8">
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="w-full md:flex-1/2">
                    <FormLabel>
                      New Password <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your new password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reNewPassword"
                render={({ field }) => (
                  <FormItem className="w-full md:flex-1/2">
                    <FormLabel>
                      Re - New Password <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm your new password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              type="submit"
              className="w-full flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const useUserEditSecurityOverlay = createModalHook(
  UserEditSecurityOverlay,
  "user-edit-security",
  "Change User Security",
  <Fragment>
    After making changes or edits, be sure to save.{" "}
    <span className="text-red-500">*Required fields.</span>
  </Fragment>,
);

export { useUserEditSecurityOverlay, UserEditSecurityOverlay };
