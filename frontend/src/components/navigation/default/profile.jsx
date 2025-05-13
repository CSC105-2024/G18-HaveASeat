import {
  useSignInOverlay,
  useSignOutOverlay,
} from "@/overlay/user/authentication.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Link, NavLink } from "react-router";
import {
  IconAdjustmentsAlt,
  IconBuildingStore,
  IconCalendarCog,
  IconClipboard,
  IconHeartStar,
  IconHistory,
  IconLayoutDashboard,
  IconLogout,
  IconPhotoCog,
  IconStar,
  IconWorldCog,
} from "@tabler/icons-react";
import React from "react";
import { useAuthStore } from "@/store/auth.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useSignUpOverlay } from "@/overlay/user/add.jsx";
import { useMerchantContext } from "@/providers/merchant.jsx";

const profileNavigation = [
  {
    pathname: "/account/reservations",
    icon: IconHistory,
    title: "Reservations",
  },
  {
    pathname: "/account/favourites",
    icon: IconHeartStar,
    title: "Favourites",
  },
  {
    pathname: "/account/reviews",
    icon: IconStar,
    title: "Reviews",
  },
  {
    pathname: "/account",
    icon: IconAdjustmentsAlt,
    title: "Account Settings",
  },
];

function NavigationProfile() {
  const { open: openSignOutOverlay } = useSignOutOverlay();
  const { open: openSignInOverlay } = useSignInOverlay();
  const { open: openSignUpOverlay } = useSignUpOverlay();

  const { isAuthenticated, user, isLoading } = useAuthStore();
  const {
    merchantId,
    hasCompletedSetup,
    getSetupUrl,
    getDashboardUrl,
    getReservationsUrl,
    hasMerchant,
  } = useMerchantContext();

  if (isLoading) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div>
        <Button onClick={openSignInOverlay}>Sign in</Button>
        <Button onClick={() => openSignUpOverlay({})}>Sign up</Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative mx-0 size-8 rounded-full"
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

        <DropdownMenuGroup>
          {hasMerchant ? (
            <React.Fragment>
              <DropdownMenuLabel>Merchant Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {hasCompletedSetup ? (
                <React.Fragment>
                  <DropdownMenuItem className="hover:cursor-pointer" asChild>
                    <Link to={getDashboardUrl()}>
                      <IconBuildingStore className="text-muted-foreground size-4" />{" "}
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:cursor-pointer" asChild>
                    <Link to={getReservationsUrl()}>
                      <IconClipboard className="text-muted-foreground size-4" />{" "}
                      Reservations List
                    </Link>
                  </DropdownMenuItem>
                </React.Fragment>
              ) : (
                <DropdownMenuItem className="hover:cursor-pointer" asChild>
                  <Link to={getSetupUrl()}>
                    <IconBuildingStore className="text-muted-foreground size-4" />{" "}
                    Complete Setup
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link to={`/merchant/${merchantId}/settings/overview`}>
                  <IconWorldCog className="text-muted-foreground size-4" />{" "}
                  Basic Information
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link to={`/merchant/${merchantId}/settings/display`}>
                  <IconPhotoCog className="text-muted-foreground size-4" />{" "}
                  Display & Images
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link to={`/merchant/${merchantId}/settings/reservation`}>
                  <IconCalendarCog className="text-muted-foreground size-4" />{" "}
                  Reservation & Zones
                </Link>
              </DropdownMenuItem>
            </React.Fragment>
          ) : (
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link to={`/merchant/setup`}>
                <IconBuildingStore className="text-muted-foreground size-4" />
                Become a Merchant
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        {user.isAdmin && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Administrator Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <NavLink to="/administrator" className="flex items-center">
                <IconLayoutDashboard className="text-muted-foreground size-4" />
                Dashboard
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
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
