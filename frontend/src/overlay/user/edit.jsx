import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

/**
 * @typedef {Object} AccountSettingsOverlayProps
 * @property {boolean} [editMode]
 */

/**
 * @param {AccountSettingsOverlayProps} props
 * @returns {JSX.Element}
 */
function AccountSettingsOverlay({ editMode = false }) {
  return <div></div>;
}

const useAccountSettingsOverlay = createModalHook(
  AccountSettingsOverlay,
  "user-edit",
  ({ editMode }) => (editMode ? "Edit User" : "Account Settings"),
  <Fragment>
    After making changes or edits, be sure to save.{" "}
    <span className="text-red-500">*Required fields.</span>
  </Fragment>,
);

export {
  useAccountSettingsOverlay,
  AccountSettingsOverlay,
  useAccountSettingsOverlay as useUserEditOverlay,
  AccountSettingsOverlay as UserEditOverlay,
};
