import React from "react";
import { createModalHook } from "@/hooks/use-modal.jsx";

function BarPromotionImagesOverlay() {
  return (
    <div></div>
  );
}

const useBarPromotionImagesOverlay = createModalHook(
  BarPromotionImagesOverlay,
  'bar-promotion',
  'Bar Images',
  '',
);

export { useBarPromotionImagesOverlay, BarPromotionImagesOverlay };