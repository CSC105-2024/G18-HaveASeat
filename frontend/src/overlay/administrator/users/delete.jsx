import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function UserDeleteOverlay(props) {
  return (
    <div></div>
  );
}

const useUserDeleteOverlay = createModalHook(
  UserDeleteOverlay,
  'user-delete',
  'User Delete',
  '',
);

export { useUserDeleteOverlay };