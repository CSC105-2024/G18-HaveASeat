import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function AccountSettingsOverlay() {
  return (
    <div></div>
  );
}

const useAccountSettingsOverlay = createModalHook(
  AccountSettingsOverlay,
  'account-settings-modal',
  'Account Settings',
  '',
);

export { useAccountSettingsOverlay };