import React, { useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { IconStar } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

/**
 * @typedef {Object} ReviewAddOverlayProps
 * @property {boolean} [isReply]
 */

/**
 * @param {ReviewAddOverlayProps} props
 * @returns {JSX.Element}
 */
function ReviewAddOverlay({ isReply = false }) {
  const [rating, setRating] = useState(0);

  if (isReply) {
    return (
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-auto shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Reply to a Review</h1>

        <div className="mb-4">
          <h2 className="text-lg mb-2">Reply to: </h2>
          <textarea
            className="w-full mt-2 p-4 bg-gray-100 rounded-xl resize-none min-h-[120px]"
            placeholder="Write your reply to the review here..."
          />
        </div>

        <div className="flex justify-between gap-4">
          <Button className="flex-1">Send Reply</Button>
          <Button variant="secondary" className="flex-1">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-5xl mx-auto shadow-lg">
      <h1 className="text-4xl font-bold mb-4">Dummy Bar</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Rating</h2>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <IconStar
              key={num}
              onClick={() => setRating(num)}
              className={`w-6 h-6 cursor-pointer transition-colors duration-150 ${
                num <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Description <span className="text-gray-500 text-sm">(2,500 Characters)</span>
        </h2>
        <textarea
          className="w-full mt-2 p-4 bg-gray-100 rounded-xl resize-none min-h-[150px]"
          placeholder="Describe what’s your experience of this bar like?"
        />
      </div>

      <div className="flex justify-between gap-4">
        <Button className="flex-1">Submit Review</Button>
        <Button variant="secondary" className="flex-1">Close</Button>
      </div>
    </div>
  );
}

const useReviewAddOverlay = createModalHook(
  ReviewAddOverlay,
  'review-add',
  ({isReply}) => isReply ? 'Reply Review' : 'Leave A Review',
  ({isReply}) => isReply ? 'This is the best way to interact with your customers' : 'Tell us more about this place!',
);

export { useReviewAddOverlay, ReviewAddOverlay };