import { NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu.jsx";
import { cn } from "@/lib/utils.js";
import { IconPicnicTable } from "@tabler/icons-react";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter, SidebarGroup,
  SidebarHeader, SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar.jsx";
import { Navigation } from "@/components/navigation/index.jsx";
import { Button } from "@/components/ui/button.jsx";

import {
  Frame,
  LifeBuoy,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  Send,
} from "lucide-react"

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col justify-between gap-8 w-full">
      <section data-layout="content" className="flex flex-col gap-8">
        <header className="flex flex-row items-center justify-between gap-4 bg-zinc-900 px-4 py-4 text-white">
          <NavLink to="/" className="flex flex-row items-center justify-start gap-4 flex-2/12">
            <IconPicnicTable className="size-12" />
            <div>
              <h1 className="font-semibold">Have A Seat</h1>
              <span className="text-xs font-noto-sans-thai">Book It. Sip It. Love It.</span>
            </div>
          </NavLink>
          <Navigation />
          <div className="flex-2/12 flex flex-row justify-end gap-4">
            Profile Here
            <SidebarTrigger className="flex md:hidden" />
          </div>

        </header>
        <main className="px-4">{children}</main>
      </section>
      <footer className="bg-zinc-900 px-4 py-4 text-center text-white">
        <p className="font-semibold">Have A Seat</p>
        <span className="text-xs font-noto-sans-thai">
          Book It. Sip It. Love It. © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

export default Layout;