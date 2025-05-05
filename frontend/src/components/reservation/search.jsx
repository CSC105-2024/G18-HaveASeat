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
  CommandSeparator,
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
import { format, setHours, setMilliseconds, setMinutes, setSeconds } from "date-fns";
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

const FormSchema = z
  .object({
    name: z.string(),
    date: z.date(),
    provinceId: z.number(),
    locationId: z.number(),
  })
  .partial();

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

  // Parse URL query parameters
  const searchParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(params.entries());
  }, [location.search]);

  // Use values from location.state or query params
  const state = location.state || {};
  const valuesFromState = state.values || {};
  const valuesFromQuery = {
    name: searchParams.name || "",
    date: searchParams.date ? new Date(searchParams.date) : new Date(),
    provinceId: searchParams.provinceId ? parseInt(searchParams.provinceId, 10) : -1,
    locationId: searchParams.locationId ? parseInt(searchParams.locationId, 10) : -1,
  };

  // Merge priority: state > query > fallback
  const defaultValues = {
    name: valuesFromState.name ?? valuesFromQuery.name,
    date: valuesFromState.date ?? valuesFromQuery.date,
    provinceId: valuesFromState.provinceId ?? valuesFromQuery.provinceId,
    locationId: valuesFromState.locationId ?? valuesFromQuery.locationId,
  };

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof formSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const [selectedProvinceId, setSelectedProvinceId] = useState(
    /** @type {string | null} */
    state.selectedProvinceId ?? searchParams.provinceId ?? ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    /** @type {number | null} */
    state.selectedLocation ?? searchParams.locationId
      ? parseInt(searchParams.locationId, 10)
      : null
  );

  const [openProvince, setOpenProvince] = useState(false);
  const [openSubdistrict, setOpenSubdistrict] = useState(false);

  const provinces = [
    ...new Map(
      locationData?.map((item) => [
        item.provinceCode,
        {
          value: item.provinceCode.toString(),
          label: item.provinceNameEn,
        },
      ]),
    ).values(),
  ];

  useEffect(() => {
    if (selectedProvinceId.length < 0 || isNaN(parseInt(selectedProvinceId))) return;
    form.setValue('provinceId', Number(selectedProvinceId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!selectedLocation || !selectedLocation?.value || isNaN(parseInt(selectedLocation?.value))) return;
    form.setValue('locationId', Number(selectedLocation.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  const [groupedSubdistricts, setGroupedSubdistricts] = useState([]);

  useEffect(() => {
    if (selectedProvinceId) {
      const filteredLocations = locationData.filter(
        (item) => item.provinceCode.toString() === selectedProvinceId,
      );

      const districtMap = new Map();

      filteredLocations.forEach((location) => {
        const districtCode = location.districtCode.toString();

        if (!districtMap.has(districtCode)) {
          districtMap.set(districtCode, {
            label: location.districtNameEn,
            value: districtCode,
            items: [],
          });
        }

        districtMap.get(districtCode).items.push({
          label: location.subdistrictNameEn,
          value: location.id.toString(),
          district: location.districtNameEn,
          subdistrict: location.subdistrictNameEn,
          fullItem: location,
        });
      });

      setGroupedSubdistricts(Array.from(districtMap.values()));
      setSelectedLocation(null);
    } else {
      setGroupedSubdistricts([]);
      setSelectedLocation(null);
    }
  }, [selectedProvinceId]);

  const getSelectedProvinceLabel = () => {
    const province = provinces.find((p) => p.value === selectedProvinceId);
    return province ? province.label : "";
  };

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

    const rawValues = form.getValues();

    const serializedValues = {
      ...rawValues,
      date: rawValues.date instanceof Date ? rawValues.date.toISOString() : rawValues.date,
    };

    const queryString = new URLSearchParams(serializedValues).toString();

    navigate(`/search?${queryString}`, {
      replace: location.pathname === '/search',
      state: {
        selectedProvinceId,
        selectedLocation,
        values: rawValues
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
                      placeholder="Type the place name"
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
                                  current.getMinutes()
                                ),
                                current.getSeconds()
                              ),
                              current.getMilliseconds()
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
                    <FormLabel className="max-md:hidden md:invisible font-medium">
                      Time
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="time"
                          {...field}
                          value={format(new Date(field.value), "hh:mm")}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);

                            const updatedDate = setMinutes(
                              setHours(field.value, hours),
                              minutes,
                            );

                            field.onChange(updatedDate);
                          }}
                          className="pl-8 text-sm [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-1 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:z-10"
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
            <label className="font-medium">Location</label>
            {/* Province Selection */}
            <div className="flex w-full flex-1 flex-col gap-2 lg:flex-row">
              <div className="space-y-2">
                <ComboboxWrapper
                  open={openProvince}
                  setOpen={setOpenProvince}
                  title="Select Province"
                >
                  <span className="font-normal">
                    {selectedProvinceId
                      ? getSelectedProvinceLabel()
                      : "Select province..."}
                  </span>

                  <Command className="w-full">
                    <CommandInput placeholder="Search province..." />
                    <CommandList className="max-h-64 overflow-y-auto">
                      <CommandEmpty>No province found.</CommandEmpty>
                      <CommandGroup>
                        {provinces.map((province) => (
                          <CommandItem
                            key={province.value}
                            value={province.value}
                            onSelect={(currentValue) => {
                              setSelectedProvinceId(
                                currentValue === selectedProvinceId
                                  ? ""
                                  : currentValue,
                              );
                              setOpenProvince(false);
                            }}
                          >
                            <IconCheck
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProvinceId === province.value
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
              </div>

              {/* Grouped Subdistricts Selection */}
              <div className="w-full flex-1 space-y-2">
                <ComboboxWrapper
                  open={openSubdistrict}
                  setOpen={setOpenSubdistrict}
                  title="Select Location"
                  disabled={!selectedProvinceId}
                >
                  <span className="font-normal">
                    {selectedLocation
                      ? selectedLocation.subdistrict
                      : "Select location..."}
                  </span>

                  <Command className="w-full">
                    <CommandInput placeholder="Search location..." />
                    <CommandList className="max-h-64 overflow-y-auto">
                      <CommandEmpty>No location found.</CommandEmpty>
                      {groupedSubdistricts.map((group, index) => (
                        <div key={group.value}>
                          {index > 0 && <CommandSeparator />}
                          <CommandGroup heading={group.label}>
                            {group.items.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={`${item.district} ${item.subdistrict}`}
                                onSelect={() => {
                                  setSelectedLocation(item);
                                  setOpenSubdistrict(false);
                                }}
                              >
                                <IconCheck
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedLocation?.value === item.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {item.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </div>
                      ))}
                    </CommandList>
                  </Command>
                </ComboboxWrapper>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit">
          <IconSearch />
          <span className="lg:hidden">Search</span>
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
        <IconSearch className="size-4" />
        Search
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <NavLink to="/search" className="flex flex-col">
            <SheetTitle>Have A Seat</SheetTitle>
            <SheetDescription className="font-noto-sans-thai text-xs">
              Search Navigation
            </SheetDescription>
          </NavLink>
        </SheetHeader>
        <div className="flex h-full flex-1 flex-col px-4">
          <ReservationPlaceSearch className="flex-1 justify-between" />
        </div>
        <SheetFooter className="pt-0">
          <SheetClose asChild>
            <Button variant="secondary">
              <IconSquareRoundedX className="size-4" />
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export { ReservationPlaceSearch, ReservationPlaceSearchSheet };
