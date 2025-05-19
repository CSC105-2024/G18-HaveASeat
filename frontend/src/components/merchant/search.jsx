import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import {
  IconCalendar,
  IconCaretUpDownFilled,
  IconCheck,
  IconClock,
  IconSearch,
  IconSquareRoundedX,
} from "@tabler/icons-react";
import locationData from "@/data/geography.json";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils.js";
import { useMediaQuery } from "@/hooks/use-media-query.js";
import {
  format,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar.jsx";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.jsx";
import { NavLink, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  name: z.string().optional(),
  date: z.date(),
  province: z.string().optional(),
  district: z.string().optional(),
});

function ComboboxWrapper({ children, open, setOpen, title, disabled = false }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full flex-1 justify-between"
            disabled={disabled}
          >
            {children[0]}
            <IconCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          {children[1]}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} desc>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          disabled={disabled}
        >
          {children[0]}
          <IconCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{children[1]}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * @param {string} [className]
 * @param {React.ComponentProps<"div">} props
 * @returns {JSX.Element}
 */
function ReservationPlaceSearch({ className, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(params.entries());
  }, [location.search]);

  const state = location.state || {};
  const valuesFromState = state.values || {};
  const valuesFromQuery = {
    name: searchParams.name || "",
    date: searchParams.date ? new Date(searchParams.date) : new Date(),
    province: searchParams.province || "",
    district: searchParams.district || "",
  };

  const defaultValues = {
    name: valuesFromState.name ?? valuesFromQuery.name,
    date: valuesFromState.date ?? valuesFromQuery.date,
    province: valuesFromState.province ?? valuesFromQuery.province,
    district: valuesFromState.district ?? valuesFromQuery.district,
  };

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof FormSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const [selectedProvince, setSelectedProvince] = useState(
    defaultValues.province || "",
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    defaultValues.district || "",
  );
  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (!locationData || !Array.isArray(locationData)) return;

    const provinceMap = new Map();

    locationData.forEach((item) => {
      if (item.provinceCode && item.provinceNameEn) {
        provinceMap.set(item.provinceCode, {
          code: item.provinceCode,
          name: item.provinceNameEn,
        });
      }
    });

    const uniqueProvinces = Array.from(provinceMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((province) => ({
        label: province.name,
        value: province.name,
        code: province.code,
      }));

    setProvinces(uniqueProvinces);
  }, []);

  useEffect(() => {
    if (!locationData || !Array.isArray(locationData) || !selectedProvince) {
      setDistricts([]);
      return;
    }

    const provinceItem = provinces.find((p) => p.label === selectedProvince);
    if (!provinceItem) {
      setDistricts([]);
      return;
    }

    const provinceCode = provinceItem.code;

    const districtMap = new Map();

    locationData.forEach((item) => {
      if (
        item.provinceCode === provinceCode &&
        item.districtCode &&
        item.districtNameEn
      ) {
        districtMap.set(item.districtCode, {
          code: item.districtCode,
          name: item.districtNameEn,
        });
      }
    });

    const uniqueDistricts = Array.from(districtMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((district) => ({
        label: district.name,
        value: district.name,
        code: district.code,
      }));

    setDistricts(uniqueDistricts);
  }, [selectedProvince, provinces]);

  useEffect(() => {
    if (selectedProvince) {
      form.setValue("province", selectedProvince);
    }
    if (selectedDistrict) {
      form.setValue("district", selectedDistrict);
    }
  }, [selectedProvince, selectedDistrict]);

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  function onSubmit(data) {
    const rawValues = form.getValues();

    if (
      selectedProvince &&
      !provinces.find((p) => p.label === selectedProvince)
    ) {
      toast.error("Selected province is invalid.");
      return;
    }

    if (
      selectedDistrict &&
      !districts.find((d) => d.label === selectedDistrict)
    ) {
      toast.error("Selected district is invalid for this province.");
      return;
    }

    const serializedValues = {
      name: rawValues.name || "",
      date:
        rawValues.date instanceof Date
          ? rawValues.date.toISOString()
          : rawValues.date,
      location: rawValues.district || rawValues.province || "",
    };

    Object.keys(serializedValues).forEach(
      (key) => !serializedValues[key] && delete serializedValues[key],
    );

    const queryString = new URLSearchParams(serializedValues).toString();

    navigate(`/search?${queryString}`, {
      replace: location.pathname === "/search",
      state: {
        selectedProvince,
        selectedDistrict,
        values: rawValues,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "flex w-full max-w-6xl flex-col gap-4 lg:flex-row lg:items-end",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-4 lg:flex-1 lg:flex-row lg:items-end">
          {/* Search */}
          <div className="flex flex-1 flex-col items-start space-y-2 text-sm">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium">Search Place</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the merchant name"
                      className="text-sm focus:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator orientation="vertical" className="h-12! max-lg:hidden" />

          <div className="flex flex-1 flex-col items-start space-y-2 text-sm">
            <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row">
              {/* Date Picker */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel className="font-medium">Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full flex-1 justify-start text-left font-normal"
                            id="date"
                          >
                            <IconCalendar className="size-4 text-gray-400" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) return;

                            const current = field.value;

                            const updatedDate = setMilliseconds(
                              setSeconds(
                                setMinutes(
                                  setHours(date, current.getHours()),
                                  current.getMinutes(),
                                ),
                                current.getSeconds(),
                              ),
                              0,
                            );

                            field.onChange(updatedDate);
                          }}
                          autoFocus={true}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Picker */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="font-medium max-md:hidden md:invisible">
                      Time
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="time"
                          {...field}
                          value={format(new Date(field.value), "HH:mm")}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);

                            const updatedDate = setMilliseconds(
                              setMinutes(setHours(field.value, hours), minutes),
                              0,
                            );

                            field.onChange(updatedDate);
                          }}
                          className="pl-8 text-sm [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-1 [&::-webkit-calendar-picker-indicator]:z-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                        <IconClock className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator orientation="vertical" className="h-12! max-lg:hidden" />

          <div className="flex w-full flex-1 flex-col items-start space-y-2 text-sm">
            <div className="flex flex-1 flex-col gap-2 lg:flex-row">
              {/* Province Selection */}
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel className="font-medium">Province</FormLabel>
                    <ComboboxWrapper
                      open={openProvince}
                      setOpen={setOpenProvince}
                      title="Select Province"
                    >
                      <span className="font-normal">
                        {selectedProvince
                          ? selectedProvince
                          : "Select province..."}
                      </span>

                      <Command className="w-full">
                        <CommandInput placeholder="Search province..." />
                        <CommandList className="max-h-64 overflow-y-auto">
                          <CommandEmpty>No province found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => {
                                setSelectedProvince("");
                                setSelectedDistrict("");
                                form.setValue("province", "");
                                form.setValue("district", "");
                                setOpenProvince(false);
                              }}
                            >
                              <IconSquareRoundedX className="mr-2 h-4 w-4" />
                              Clear selection
                            </CommandItem>
                            {provinces.map((province) => (
                              <CommandItem
                                key={province.value}
                                value={province.value}
                                onSelect={(value) => {
                                  setSelectedProvince(value);
                                  setSelectedDistrict("");
                                  form.setValue("district", "");
                                  field.onChange(value);
                                  setOpenProvince(false);
                                }}
                              >
                                <IconCheck
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedProvince === province.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {province.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </ComboboxWrapper>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* District Selection */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel className="font-medium">District</FormLabel>
                    <ComboboxWrapper
                      open={openDistrict}
                      setOpen={setOpenDistrict}
                      title="Select District"
                      disabled={!selectedProvince}
                    >
                      <span className="font-normal">
                        {selectedDistrict
                          ? selectedDistrict
                          : "Select district..."}
                      </span>

                      <Command className="w-full">
                        <CommandInput placeholder="Search district..." />
                        <CommandList className="max-h-64 overflow-y-auto">
                          <CommandEmpty>
                            {selectedProvince
                              ? "No district found."
                              : "Please select a province first."}
                          </CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => {
                                setSelectedDistrict("");
                                form.setValue("district", "");
                                setOpenProvince(false);
                              }}
                            >
                              <IconSquareRoundedX className="mr-2 h-4 w-4" />
                              Clear selection
                            </CommandItem>
                            {districts.map((district) => (
                              <CommandItem
                                key={district.value}
                                value={district.value}
                                onSelect={(value) => {
                                  setSelectedDistrict(value);
                                  field.onChange(value);
                                  setOpenDistrict(false);
                                }}
                              >
                                <IconCheck
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedDistrict === district.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {district.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </ComboboxWrapper>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit">
          <IconSearch className="h-4 w-4" />
          <span>Search</span>
        </Button>
      </form>
    </Form>
  );
}

/**
 * @param {string} [className]
 * @param {React.ComponentProps<"button">} props
 * @returns {JSX.Element}
 */
function ReservationPlaceSearchSheet({ className }) {
  return (
    <Sheet>
      <SheetTrigger
        className={cn(buttonVariants(), "w-full lg:hidden", className)}
      >
        <IconSearch className="mr-2 size-4" />
        Search
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <NavLink to="/search" className="flex flex-col">
            <SheetTitle>Have A Seat</SheetTitle>
            <SheetDescription className="text-xs">
              Search Merchants
            </SheetDescription>
          </NavLink>
        </SheetHeader>
        <div className="flex h-full flex-1 flex-col px-4">
          <ReservationPlaceSearch className="flex-1 justify-between" />
        </div>
        <SheetFooter className="pt-0">
          <SheetClose asChild>
            <Button variant="secondary">
              <IconSquareRoundedX className="mr-2 size-4" />
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export { ReservationPlaceSearch, ReservationPlaceSearchSheet };
