import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu.jsx";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils.js";

/**
 * @param {MenuItem[]} items
 */
function NavigationBar({ items }) {
  return (
    <NavigationMenu className="flex-1 w-full hidden md:flex">
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavLink
              to={item.url}
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

export default NavigationBar;