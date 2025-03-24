import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { useNavigate } from "react-router";
import { useSignInOverlay, useSignOutOverlay } from "@/overlay/user/authentication.jsx";
import { useSignUpOverlay } from "@/overlay/user/add.jsx";
import { useForgetPasswordOverlay } from "@/overlay/user/forget-password.jsx";
import { useUserAddOverlay } from "@/overlay/user/add.jsx";
import { useUserEditOverlay } from "@/overlay/user/edit.jsx";
import { useUserDeleteOverlay } from "@/overlay/user/delete.jsx";
import { useReportIgnoreOverlay } from "@/overlay/report/ignore.jsx";
import { useReportDeleteOverlay } from "@/overlay/report/delete.jsx";
import { useReservationAddOverlay } from "@/overlay/reservation/add.jsx";
import { useReservationMarkAsCompleteOverlay } from "@/overlay/reservation/mark-as-complete.jsx";
import { useReservationCancelOverlay } from "@/overlay/reservation/cancel.jsx";
import { useReviewAddOverlay } from "@/overlay/review/add.jsx";
import { useReviewReportOverlay } from "@/overlay/review/report.jsx";
import { useReviewDeleteOverlay } from "@/overlay/review/delete.jsx";
import { useBarPromotionImagesOverlay } from "@/overlay/merchant/images.jsx";
import { useAccountSettingsOverlay } from "@/overlay/user/edit.jsx";

function Experimental() {
  const navigate = useNavigate();

  // Authentication
  const {open: openSignInOverlay} = useSignInOverlay();
  const {open: openSignUpOverlay} = useSignUpOverlay();
  const {open: openForgetPasswordOverlay} = useForgetPasswordOverlay();
  const {open: openSignOutOverlay} = useSignOutOverlay();

  // Administrator
  const {open: openUserAddOverlay} = useUserAddOverlay();
  const {open: openUserEditOverlay} = useUserEditOverlay();
  const {open: openUserDeleteOverlay} = useUserDeleteOverlay();

  const {open: openReportIgnoreOverlay} = useReportIgnoreOverlay();
  const {open: openReportDeleteOverlay} = useReportDeleteOverlay();

  // Merchant
  const {open: openBarPromotionImagesOverlay} = useBarPromotionImagesOverlay();

  // Account
  const {open: openAccountSettingsOverlay} = useAccountSettingsOverlay();

  // Reservations
  const {open: openReservationAddOverlay} = useReservationAddOverlay();
  const {open: openReservationMarkAsCompleteOverlay} = useReservationMarkAsCompleteOverlay();
  const {open: openReservationCancelOverlay} = useReservationCancelOverlay();

  // Reviews
  const {open: openReviewAddOverlay} = useReviewAddOverlay();
  const {open: openReviewReportOverlay} = useReviewReportOverlay();
  const {open: openReviewDeleteOverlay} = useReviewDeleteOverlay();

  return (
    <div className="flex flex-col gap-8">
      <ExperimentalSection title="Authentication">
        <div className="space-x-2">
          <Button onClick={() => openSignUpOverlay({})}>Sign up</Button>
          <Button onClick={openSignInOverlay} variant="secondary">Sign in</Button>
          <Button onClick={openForgetPasswordOverlay} variant="outline">Forget Password</Button>
          <Button onClick={openSignOutOverlay} variant="destructive">Sign out</Button>
        </div>
      </ExperimentalSection>
      <ExperimentalSection title="Administrator">
        <div className="space-x-2">
          <Button onClick={() => openUserAddOverlay({addMode: true})}>Add User</Button>
          <Button onClick={() => openUserEditOverlay({editMode: true})} variant="secondary">Edit User</Button>
          <Button onClick={openUserDeleteOverlay} variant="destructive">Delete User</Button>
        </div>
        <div className="space-x-2">
          <Button onClick={openReportIgnoreOverlay} variant="secondary">Ignore Report</Button>
          <Button onClick={openReportDeleteOverlay} variant="destructive">Delete Report</Button>
        </div>
      </ExperimentalSection>
      <ExperimentalSection title="Merchants">
        <div className="space-x-2">
          <Button onClick={() => openReservationAddOverlay({isManual: true})}>Reservation Add</Button>
          <Button onClick={openReservationMarkAsCompleteOverlay} variant="secondary">Reservation Mark As Completed</Button>
          <Button onClick={openReservationCancelOverlay} variant="destructive">Reservation Cancel</Button>
        </div>
        <div className="space-x-2">
          <Button onClick={() => openReviewAddOverlay({isReply: true})}>Review Reply</Button>
          <Button onClick={openReviewReportOverlay} variant="secondary">Review Report</Button>
          <Button onClick={openReviewDeleteOverlay} variant="destructive">Review Delete</Button>
        </div>
        <div className="space-x-2">
          <Button onClick={openBarPromotionImagesOverlay}>Promotion Images</Button>
        </div>
      </ExperimentalSection>
      <ExperimentalSection title="User">
        <div className="space-x-2">
          <Button onClick={() => openAccountSettingsOverlay({})}>Account Settings</Button>
        </div>
        <div className="space-x-2">
          <Button onClick={() => openReservationAddOverlay({isManual: false})}>Reservation Make</Button>
          <Button onClick={openReservationCancelOverlay} variant="destructive">Reservation Cancel</Button>
        </div>
        <div className="space-x-2">
          <Button onClick={() => openReviewAddOverlay({isReply: false})}>Review Leave</Button>
          <Button onClick={openReviewReportOverlay} variant="secondary">Review Report</Button>
          <Button onClick={openReviewDeleteOverlay} variant="destructive">Review Delete</Button>
        </div>
      </ExperimentalSection>
    </div>
  );
}

export default Experimental;

/**
 * @param {Object} props - The component props.
 * @param {string} props.title - The title displayed at the top of the section.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the section.
 * @returns {React.JSX.Element} The rendered ExperimentalSection component.
 **/
function ExperimentalSection({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
