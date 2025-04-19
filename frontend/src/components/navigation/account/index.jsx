import React from "react";
import {
  IconHeartStar,
  IconHistory,
  IconAdjustmentsAlt, IconShieldLock
} from "@tabler/icons-react";
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
    pathname: "/account/favourite",
    icon: IconHeartStar,
    title: "Favourite",
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
