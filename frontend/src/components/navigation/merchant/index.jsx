import React from "react";
import {
  IconCalendarCog,
  IconChevronsLeft,
  IconClipboard,
  IconLayoutDashboard,
  IconPhotoCog,
  IconWorldCog
} from "@tabler/icons-react";
import { MerchantSidebar } from "./sidebar.jsx";
import { MerchantSheet } from "./sheet.jsx";

/**
 * @type MenuEntry[]
 */
const uncategorizedMenu = [
  {
    pathname: "/merchant/%id%",
    icon: IconChevronsLeft,
    title: "Back to My Merchant",
  },
];

/**
 * @type MenuEntry[]
 */
const reservationsMenu = [
  {
    pathname: "/merchant/%id%/dashboard",
    icon: IconLayoutDashboard,
    title: "Dashboard",
  },
  {
    pathname: "/merchant/%id%/reservations",
    icon: IconClipboard,
    title: "Reservations List",
  },
];

/**
 * @type MenuEntry[]
 */
const settingsMenu = [
  {
    pathname: "/merchant/%id%/settings/overview",
    icon: IconWorldCog,
    title: "Overview",
  },
  {
    pathname: "/merchant/%id%/settings/display",
    icon: IconPhotoCog,
    title: "Display & Images",
  },
  {
    pathname: "/merchant/%id%/settings/reservation",
    icon: IconCalendarCog,
    title: "Reservation & Zones",
  },
];

function MerchantNavigation({ merchantId }) {
  /**
   * @type {MenuEntry[]}
   */
  const merchantUncategorizedMenu = uncategorizedMenu.map((item) => ({
    ...item,
    pathname: item.pathname.replace("%id%", merchantId),
  }));

  /**
   * @type {MenuEntry[]}
   */
  const merchantReservationsMenu = reservationsMenu.map((item) => ({
    ...item,
    pathname: item.pathname.replace("%id%", merchantId),
  }));

  /**
   * @type {MenuEntry[]}
   */
  const merchantSettingsMenu = settingsMenu.map((item) => ({
    ...item,
    pathname: item.pathname.replace("%id%", merchantId),
  }));

  return (
    <React.Fragment>
      <MerchantSheet
        uncategorizedMenu={merchantUncategorizedMenu}
        reservationsMenu={merchantReservationsMenu}
        settingsMenu={merchantSettingsMenu}
      />
      <MerchantSidebar
        uncategorizedMenu={merchantUncategorizedMenu}
        reservationsMenu={merchantReservationsMenu}
        settingsMenu={merchantSettingsMenu}
      />
    </React.Fragment>
  );
}

export { MerchantNavigation };
