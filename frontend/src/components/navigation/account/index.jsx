import React from "react";
import { IconAdjustmentsAlt, IconHeartStar, IconHistory, IconShieldLock, IconStar } from "@tabler/icons-react";
import { AccountSheet } from "./sheet.jsx";
import { AccountSidebar } from "./sidebar.jsx";

/**
 * @type MenuEntry[]
 */
const reservationsMenu = [
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
];

/**
 * @type MenuEntry[]
 */
const accountMenu = [
  {
    pathname: "/account",
    icon: IconAdjustmentsAlt,
    title: "Account Settings",
  },
  {
    pathname: "/account/security",
    icon: IconShieldLock,
    title: "Account Security",
  },
];

function AccountNavigation() {
  return (
    <React.Fragment>
      <AccountSheet
        reservationsMenu={reservationsMenu}
        accountMenu={accountMenu}
      />
      <AccountSidebar
        reservationsMenu={reservationsMenu}
        accountMenu={accountMenu}
      />
    </React.Fragment>
  );
}

export { AccountNavigation };
