import React, { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator.jsx";
import { useAuthStore } from "@/store/auth.js";
import Loading from "@/components/layout/loading.jsx";
import axiosInstance from "@/lib/axios.js";

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

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuthStore();

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof FormSchema>>} */
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
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phoneNumber || "",
        email: user.email || "",
        dob: user.birthday ? new Date(user.birthday) : new Date(),
      });
    }
  }, [user, form]);

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  async function onSubmitForm(data) {
    setIsLoading(true);
    try {
      const formattedData = {
        name: data.name,
        phoneNumber: data.phone,
        email: data.email,
        birthday: data.dob,
      };

      await axiosInstance.put(`/user/settings`, formattedData);

      await updateUser();

      toast.success("Personal information updated successfully");
    } catch (error) {
      console.error("Update personal info error:", error);
      if (error.response?.status === 400) {
        toast.error("Invalid data provided");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to update this information");
      } else {
        toast.error("Failed to update personal information");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return <Loading />;
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
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="space-y-8"
              >
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
                          <Input
                            placeholder="Enter your phone number"
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                                  user.birthday
                                    ? new Date(user.birthday)
                                    : new Date(
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
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                  <Button
                    type="submit"
                    className="w-full flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
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
