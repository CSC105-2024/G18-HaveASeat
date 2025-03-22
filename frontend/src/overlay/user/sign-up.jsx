import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function SignUpOverlay() {
  return (
    <div></div>
  );
}

const useSignUpOverlay = createModalHook(
  SignUpOverlay,
  'sign-up',
  'Sign Up',
  '',
);

export { useSignUpOverlay };