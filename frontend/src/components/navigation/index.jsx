import React from "react";
import {
  IconAdjustmentsAlt,
  IconDeviceIpadQuestion,
  IconHome,
  IconLayout2Filled,
  IconLogout,
  IconSearch
} from "@tabler/icons-react";
import NavigationBar from "@/components/navigation/navigation-bar.jsx";
import { SidebarNavigation } from "@/components/navigation/sidebar.jsx";
import { useSignOutOverlay } from "@/overlay/user/authentication.jsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { NavLink } from "react-router";

/**
 * @typedef {{title: string, url?: string, icon?: React.JSX.Element}} MenuItem
 */

/**
 * @type {MenuItem[]}
 * */
const items = [
  {
    title: "Home",
    url: "/",
    icon: IconHome,
  },
  {
    title: "Search",
    url: "/search",
    icon: IconSearch,
  },
  {
    title: "FAQ",
    url: "/faq",
    icon: IconDeviceIpadQuestion,
  },
  {
    title: "About Us",
    url: "/about-us",
    icon: IconLayout2Filled,
  },
];

function Navigation() {
  return (
    <div>
      <NavigationBar items={items} />
      <SidebarNavigation items={items} />
    </div>
  );
}

const user = {
  name: "Demo",
  email: "demo@example.com",
};

function NavigationProfile() {
  const { open: openSignOutOverlay } = useSignOutOverlay();

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative mx-4 h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-transparent font-semibold text-zinc-900">
                    {user.name?.at(0) ?? "N/A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <NavLink to="/chat" className="flex items-center">
              <IconAdjustmentsAlt className="text-muted-foreground size-4" />
              Account Settings
            </NavLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <NavLink to="/faq" className="flex items-center">
            <IconDeviceIpadQuestion className="text-muted-foreground size-4" />
            FAQ
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 hover:cursor-pointer hover:text-red-600"
          onClick={openSignOutOverlay}
        >
          <IconLogout className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { Navigation, NavigationProfile };
