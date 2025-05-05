import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import {
  IconCalendar,
  IconCaretUpDownFilled,
  IconCheck,
  IconClock, IconLogout, IconMenu2, IconSearch, IconSquareRoundedX
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
  DrawerContent, DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils.js";
import { useMediaQuery } from "@/hooks/use-media-query.js";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.jsx";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet.jsx";
import { Link, NavLink } from "react-router";

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
            className="w-full justify-between flex-1"
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
function ReservationPlaceSearch({
  className,
  ...props
}) {
  const [date, setDate] = useState(/** @type {Date | undefined} */ new Date());
  const [time, setTime] = useState(/** @type string */ "12:00");

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [openProvince, setOpenProvince] = useState(false);
  const [openSubdistrict, setOpenSubdistrict] = useState(false);

  const provinces = [
    ...new Map(
      locationData.map((item) => [
        item.provinceCode,
        {
          value: item.provinceCode.toString(),
          label: item.provinceNameEn,
        },
      ]),
    ).values(),
  ];

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

  return (
    <div
      className={cn(
        "flex w-full max-w-6xl flex-col gap-4 lg:flex-row lg:items-end",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:flex-1">
        {/* Search */}
        <div className="flex flex-1 flex-col items-start space-y-2 text-sm">
          <label className="font-medium">Search Place</label>
          <Input
            placeholder="Type the place name"
            className="w-full focus:ring-0 text-sm"
          />
        </div>

        <Separator orientation="vertical" className="h-12! max-lg:hidden" />

        <div className="flex flex-1 flex-col items-start space-y-2 text-sm">
          <label className="font-medium">Date & Time</label>
          <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row">
            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex-1 justify-start text-left font-normal"
                  id="date"
                >
                  <IconCalendar className="size-4 text-gray-400" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  autoFocus={true}
                />
              </PopoverContent>
            </Popover>

            {/* Time Picker */}
            <div className="relative w-full flex-1">
              <Input
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="w-full pl-8 text-sm [&::-webkit-calendar-picker-indicator]:hidden"
                id="time"
              />
              <IconClock className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            </div>
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
                                : currentValue
                            );
                            setOpenProvince(false);
                          }}
                        >
                          <IconCheck
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProvinceId === province.value
                                ? "opacity-100"
                                : "opacity-0"
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
                                    : "opacity-0"
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
    </div>
  );
}

/**
 * @param {string} [className]
 * @param {React.ComponentProps<"button">} props
 * @returns {JSX.Element}
 */
function ReservationPlaceSearchSheet({
  className
}) {
 return (
   <Sheet>
     <SheetTrigger className={cn(buttonVariants(), "w-full lg:hidden", className)}>
       <IconSearch className="size-4" />
       Search
     </SheetTrigger>
     <SheetContent>
       <SheetHeader>
         <NavLink to="/search" className="flex flex-col">
           <SheetTitle>Have A Seat</SheetTitle>
           <SheetDescription className="font-noto-sans-thai text-xs">Search Navigation</SheetDescription>
         </NavLink>
       </SheetHeader>
       <div className="px-4 flex flex-col flex-1 h-full">
         <ReservationPlaceSearch className="justify-between flex-1" />
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
 )
}


export { ReservationPlaceSearch, ReservationPlaceSearchSheet };
