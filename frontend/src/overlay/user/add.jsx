import React, { Fragment, useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { z } from "zod";
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
import { Button } from "@/components/ui/button.jsx";
import { format } from "date-fns";
import { cn } from "@/lib/utils.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.jsx";
import { IconCalendarWeekFilled } from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar.jsx";
import { useAuthStore } from "@/store/auth.js";
import axiosInstance from "@/lib/axios.js";

const FormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    phone: z
      .string()
      .regex(
        /|^\d{9,10}$/,
        "Please enter a valid phone number (e.g. 0812345678)",
      )
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
    password: z.string().min(8, "Please enter at least 8 characters"),
    rePassword: z.string().min(1, "Please enter a password confirmation"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

/**
 * @typedef {Object} SignUpOverlayProps
 * @property {boolean} [addMode]
 */

/**
 * @param {SignUpOverlayProps} props
 * @returns {JSX.Element}
 */
function SignUpOverlay({ addMode = false }) {
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModalStore();
  const { login } = useAuthStore();

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
      password: "",
      rePassword: "",
    },
  });

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  async function onSubmit(data) {
    setIsLoading(true);
    try {
      const formattedData = {
        email: data.email,
        password: data.password,
        name: data.name,
        phoneNumber: data.phone,
        birthday: data.dob,
      };

      const response = await axiosInstance.post(
        "/authentication/signup",
        formattedData,
      );
      const { accessToken, refreshToken, user } = response.data;

      if (!addMode) {
        await login(user, accessToken, refreshToken);
        toast.success("Account created successfully!");
      } else {
        toast.success("User added successfully!");
      }

      closeModal("user-add");
    } catch (error) {
      console.error("Sign up error:", error);
      if (error.response?.status === 409) {
        toast.error("User already exists with this email");
      } else if (error.response?.status === 400) {
        toast.error("Please check your input and try again");
      } else {
        toast.error("An error occurred during sign up");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4 pt-4">
      {!addMode && <h1 className="text-xl font-semibold">Sign Up</h1>}
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
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full md:flex-1/2">
                    <FormLabel>
                      Password <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
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
                name="rePassword"
                render={({ field }) => (
                  <FormItem className="w-full md:flex-1/2">
                    <FormLabel>
                      Re - Password <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm your password"
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
              {isLoading ? "Processing..." : addMode ? "Confirm" : "Sign Up"}
            </Button>
            {addMode && (
              <Button
                type="button"
                className="w-full flex-1"
                variant="secondary"
                onClick={() => closeModal("user-add")}
              >
                Exit without saving
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

const useSignUpOverlay = createModalHook(
  SignUpOverlay,
  "user-add",
  ({ addMode }) => (addMode ? "Add User" : "Have A Seat"),
  ({ addMode }) => (
    <Fragment>
      {addMode
        ? "After making your edits, be sure to save your changes."
        : "Book It. Sip It. Love It."}{" "}
      <span className="text-red-500">*Required fields.</span>
    </Fragment>
  ),
);

export {
  useSignUpOverlay,
  SignUpOverlay,
  useSignUpOverlay as useUserAddOverlay,
  SignUpOverlay as UserAddOverlay,
};
