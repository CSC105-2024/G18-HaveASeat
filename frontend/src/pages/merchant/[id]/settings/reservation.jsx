import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import MerchantLayout from "@/components/layout/merchant.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_FILE_MB,
  MAX_FILE_SIZE,
} from "@/constants/file.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { IconPhotoQuestion, IconPlus, IconTrash } from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import { constructAPIUrl } from "@/lib/url.js";
import SetupProgress from "@/components/merchant/setup-progress.jsx";

const FormSchema = z.object({
  floor_plan: z
    .any()
    .optional()
    .refine((file) => {
      if (!file || file === undefined) return true;
      return file.size <= MAX_FILE_SIZE;
    }, `Image must be less than ${MAX_FILE_MB}MB`)
    .refine((file) => {
      if (!file || file === undefined) return true;
      return ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
    }, "Only JPEG, PNG, WebP, and GIF formats are supported"),
  zone: z
    .array(
      z.object({
        name: z.string().min(1, {
          message: "Zone name is required",
        }),
        amount: z
          .number({
            coerce: true,
          })
          .min(1, {
            message: "Seat amount must be at least 1",
          }),
      }),
    )
    .nonempty("At least one zone is required"),
});

function Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [floorPlanImagePreview, setFloorPlanImagePreview] = useState(null);
  const [existingFloorPlan, setExistingFloorPlan] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      floor_plan: undefined,
      zone: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "zone",
  });

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        setIsFetching(true);
        const response = await axiosInstance.get(
          `/merchant/${id}/settings/reservation`,
        );
        const data = response.data;

        if (data.floor_plan) {
          setExistingFloorPlan(data.floor_plan);
        }

        if (data.zones && data.zones.length > 0) {
          form.setValue("zone", data.zones);
        } else {
          append({ name: "", amount: 0 });
        }
      } catch (error) {
        console.error("Error fetching reservation data:", error);
        toast.error("Failed to load reservation data");

        append({ name: "", amount: 0 });
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchReservationData();
    }
  }, [id, append, form]);

  async function onSubmitForm(data) {
    setIsLoading(true);
    try {
      const formData = new FormData();

      if (data.floor_plan instanceof File) {
        formData.append("floor_plan", data.floor_plan);
      }

      formData.append("zones", JSON.stringify(data.zone));

      await axiosInstance.patch(
        `/merchant/${id}/settings/reservation`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Reservation settings updated successfully");

      const response = await axiosInstance.get(
        `/merchant/${id}/settings/reservation`,
      );
      const newData = response.data;

      if (newData.floor_plan) {
        setExistingFloorPlan(newData.floor_plan);
        setFloorPlanImagePreview(null);
        form.setValue("floor_plan", undefined);
      }

      if (newData.zones) {
        form.setValue("zone", newData.zones);
      }

      navigate(0);
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation settings");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <MerchantLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <SetupProgress />
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Merchant Settings</h2>
          <Separator />
        </div>
        <div className="flex flex-col gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reservation & Zones</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="space-y-8"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col items-start gap-4 lg:flex-row">
                    <div className="relative aspect-video w-full rounded bg-gray-100 lg:basis-4/12">
                      {floorPlanImagePreview ? (
                        <img
                          src={URL.createObjectURL(floorPlanImagePreview)}
                          alt="Uploaded Image"
                          className="absolute aspect-video h-full w-full rounded object-contain select-none"
                        />
                      ) : existingFloorPlan ? (
                        <img
                          src={constructAPIUrl(existingFloorPlan)}
                          alt="Current Floor Plan"
                          className="absolute aspect-video h-full w-full rounded object-contain select-none"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <IconPhotoQuestion className="size-8 text-gray-400/50" />
                        </div>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name="floor_plan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor Plan</FormLabel>
                          <FormDescription>
                            This image will appear on the reservation page to
                            help customers select the correct seat.
                          </FormDescription>
                          <FormControl>
                            <Input
                              type="file"
                              accept={ACCEPTED_IMAGE_MIME_TYPES.join(",")}
                              onChange={(e) => {
                                field.onChange(e.target.files?.[0]);
                                setFloorPlanImagePreview(
                                  e.target.files?.[0] || null,
                                );
                              }}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormDescription>
                            Only .jpg, .jpeg, .png, and .webp formats are
                            supported. The recommended aspect ratio is 16:9.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <FormLabel className="text-xl font-semibold">
                          Zones
                        </FormLabel>
                        <FormDescription className="text-muted-foreground text-sm">
                          This is the seat and zone selector that customers will
                          use on the reservation page.
                        </FormDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ name: "", amount: 0 })}
                        className="flex items-center gap-1"
                      >
                        <IconPlus className="h-4 w-4" /> Add Zone
                      </Button>
                    </div>

                    {fields.map((field, index) => (
                      <div key={field.id} className="overflow-hidden">
                        <div className="space-y-4 rounded bg-gray-50/50 p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Zone {index + 1}</h3>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                className="h-8 w-8 p-0 text-red-500"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`zone.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Zone Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter zone name"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`zone.${index}.amount`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Number of Seats</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder="Enter seat amount"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {form.formState.errors.zone?.root?.message && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.zone.root.message}
                      </p>
                    )}
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
    </MerchantLayout>
  );
}

export default Page;
