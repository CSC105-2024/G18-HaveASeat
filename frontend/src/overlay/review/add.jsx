import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

/**
 * @typedef {Object} ReviewAddOverlayProps
 * @property {boolean} [isReply]
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
  ({isReply}) => isReply ? 'Reply Review' : 'Leave A Review',
  ({isReply}) => isReply ? 'This is the best way to interact with your customers' : 'Tell us more about this place!',
);

export { useReviewAddOverlay, ReviewAddOverlay };