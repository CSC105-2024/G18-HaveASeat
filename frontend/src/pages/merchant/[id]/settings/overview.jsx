import React, { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "react-router";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator.jsx";
import MerchantLayout from "@/components/layout/merchant.jsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRequiredLabel,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { timeToMinutes } from "@/lib/time.js";
import axiosInstance from "@/lib/axios";

/**
 * @typedef {{
 *   id: number;
 *   provinceCode: number;
 *   provinceNameEn: string;
 *   provinceNameTh: string;
 *   districtCode: number;
 *   districtNameEn: string;
 *   districtNameTh: string;
 *   subdistrictCode: number;
 *   subdistrictNameEn: string;
 *   subdistrictNameTh: string;
 *   postalCode: number;
 * }} Address
 */
/** @type {Address[]} */
import addressData from "@/data/geography.json";
import SetupProgress from "@/components/merchant/setup-progress.jsx";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .max(
      25000,
      "Please provide a description that is no longer than 25,000 characters",
    )
    .optional(),
  telephone: z
    .string()
    .regex(
      /^(?:[0-9]{9,10})?$/,
      "Please enter a valid phone number (e.g. 0812345678)",
    )
    .optional(),
  open_hours: z
    .array(
      z
        .object({
          day: z.enum(
            [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            {
              invalid_type_error: "Please select a valid day for opening hours",
              required_error: "Please select a valid day for opening hours",
            },
          ),
          open: z
            .string()
            .regex(
              /^(?:[01][0-9]|2[0-3]):(?:[0-5][0-9])$/,
              "Please enter a valid open hours time range (00:00 - 23:59)",
            ),
          close: z
            .string()
            .regex(
              /^(?:[01][0-9]|2[0-3]):(?:[0-5][0-9])$/,
              "Please enter a valid close hours time range (00:00 - 23:59)",
            ),
        })
        .refine(
          (data) => {
            const openMinutes = timeToMinutes(data.open);
            const closeMinutes = timeToMinutes(data.close);

            if (openMinutes === null || closeMinutes === null) return true;

            return openMinutes < closeMinutes;
          },
          {
            message: "Opening time must be earlier than closing time",
            path: ["close"],
          },
        ),
    )
    .optional()
    .refine(
      (hours) => {
        if (!hours) return true;
        const days = hours.map((hour) => hour.day);
        return new Set(days).size === days.length;
      },
      {
        message: "Each day can only be selected once",
        path: ["root"],
      },
    ),
  address: z.string().min(1, {
    message: "Address detail is required",
  }),
  sub_district: z.string().min(1, {
    message: "Sub-district/Khwaeng is required",
  }),
  district: z.string().min(1, {
    message: "District/Khet is required",
  }),
  province: z.string().min(1, {
    message: "Province is required",
  }),
  zipcode: z.string().min(1, {
    message: "Postal code is required",
  }),
});

