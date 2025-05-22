import React from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils.js";
import { buttonVariants } from "@/components/ui/button.jsx";

/**
 * @param {MenuEntry[]} uncategorizedMenu
 * @param {MenuEntry[]} reservationsMenu
 * @param {MenuEntry[]} settingsMenu
 * @returns {Element}
 * @constructor
 */
function MerchantSidebar({
  uncategorizedMenu = [],
  reservationsMenu = [],
  settingsMenu = [],
}) {
  return (
    <div className="hidden md:block">
      {uncategorizedMenu.length > 0 && (
        <div className="px-3 py-4">
          <div className="space-y-1">
            {uncategorizedMenu.map((item, index) => (
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
      )}
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
          Settings
        </h2>
        <div className="space-y-1">
          {settingsMenu.map((item, index) => (
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
    </div>
  );
}

export { MerchantSidebar };
