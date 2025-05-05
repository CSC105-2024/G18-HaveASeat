import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { IconCalendar, IconPhotoScan } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRequiredLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useModalStore } from "@/store/modal.jsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils.js";
import { Button } from "@/components/ui/button.jsx";
import { addHours, format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar.jsx";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  reservationDate: z.date({
    required_error: "A reservation date is required.",
  }),
  reservationTimeStart: z.date({
    required_error: "A reservation time is required.",
  }),
  reservationTimeEnd: z.date({
    required_error: "A reservation time is required.",
  }),
  customerName: z
    .string()
    .min(1, {
      message: "Customer Name must be at least 1 character.",
    })
    .optional(),
  guests: z.number().min(1, {
    message: "Number of guest must be at least 1",
  }),
  tables: z.number().min(1, {
    message: "Amount of table reserved must be at least 1",
  }),
  note: z.string().max(2500, {
    message: "Note must not be longer than 2500 characters.",
  }),
});

/**
 * @typedef {Object} ReservationAddOverlayProps
 * @property {boolean} [isManual]
 */

/**
 * @param {ReservationAddOverlayProps} props
 * @returns {JSX.Element}
 */
function ReservationAddOverlay({ isManual = false }) {
  const { closeModal } = useModalStore();

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof formSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reservationDate: new Date(),
      reservationTimeStart: format(new Date(), "HH:mm"),
      reservationTimeEnd: format(addHours(new Date(), 1), "HH:mm"),
      guests: 1,
      tables: 1,
      note: "",
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
    <div className="space-y-4">
      <div className="flex aspect-video w-full flex-col items-center justify-center bg-gray-50">
        <IconPhotoScan className="size-16 text-gray-200" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col items-end gap-4 md:flex-row">
              <FormField
                control={form.control}
                name="reservationDate"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>
                      Reservation Date <FormRequiredLabel />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          autoFocus={true}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reservationTimeStart"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>
                      Start Time <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input type="time" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reservationTimeEnd"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>
                      End Time <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input type="time" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isManual && (
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-col gap-4 md:flex-row">
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel>
                      Number of Guests <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a number of guests"
                        type="number"
                        min={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Amount of Table <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the amount of table"
                        type="number"
                        min={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="seat"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormLabel>
                    Seat <FormRequiredLabel />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a seat zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="zone-1">Zone 1</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about what you want?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can provide more specification to the merchant for
                    merchant.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button type="submit" className="w-full flex-1">
              Confirm
            </Button>
            <Button
              type="button"
              className="w-full flex-1"
              variant="secondary"
              onClick={() => closeModal("reservation-add-modal")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const useReservationAddOverlay = createModalHook(
  ReservationAddOverlay,
  "reservation-add-modal",
  "Reservation Add",
  "",
);

export { useReservationAddOverlay, ReservationAddOverlay };