function Page() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [subDistricts, setSubDistricts] = useState(/** @type {string[]} */ []);
  const [districts, setDistricts] = useState(/** @type {string[]} */ []);
  const [provinces, setProvinces] = useState(/** @type {string[]} */ []);
  const [zipCodes, setZipCodes] = useState(/** @type {string[]} */ []);

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof FormSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      telephone: "",
      open_hours: [],
      address: "",
      sub_district: "",
      district: "",
      province: "",
      zipcode: "",
    },
  });

  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        setIsFetching(true);
        const response = await axiosInstance.get(
          `/merchant/${id}/settings/overview`,
        );
        const data = response.data;

        form.reset({
          name: data.name || "",
          description: data.description || "",
          telephone: data.telephone || "",
          open_hours: data.open_hours || [],
          address: data.address || "",
          sub_district: data.sub_district || "",
          district: data.district || "",
          province: data.province || "",
          zipcode: data.zipcode || "",
        });
      } catch (error) {
        console.error("Error fetching merchant data:", error);
        toast.error("Failed to load merchant data");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchMerchantData();
    }
  }, [id, form]);

  const selectedProvince = form.watch("province");
  const selectedDistrict = form.watch("district");
  const selectedSubDistrict = form.watch("sub_district");

  const resetDistrictAndSubDistrictAndZipCode = useCallback(() => {
    form.resetField("district", {
      keepTouched: false,
      defaultValue: "",
    });
    form.resetField("sub_district", {
      keepTouched: false,
    });
    form.resetField("zipcode", {
      keepTouched: false,
    });
    setDistricts([]);
    setSubDistricts([]);
    setZipCodes([]);
  }, [form]);

  const resetSubDistrictAndZipCode = useCallback(() => {
    form.resetField("sub_district", {
      keepTouched: false,
    });
    form.resetField("zipcode", {
      keepTouched: false,
    });
    setSubDistricts([]);
    setZipCodes([]);
  }, [form]);

  const resetZipCode = useCallback(() => {
    form.resetField("zipcode", {
      keepTouched: false,
    });
    setZipCodes([]);
  }, [form]);

  useEffect(() => {
    resetDistrictAndSubDistrictAndZipCode();
  }, [selectedProvince, resetDistrictAndSubDistrictAndZipCode]);

  useEffect(() => {
    resetSubDistrictAndZipCode();
  }, [selectedDistrict, resetSubDistrictAndZipCode]);

  useEffect(() => {
    resetZipCode();
  }, [selectedSubDistrict, resetZipCode]);

  useEffect(() => {
    const uniqueProvinces = Array.from(
      new Set(addressData.map((item) => item.provinceNameEn)),
    ).sort((a, b) => a.localeCompare(b));
    setProvinces(uniqueProvinces);
  }, []);

  const memoizedDistricts = useMemo(() => {
    if (selectedProvince) {
      return Array.from(
        new Set(
          addressData
            .filter((item) => item.provinceNameEn === selectedProvince)
            .map((item) => item.districtNameEn),
        ),
      ).sort((a, b) => a.localeCompare(b));
    }
    return [];
  }, [selectedProvince]);

  useEffect(() => {
    setDistricts(memoizedDistricts);
  }, [memoizedDistricts]);

  const memoizedSubDistricts = useMemo(() => {
    if (selectedDistrict) {
      return Array.from(
        new Set(
          addressData
            .filter(
              (item) =>
                item.districtNameEn === selectedDistrict &&
                typeof item.postalCode === "number",
            )
            .map((item) => item.subdistrictNameEn),
        ),
      ).sort((a, b) => a.localeCompare(b));
    }
    return [];
  }, [selectedDistrict]);

  useEffect(() => {
    setSubDistricts(memoizedSubDistricts);
  }, [memoizedSubDistricts]);

  const memoizedZipCodes = useMemo(() => {
    if (selectedSubDistrict) {
      return Array.from(
        new Set(
          addressData
            .filter(
              (item) =>
                item.districtNameEn === selectedDistrict &&
                item.subdistrictNameEn === selectedSubDistrict &&
                typeof item.postalCode === "number",
            )
            .map((item) => item.postalCode.toString()),
        ),
      ).sort((a, b) => Number(a) - Number(b));
    }
    return [];
  }, [selectedSubDistrict, selectedDistrict]);

  useEffect(() => {
    setZipCodes(memoizedZipCodes);
  }, [memoizedZipCodes]);

  async function onSubmitForm(data) {
    setIsLoading(true);
    try {
      await axiosInstance.patch(`/merchant/${id}/settings/overview`, data);
      toast.success("Merchant information updated successfully");
    } catch (error) {
      console.error("Error updating merchant:", error);
      toast.error("Failed to update merchant information");
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
      <SetupProgress trigger={isLoading} />
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Merchant Settings</h2>
          <Separator />
        </div>
        <div className="flex flex-col gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Merchant Overview</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="space-y-8"
              >
                <div className="flex flex-col gap-8">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name <FormRequiredLabel />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your place's name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <div className="relative overflow-hidden rounded-md">
                          <FormControl>
                            <Textarea
                              placeholder="Describe your place to your customers"
                              className="field-sizing-fixed"
                              maxLength={25000}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="absolute right-2 bottom-2">
                            {Intl.NumberFormat().format(
                              Math.max(0, 25000 - (field.value?.length || 0)),
                            )}
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your place's phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <div className="space-y-8">
                    <div className="flex flex-col gap-2">
                      <FormLabel className="text-xl font-semibold">
                        Address
                      </FormLabel>
                      <FormDescription className="text-muted-foreground text-sm">
                        This shows your customers where your place is located.
                      </FormDescription>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:flex-wrap">
                      {/* Province */}
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem className="w-full flex-1">
                            <FormLabel>
                              Province <FormRequiredLabel />
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Province" />
                                </SelectTrigger>
                              </FormControl>
                              {provinces.length > 0 && (
                                <SelectContent>
                                  {provinces.map((province) => (
                                    <SelectItem key={province} value={province}>
                                      {province}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              )}
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* District */}
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem className="w-full flex-1">
                            <FormLabel>
                              District <FormRequiredLabel />
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select District" />
                                </SelectTrigger>
                              </FormControl>
                              {districts.length > 0 && (
                                <SelectContent>
                                  {districts.map((district) => (
                                    <SelectItem key={district} value={district}>
                                      {district}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              )}
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Sub-district */}
                      <FormField
                        control={form.control}
                        name="sub_district"
                        render={({ field }) => (
                          <FormItem className="w-full flex-1">
                            <FormLabel className="flex-1">
                              Sub-district <FormRequiredLabel />
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Sub-district" />
                                </SelectTrigger>
                              </FormControl>
                              {subDistricts.length > 0 && (
                                <SelectContent>
                                  {subDistricts.map((subDistrict) => (
                                    <SelectItem
                                      key={subDistrict}
                                      value={subDistrict}
                                    >
                                      {subDistrict}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              )}
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* zipcode */}
                      <FormField
                        control={form.control}
                        name="zipcode"
                        render={({ field }) => (
                          <FormItem className="w-full flex-1">
                            <FormLabel>
                              Postal code <FormRequiredLabel />
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={
                                field.value ? String(field.value) : undefined
                              }
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Postal code" />
                                </SelectTrigger>
                              </FormControl>
                              {zipCodes.length > 0 && (
                                <SelectContent>
                                  {zipCodes.map((zipCode) => (
                                    <SelectItem
                                      key={zipCode}
                                      value={String(zipCode)}
                                    >
                                      {zipCode}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              )}
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Address Detail */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Address <FormRequiredLabel />
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              autoComplete="shipping street-address"
                              placeholder="Address Details"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            (i.g. house address, alley, road, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Opening Hours */}
                  <OpenHoursFormField form={form} />
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

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function OpenHoursFormField({ form }) {
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "open_hours",
  });

  const [selectedDays, setSelectedDays] = useState(
    /** @type {Record<string, boolean>} */ {},
  );

  useEffect(() => {
    /** @type {Record<string, boolean>} */
    const daysMap = {};
    form.getValues("open_hours")?.forEach((hour) => {
      if (hour.day) {
        daysMap[hour.day] = true;
      }
    });
    setSelectedDays(daysMap);
  }, [fields, form]);

  const addOpenHours = () => {
    const availableDay =
      DAYS_OF_WEEK.find((day) => !selectedDays[day]) || DAYS_OF_WEEK[0];
    append({ day: availableDay, open: "09:00", close: "17:00" });
  };

  const handleDayChange = (value, index) => {
    const currentValue = form.getValues(`open_hours.${index}.day`);

    if (selectedDays[value] && currentValue !== value) {
      form.setError(`open_hours.${index}.day`, {
        type: "manual",
        message: "This day is already selected",
      });
      return;
    }

    update(index, {
      ...form.getValues(`open_hours.${index}`),
      day: value,
    });

    form.clearErrors(`open_hours.${index}.day`);
  };

  const handleTimeChange = (value, index, field) => {
    const currentValues = form.getValues(`open_hours.${index}`);
    const openTime = field === "open" ? value : currentValues.open;
    const closeTime = field === "close" ? value : currentValues.close;

    form.setValue(`open_hours.${index}.${field}`, value);

    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);

    if (openMinutes !== null && closeMinutes !== null) {
      if (openMinutes >= closeMinutes) {
        form.setError(`open_hours.${index}.close`, {
          type: "manual",
          message: "Closing time must be later than opening time",
        });
      } else {
        form.clearErrors(`open_hours.${index}.close`);
      }
    }
  };

  const hasAvailableDays =
    DAYS_OF_WEEK.some((day) => !selectedDays[day]) || fields.length === 0;

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <FormLabel className="text-xl font-semibold">Opening Hours</FormLabel>
          <FormDescription>
            Specify the days and hours your business is open.
          </FormDescription>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={addOpenHours}
          disabled={!hasAvailableDays || fields.length >= 7}
          className="flex items-center gap-1"
        >
          <IconPlus className="h-4 w-4" />
          <span>Add Hours</span>
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-muted-foreground rounded bg-gray-50/50 px-4 py-8 text-center">
          No opening hours specified. Click "Add Hours" to add your business
          hours.
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="overflow-hidden rounded bg-gray-50/50 px-4 py-8"
            >
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
                {/* Day Selection */}
                <FormField
                  control={form.control}
                  name={`open_hours.${index}.day`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Day</FormLabel>
                      <Select
                        onValueChange={(value) => handleDayChange(value, index)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day) => {
                            const isDisabled =
                              selectedDays[day] && field.value !== day;
                            return (
                              <SelectItem
                                key={day}
                                value={day}
                                disabled={isDisabled}
                              >
                                {day}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Opening Time */}
                <FormField
                  control={form.control}
                  name={`open_hours.${index}.open`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Opening Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="09:00"
                          className="text-sm"
                          value={field.value}
                          onChange={(e) =>
                            handleTimeChange(e.target.value, index, "open")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Closing Time */}
                <FormField
                  control={form.control}
                  name={`open_hours.${index}.close`}
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Closing Time</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="17:00"
                            className="text-sm"
                            value={field.value}
                            onChange={(e) =>
                              handleTimeChange(e.target.value, index, "close")
                            }
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive/90 h-9 w-9"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {form.formState.errors.open_hours?.message && (
        <div className="text-destructive mt-2 text-sm">
          {form.formState.errors.open_hours.message.toString()}
        </div>
      )}
    </div>
  );
}
