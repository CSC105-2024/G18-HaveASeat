import * as React from "react";
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp } from "@tabler/icons-react";
import { Chevron, DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

/**
 * @param {import("react-day-picker").DayPickerProps} props
 * @returns {JSX.Element}
 */
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row space-y-4 sm:space-y-0",
        month: "space-y-4 w-full",
        nav: "flex items-center justify-between absolute w-full z-10 px-1",
        button_previous: cn(
          buttonVariants({
            variant: "outline",
            className:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          }),
        ),
        button_next: cn(
          buttonVariants({
            variant: "outline",
            className:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          }),
        ),
        month_caption: "flex justify-center items-center h-7",
        caption_label: "text-sm font-medium",
        month_grid: "border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground w-9 font-normal text-xs",
        weeks: "",
        week: "flex mt-2",
        day: "p-0",
        outside: "bg-accent/40",
        range_middle: "bg-accent last:rounded-e-md first:rounded-s-md",
        range_start: "bg-accent rounded-s-md",
        range_end: "bg-accent rounded-e-md",
        ...classNames,
      }}
      components={{
        DayButton({ day, modifiers, className, ...buttonProps }) {
          return (
            <Button
              variant={"ghost"}
              className={cn(
                className,
                "h-9 w-9 p-0 font-normal",
                modifiers?.today && "bg-accent text-accent-foreground",
                modifiers?.selected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                modifiers?.outside &&
                  "text-muted-foreground pointer-events-none opacity-50",
                modifiers?.disabled && "text-muted-foreground opacity-50",
                modifiers?.hidden && "invisible",
                modifiers.range_middle &&
                  "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground rounded-none first:rounded-s-md last:rounded-e-md",
                modifiers.outside &&
                  modifiers.selected &&
                  "bg-accent/40 text-muted-foreground",
              )}
              {...buttonProps}
              aria-selected={modifiers.selected || buttonProps["aria-selected"]}
              aria-disabled={modifiers.disabled || buttonProps["aria-disabled"]}
              aria-hidden={modifiers.hidden || buttonProps["aria-hidden"]}
            />
          );
        },
        Chevron: (props) => {
          switch (props.orientation) {
            case "left":
              return <IconChevronLeft {...props} className="h-4 w-4" />;
            case "right":
              return <IconChevronRight {...props} className="h-4 w-4" />;
            case "up":
              return <IconChevronUp {...props} className="h-4 w-4" />;
            case "down":
              return <IconChevronDown {...props} className="h-4 w-4" />;
            default:
              return <Chevron {...props} className="h-4 w-4" />;
          }
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
