import React from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils.js";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import { IconLogout } from "@tabler/icons-react";
import { useSignOutOverlay } from "@/overlay/user/authentication.jsx";

/**
 * @param {MenuEntry[]} managementMenu
 * @returns {Element}
 * @constructor
 */
function AdministratorSidebar({ managementMenu = [] }) {
  return (
    <div className="hidden md:block">
      <div className="px-3 py-4">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Management
        </h2>
        <div className="space-y-1">
          {managementMenu.map((item, index) => (
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

export {AdministratorSidebar};