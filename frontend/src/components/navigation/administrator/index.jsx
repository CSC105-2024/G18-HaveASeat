import React from "react";
import {
  IconCalendarCog,
  IconClipboard,
  IconFlag3,
  IconPhotoCog,
  IconUsersGroup,
  IconWorldCog
} from "@tabler/icons-react";
import { AdministratorSidebar } from "./sidebar.jsx";
import { AdministratorSheet } from "./sheet.jsx";

/**
 * @type MenuEntry[]
 */
const managementMenu = [
  {
    pathname: "/administrator/users",
    icon: IconUsersGroup,
    title: "Users Management",
  },
  {
    pathname: "/administrator/report",
    icon: IconFlag3,
    title: "Reports Management",
  }
];

function AdministratorNavigation() {
  return (
    <React.Fragment>
      <AdministratorSheet
        managementMenu={managementMenu}
      />
      <AdministratorSidebar
        managementMenu={managementMenu}
      />
    </React.Fragment>
  );
}

export { AdministratorNavigation, managementMenu };
