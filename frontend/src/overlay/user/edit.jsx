import React, { Fragment } from "react";
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
  FormRequiredLabel
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";
import { format } from "date-fns";
import { IconCalendarWeekFilled } from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar.jsx";
import { z } from "zod";

const FormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    phone: z
      .string()
      .regex(/^[0-9]{9,10}$/, "Please enter a valid phone number"),
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
  })

function UserEditOverlay() {
  const { closeModal } = useModalStore();

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

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  function onSubmit(data) {
    toast.message("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
                  <FormLabel>
                    Phone Number <FormRequiredLabel />
                  </FormLabel>
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Button type="submit" className="w-full flex-1">
              Confirm
            </Button>
            <Button type="button" className="w-full flex-1" variant="secondary" onClick={() => closeModal('user-edit')}>
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

export {
  useUserEditOverlay,
  UserEditOverlay,
};
