import { useSignOutOverlay } from "@/overlay/user/authentication.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { NavLink } from "react-router";
import {
  IconAdjustmentsAlt, IconBasketCog, IconBuildingStore, IconClipboard,
  IconDeviceIpadQuestion,
  IconHeartStar,
  IconHistory, IconLayoutDashboard,
  IconLogout
} from "@tabler/icons-react";
import React from "react";

const user = {
  name: "Demo",
  email: "demo@example.com"
};

const profileNavigation = [
  {
    pathname: "/account/reservations",
    icon: IconHistory,
    title: "Reservations"
  },
  {
    pathname: "/account/favourite",
    icon: IconHeartStar,
    title: "Favourite"
  },
  {
    pathname: "/account",
    icon: IconAdjustmentsAlt,
    title: "Account Settings"
  }
];

const merchantNavigation = [
  {
    pathname: "/merchant/%id%",
    icon: IconBuildingStore,
    title: "My Merchant"
  },
  {
    pathname: "/merchant/%id%/reservations",
    icon: IconClipboard,
    title: "Reservation Lists"
  },
  {
    pathname: "/merchant/%id%/settings",
    icon: IconBasketCog,
    title: "Merchant Settings"
  }
];

function NavigationProfile() {
  const { open: openSignOutOverlay } = useSignOutOverlay();

  {/*//TODO: To Replace with actual data */}
  const {id: merchantId} = {
    id: "c7f7c67b-983d-48eb-a31c-abedef613777"
  }

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
          {profileNavigation.map((item) => (
            <DropdownMenuItem
              key={item.pathname}
              className="hover:cursor-pointer"
              asChild
            >
              <NavLink to={item.pathname} className="flex items-center">
                <item.icon className="text-muted-foreground size-4" />
                {item.title}
              </NavLink>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {/*//TODO: To Check role */}
        <DropdownMenuSeparator />
        {merchantNavigation.map((item) => (
          <DropdownMenuItem
            key={item.pathname}
            className="hover:cursor-pointer"
            asChild
          >
            <NavLink to={item.pathname.replace("%id%", merchantId)} className="flex items-center">
              <item.icon className="text-muted-foreground size-4" />
              {item.title}
            </NavLink>
          </DropdownMenuItem>
        ))}
        {/*//TODO: To Check role */}
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <NavLink to="/administrator" className="flex items-center">
            <IconLayoutDashboard className="text-muted-foreground size-4" />
            Dashboard
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 hover:cursor-pointer hover:text-red-600"
          onClick={openSignOutOverlay}
        >
          <IconLogout className="size-4 text-red-500 hover:text-red-600" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { NavigationProfile };