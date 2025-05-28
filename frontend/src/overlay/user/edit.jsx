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
import { useUserEditSecurityOverlay } from "@/overlay/user/security.jsx";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(/|^\d{9,10}$/, "Please enter a valid phone number (e.g. 0812345678)")
    .optional(),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  dob: z
    .date({
      required_error: "A date of birth is required",
    })
    .max(
      new Date(
        new Date().getFullYear() - 18,
        new Date().getMonth(),
        new Date().getDate(),
      ),
      "You must be at least 18 years old to use this platform",
    ),
});

/**
 * @typedef {Object} UserEditOverlayProps
 * @property {boolean} [userId]
 * @property {boolean} [userData]
 * @property {boolean} [onSuccess]
 */

/**
 * @param {Object} UserEditOverlayProps
 * @returns {Element}
 */
function UserEditOverlay({ userId, userData, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const { closeModal } = useModalStore();
  const { open: openUserEditSecurityOverlay } = useUserEditSecurityOverlay();

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof formSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      dob: new Date(
        new Date().getFullYear() - 18,
        new Date().getMonth(),
        new Date().getDate(),
      ),
    },
  });

  useEffect(() => {
    if (userId && !userData) {
      setIsLoadingUser(true);
      axiosInstance
        .get(`/users/${userId}`)
        .then((response) => {
          const user = response.data;
          form.reset({
            name: user.name || "",
            phone: user.phoneNumber || "",
            email: user.email || "",
            dob: user.birthday ? new Date(user.birthday) : new Date(),
          });
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          toast.error("Failed to load user data");
        })
        .finally(() => {
          setIsLoadingUser(false);
        });
    } else if (userData) {
      form.reset({
        name: userData.name || "",
        phone: userData.phoneNumber || "",
        email: userData.email || "",
        dob: userData.birthday ? new Date(userData.birthday) : new Date(),
      });
    }
  }, [userId, userData]);

  function handleOnSwapOverlay() {
    closeModal('user-edit');
    openUserEditSecurityOverlay({ userId });
  }

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  async function onSubmit(data) {
    if (!userId) {
      toast.error("No user ID provided");
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        name: data.name,
        phoneNumber: data.phone,
        email: data.email,
        birthday: data.dob,
      };

      const response = await axiosInstance.put(`/users/${userId}`, updateData);

      toast.success("User updated successfully");
      closeModal("user-edit");

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Update user error:", error);
      if (error.response?.status === 404) {
        toast.error("User not found");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to edit this user");
      } else if (error.response?.status === 400) {
        toast.error("Invalid data provided");
      } else {
        toast.error("Failed to update user");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center py-8">
        <span>Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <FormRequiredLabel />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full md:flex-1/2">
                    <FormLabel>
                      Email Address <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="w-full md:flex-1/2">
                    <FormLabel>
                      Date of Birth <FormRequiredLabel />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <IconCalendarWeekFilled className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date();
                            const minDate = new Date("1900-01-01");
                            const maxDate = new Date();
                            maxDate.setFullYear(today.getFullYear() - 18);

                            return date > maxDate || date < minDate;
                          }}
                          defaultMonth={
                            new Date(
                              new Date().getFullYear() - 18,
                              new Date().getMonth(),
                              new Date().getDate(),
                            )
                          }
                          autoFocus={true}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormLabel>
                Change Password
              </FormLabel>
              <Button type="button" variant="outline" onClick={handleOnSwapOverlay}>
                Change Password
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              type="submit"
              className="w-full flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Confirm"}
            </Button>
            <Button
              type="button"
              className="w-full flex-1"
              variant="secondary"
              onClick={() => closeModal("user-edit")}
              disabled={isLoading}
            >
              Exit without saving
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const useUserEditOverlay = createModalHook(
  UserEditOverlay,
  "user-edit",
  "Edit User",
  <Fragment>
    After making changes or edits, be sure to save.{" "}
    <span className="text-red-500">*Required fields.</span>
  </Fragment>,
);

export { useUserEditOverlay, UserEditOverlay };
