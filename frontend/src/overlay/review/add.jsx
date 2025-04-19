import React, { useState } from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";
import { IconStar } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea.jsx";

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
      <div>
        <div className="mb-4">
          <Textarea
            className="bg-gray-50/50"
            placeholder="Write your reply to the review here..."
          />
        </div>

        <div className="flex justify-between gap-4">
          <Button type="submit" className="flex-1">Reply</Button>
          <Button type="button" variant="secondary" className="flex-1">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center space-x-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <IconStar
            key={num}
            onClick={() => setRating(num)}
            className={`size-8 cursor-pointer transition-colors duration-150 ${
              num <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Description
        </h2>
        <Textarea
          className="bg-gray-50/50"
          placeholder="Describe what’s your experience of this bar like?"
        />
      </div>

      <div className="flex justify-between gap-4">
        <Button type="submit" className="flex-1">Submit</Button>
        <Button type="button" variant="secondary" className="flex-1">Close</Button>
      </div>
    </div>
  );
}

const useReviewAddOverlay = createModalHook(
  ReviewAddOverlay,
  'review-add',
  ({isReply}) => isReply ? 'Reply Review' : 'Review',
  ({isReply}) => isReply ? 'This is the best way to interact with your customers' : 'Tell us more about this place!',
);

export { useReviewAddOverlay, ReviewAddOverlay };