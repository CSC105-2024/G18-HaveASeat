import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function ForgetPasswordOverlay(props) {
  return (
    <div></div>
  );
}

const useForgetPasswordOverlay = createModalHook(
  ForgetPasswordOverlay,
  'forget-password',
  'Forget Password',
  '',
);

export { useForgetPasswordOverlay };