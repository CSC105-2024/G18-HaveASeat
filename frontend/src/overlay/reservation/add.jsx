import React, { useEffect, useState } from "react";
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
import { addHours, addMinutes, format, isBefore, parse, startOfToday } from "date-fns";
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
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { constructAPIUrl } from "@/lib/url.js";

const FormSchema = z
  .object({
    reservationDate: z
      .date({
        required_error: "A reservation date is required.",
      })
      .refine((date) => !isBefore(date, startOfToday()), {
        message: "Reservation date cannot be in the past",
      }),
    reservationTimeStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Valid time format is required (HH:MM)",
    }),
    reservationTimeEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Valid time format is required (HH:MM)",
    }),
    customerName: z
      .string()
      .min(1, {
        message: "Customer Name must be at least 1 character.",
      })
      .optional()
      .or(z.literal("")),
    customerPhone: z
      .string()
      .regex(
        /|^\d{9,10}$/,
        "Please enter a valid phone number (e.g. 0812345678)",
      )
      .optional(),
    guests: z.number().min(1, {
      message: "Number of guest must be at least 1",
    }),
    tables: z.number().min(1, {
      message: "Amount of table reserved must be at least 1",
    }),
    seat: z.string({
      required_error: "Seat selection is required.",
    }),
    note: z
      .string()
      .max(2500, {
        message: "Note must not be longer than 2500 characters.",
      })
      .optional(),
  })
  .refine(
    (data) => {
      const startTime = parse(
        data.reservationTimeStart,
        "HH:mm",
        data.reservationDate,
      );
      const endTime = parse(
        data.reservationTimeEnd,
        "HH:mm",
        data.reservationDate,
      );

      return isBefore(startTime, endTime);
    },
    {
      message: "End time must be after start time",
      path: ["reservationTimeEnd"],
    },
  );

/**
 * @typedef {Object} ReservationAddOverlayProps
 * @property {boolean} [isManual] - Whether this is a manual reservation by staff
 * @property {string} [merchantId] - ID of the merchant
 * @property {Function} [onSuccess] - Callback function after successful reservation
 */

/**
 * @param {ReservationAddOverlayProps} props
 * @returns {JSX.Element}
 */
function ReservationAddOverlay({ isManual = false, merchantId, onSuccess }) {
  const { closeModal } = useModalStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableSeats, setAvailableSeats] = useState([]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reservationDate: new Date(),
      reservationTimeStart: format(addMinutes(new Date(), 5), "HH:mm"),
      reservationTimeEnd: format(addHours(new Date(), 1), "HH:mm"),
      customerName: user?.name || "",
      customerPhone: user?.phoneNumber || "",
      guests: 1,
      tables: 1,
      seat: "",
      note: "",
    },
  });

  useEffect(() => {
    const fetchMerchant = async () => {
      if (!merchantId) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/merchant/${merchantId}`);
        setMerchant(response.data);

        if (response.data.zones && response.data.zones.length > 0) {
          const availableZones = response.data.zones.filter(
            (zone) => zone.availableSeats > 0,
          );
          setAvailableSeats(availableZones);

          if (availableZones.length > 0) {
            form.setValue("seat", availableZones[0].name);
          }
        }
      } catch (error) {
        console.error("Error fetching merchant:", error);
        toast.error("Failed to load merchant data");
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [merchantId, form]);

  const validateTimes = (start, end, date) => {
    const startTime = parse(start, "HH:mm", date);
    const endTime = parse(end, "HH:mm", date);
    return isBefore(startTime, endTime);
  };

  async function onSubmit(data) {
    if (
      !validateTimes(
        data.reservationTimeStart,
        data.reservationTimeEnd,
        data.reservationDate,
      )
    ) {
      form.setError("reservationTimeEnd", {
        type: "manual",
        message: "End time must be after start time",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationData = {
        merchantId,
        seatLocation: data.seat,
        date: format(data.reservationDate, "yyyy-MM-dd"),
        startTime: `${format(data.reservationDate, "yyyy-MM-dd")}T${data.reservationTimeStart}:00`,
        endTime: `${format(data.reservationDate, "yyyy-MM-dd")}T${data.reservationTimeEnd}:00`,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        numberOfGuests: data.guests,
        numberOfTables: data.tables,
        note: data.note || "",

        reservationType: isManual ? "WALK_IN" : "ONLINE",
      };

      const response = await axiosInstance.post(
        "/reservation",
        reservationData,
      );

      toast.success("Reservation created successfully");

      if (onSuccess) {
        onSuccess(response.data);
      }

      closeModal("reservation-add-modal");
    } catch (error) {
      console.error("Error creating reservation:", error);

      if (error.response?.status === 409) {
        toast.error("This time slot is already booked");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Invalid reservation data");
      } else {
        toast.error("Failed to create reservation");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex aspect-video w-full flex-col items-center justify-center bg-gray-50">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Floor Plan Preview */}
      <div className="flex aspect-video w-full flex-col items-center justify-center bg-gray-50">
        {merchant?.floorPlan ? (
          <img
            src={constructAPIUrl(merchant.floorPlan)}
            alt="Floor Plan"
            className="h-full w-full object-contain"
          />
        ) : (
          <IconPhotoScan className="size-16 text-gray-200" />
        )}
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
                          disabled={(date) => isBefore(date, startOfToday())}
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
                      <Input type="time" {...field} />
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
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isManual && (
              <div className="flex flex-col gap-4 md:flex-row">
                {/* Customer Information */}
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>
                        Customer Name <FormRequiredLabel />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                        value={field.value}
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
                  <FormItem className="w-full flex-1">
                    <FormLabel>
                      Amount of Table <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the amount of table"
                        type="number"
                        min={1}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                        value={field.value}
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
                      {availableSeats.length > 0 ? (
                        availableSeats.map((zone) => (
                          <SelectItem key={zone.name} value={zone.name}>
                            {zone.name} ({zone.availableSeats} seats available)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="-1" disabled>
                          No available seats
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {availableSeats.length === 0
                      ? "No seats available. Please select a different date or time."
                      : "Select your preferred seating area"}
                  </FormDescription>
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
                    You can provide more specification to the merchant.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              type="submit"
              className="w-full flex-1"
              disabled={isSubmitting || availableSeats.length === 0}
            >
              {isSubmitting ? "Creating..." : "Confirm"}
            </Button>
            <Button
              type="button"
              className="w-full flex-1"
              variant="secondary"
              onClick={() => closeModal("reservation-add-modal")}
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

const useReservationAddOverlay = createModalHook(
  ReservationAddOverlay,
  "reservation-add-modal",
  "Make a Reservation",
  "",
  "lg",
);

export { useReservationAddOverlay, ReservationAddOverlay };
