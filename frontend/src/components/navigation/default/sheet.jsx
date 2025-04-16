import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar.jsx";
import { IconPicnicTable, IconSquareRoundedX } from "@tabler/icons-react";
import { NavLink, useLocation } from "react-router";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";

/**
 * @param {MenuEntry[]} items
 */
function NavigationSheet({ items = [] }) {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar side="left" variant="sidebar">
      <SidebarHeader>
        <NavLink to="/" className="flex flex-col">
          <h1 className="font-semibold">Have A Seat</h1>
          <span className="font-noto-sans-thai text-xs">
            Book It. Sip It. Love It.
          </span>
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.pathname}>
                <SidebarMenuButton
                  className={cn(
                    item.pathname === location.pathname ||
                      item.pathname + "/" === location.pathname
                      ? "bg-gray-100"
                      : null,
                  )}
                  asChild
                >
                  <a href={item.pathname}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={toggleSidebar}>
          <IconSquareRoundedX className="size-4" />
          Close
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export { NavigationSheet };
