import React from "react";
import { IconDeviceIpadQuestion, IconHome, IconLayout2Filled, IconSearch } from "@tabler/icons-react";
import { NavigationBar } from "./navigation.jsx";
import { NavigationSheet } from "./sheet.jsx";

/**
 * @typedef {{pathname: string, icon: React.FC, title: string}} MenuEntry
 */

/**
 * @type {MenuEntry[]}
 * */
const navigationMenu = [
  {
    title: "Home",
    pathname: "/",
    icon: IconHome,
  },
  {
    title: "Search",
    pathname: "/search",
    icon: IconSearch,
  },
  {
    title: "About Us",
    pathname: "/about-us",
    icon: IconLayout2Filled,
  },
];

function Navigation() {
  return (
    <div>
      <NavigationBar items={navigationMenu} />
      <NavigationSheet items={navigationMenu} />
    </div>
  );
}

export { Navigation };
