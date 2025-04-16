import React, { useState } from "react";
import { useParams } from "react-router";
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

const FormSchema = z.object({
  floor_plan: z
    .instanceof(File, {
      message: "Floor Plan image is required",
    })
    .refine((files) => {
      return files?.size <= MAX_FILE_SIZE;
    }, `Image must be less than ${MAX_FILE_MB}MB`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type),
      "Only JPEG, PNG, WebP, and GIF formats are supported",
    ),
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

  const [floorPlanImagePreview, setFloorPlanImagePreview] = useState(
    /** @type {File|null} */ null,
  );

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof FormSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      floor_plan: undefined,
      zone: [{ name: "", amount: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "zone",
  });

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  function onSubmitForm(data) {
    toast.message("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <MerchantLayout>
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
                                setFloorPlanImagePreview(e.target.files?.[0] || null);
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
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                  <Button type="submit" className="w-full flex-1">
                    Save
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
