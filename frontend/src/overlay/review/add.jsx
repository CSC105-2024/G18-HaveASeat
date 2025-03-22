import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

/**
 * @typedef {Object} ReviewAddOverlayProps
 * @property {boolean | undefined} isReply
 */

/**
 * @param {ReviewAddOverlayProps} props
 * @returns {JSX.Element}
 */
function ReviewAddOverlay({isReply = false}) {
  return (
    <div></div>
  );
}

const useReviewAddOverlay = createModalHook(
  ReviewAddOverlay,
  'review-add',
  'Leave A Review',
  '',
);

export { useReviewAddOverlay, ReviewAddOverlay };