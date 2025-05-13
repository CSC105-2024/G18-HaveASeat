import React, { useState } from "react";
import AccountLayout from "@/components/layout/account.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
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
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useAuthStore } from "@/store/auth.js";
import axiosInstance from "@/lib/axios.js";

const FormSchema = z
  .object({
    password: z.string().min(1, "Please enter your current password"),
    newPassword: z.string().min(8, "Please enter at least 8 characters"),
    reNewPassword: z
      .string()
      .min(1, "Please enter a new password confirmation"),
  })
  .refine((data) => data.newPassword === data.reNewPassword, {
    message: "New passwords do not match",
    path: ["reNewPassword"],
  });

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof FormSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      reNewPassword: "",
    },
  });

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  async function onSubmitForm(data) {
    if (!user) {
      toast.error("User not found");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post(`/user/settings/security`, {
        currentPassword: data.password,
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully");
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
    <AccountLayout>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Account Settings</h2>
          <Separator />
        </div>
        <div className="flex flex-col gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Security</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="space-y-8"
              >
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Current Password <FormRequiredLabel />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your current password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
        </div>
      </div>
    </AccountLayout>
  );
}

export default Page;
