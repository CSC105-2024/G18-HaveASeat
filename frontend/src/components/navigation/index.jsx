import React from "react";
import { IconHome, IconLayout2Filled, IconSearch } from "@tabler/icons-react";
import NavigationBar from "@/components/navigation/navigation-bar.jsx";
import { SidebarNavigation } from "@/components/navigation/sidebar.jsx";

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
    title: "About Us",
    url: "/about-us",
    icon: IconLayout2Filled,
  },
]

function Navigation() {
  return (
    <div>
      <NavigationBar items={items} />
      <SidebarNavigation items={items} />
    </div>
  );
}

export { Navigation };