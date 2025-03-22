import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function UserAddOverlay(props) {
  return (
    <div></div>
  );
}

const useUserEditOverlay = createModalHook(
  UserAddOverlay,
  'user-edit',
  'User Edit',
  '',
);

export { useUserEditOverlay };