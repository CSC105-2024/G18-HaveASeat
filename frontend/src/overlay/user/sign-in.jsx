import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function SignInOverlay(props) {
  return (
    <div></div>
  );
}

const useSignInOverlay = createModalHook(
  SignInOverlay,
    'sign-in',
    'Sign In',
    '',
);

export { useSignInOverlay };