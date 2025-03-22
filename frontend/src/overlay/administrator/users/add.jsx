import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function UserAddOverlay(props) {
  return (
    <div></div>
  );
}

const useUserAddOverlay = createModalHook(
  UserAddOverlay,
  'user-add',
  'User Add',
  '',
);

export { useUserAddOverlay };