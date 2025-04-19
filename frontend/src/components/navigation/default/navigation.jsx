import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu.jsx";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils.js";

/**
 * @param {MenuEntry[]} items
 */
function NavigationBar({ items = [] }) {
  return (
    <NavigationMenu className="hidden w-full flex-1 md:flex">
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.pathname}>
            <NavLink
              to={item.pathname}
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent hover:bg-zinc-800 hover:text-white",
              )}
            >
              {item.title}
            </NavLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export { NavigationBar };
