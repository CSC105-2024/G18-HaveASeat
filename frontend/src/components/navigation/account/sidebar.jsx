import React from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils.js";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import { IconLogout } from "@tabler/icons-react";
import { useSignOutOverlay } from "@/overlay/user/authentication.jsx";

/**
 * @param {MenuEntry[]} reservationsMenu
 * @param {MenuEntry[]} accountMenu
 * @returns {Element}
 * @constructor
 */
function AccountSidebar({ reservationsMenu = [], accountMenu = [] }) {
  const { open: openSignOutOverlay } = useSignOutOverlay();

  return (
    <div className="hidden md:block">
      <div className="px-3 py-4">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
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
      <div className="px-3 py-4">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
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
    </div>
  );
}

export { AccountSidebar };
