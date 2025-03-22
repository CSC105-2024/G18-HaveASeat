import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup, SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar.jsx";
import { IconPicnicTable, IconSquareRoundedX } from "@tabler/icons-react";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button.jsx";

/**
 * @param {MenuItem[]} items
 */
function SidebarNavigation({ items }) {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar side="left" variant="sidebar">
      <SidebarHeader>
        <NavLink to="/" className="flex flex-col">
            <h1 className="font-semibold">Have A Seat</h1>
            <span className="text-xs font-noto-sans-thai">Book It. Sip It. Love It.</span>
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
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
export { SidebarNavigation };