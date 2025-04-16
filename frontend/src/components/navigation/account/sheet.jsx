import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent, SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet.jsx";
import { Link, NavLink } from "react-router";
import { cn } from "@/lib/utils.js";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import { IconLogout, IconMenu2, IconSquareRoundedX } from "@tabler/icons-react";
import { useSignOutOverlay } from "@/overlay/user/authentication.jsx";

/**
 * @param {MenuEntry[]} reservationsMenu
 * @param {MenuEntry[]} accountMenu
 * @returns {Element}
 * @constructor
 */
function AccountSheet({ reservationsMenu = [], accountMenu = []}) {
  const { open: openSignOutOverlay } = useSignOutOverlay();

  return (
    <Sheet>
      <SheetTrigger className={cn(buttonVariants(), "w-full md:hidden")}>
        <IconMenu2 className="size-4" />
        Navigation
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <NavLink to="/" className="flex flex-col">
            <SheetTitle>Have A Seat</SheetTitle>
            <SheetDescription className="font-noto-sans-thai text-xs">Account Navigation</SheetDescription>
          </NavLink>
        </SheetHeader>
        <div className="px-3">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Reservations
          </h2>
          <div className="space-y-1">
            {reservationsMenu.map((item, index) => (
              <Link
                key={index}
                to={item.pathname}
                className={cn(
                  buttonVariants({
                    variant:
                      item.pathname === location.pathname ||
                      item.pathname + "/" === location.pathname
                        ? "secondary"
                        : "ghost",
                  }),
                  "w-full justify-start",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            {accountMenu.map((item) => (
              <Link
                key={item.pathname}
                to={item.pathname}
                className={cn(
                  buttonVariants({
                    variant:
                      item.pathname === location.pathname ||
                      item.pathname + "/" === location.pathname
                        ? "secondary"
                        : "ghost",
                  }),
                  "w-full justify-start",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600"
              onClick={openSignOutOverlay}
            >
              <IconLogout className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>
              <IconSquareRoundedX className="size-4" />
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export { AccountSheet };