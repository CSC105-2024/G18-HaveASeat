import React, { Fragment } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function UserEditOverlay() {
  return <div></div>;
}

const useUserEditOverlay = createModalHook(
  UserEditOverlay,
  "user-edit",
  "Edit User",
  <Fragment>
    After making changes or edits, be sure to save.{" "}
    <span className="text-red-500">*Required fields.</span>
  </Fragment>,
);

export {
  useUserEditOverlay,
  UserEditOverlay,
};
