import React from "react";
import { Badge } from "@/components/ui/badge.jsx";
import { IconHeartFilled, IconStarFilled } from "@tabler/icons-react";
import {
  formatNumberCompact,
  formatNumberDecimalPoint,
} from "@/lib/formatter.js";
import { format } from "date-fns";
import { constructAPIUrl } from "@/lib/url.js";

function MerchantBanner({ merchant }) {
  if (!merchant) {
    return null;
  }

  const bannerStyle = merchant.bannerImage
    ? { backgroundImage: `url(${constructAPIUrl(merchant.bannerImage)})` }
    : {};

  const overlayClass = merchant.bannerImage
    ? "relative after:absolute after:inset-0 after:bg-black/50 after:content-['']"
    : "";

  const textClass = merchant.bannerImage ? "text-white z-10" : "";

  return (
    <section
      className={`${overlayClass} relative gap-4 overflow-hidden rounded-lg px-12 py-20 ${merchant.bannerImage ? "bg-black/10 backdrop-blur-sm" : "bg-gray-50"} bg-cover bg-center bg-no-repeat shadow-lg`}
      style={bannerStyle}
    >
      <div
        className={`absolute inset-0 flex flex-col justify-center gap-4 bg-black/10 px-8 backdrop-blur-sm ${textClass}`}
      >
        <h1 className="ml-1 text-3xl font-bold">{merchant.name}</h1>
        <div className="flex flex-row flex-wrap gap-2 text-sm">
          {merchant.createdAt && (
            <Badge variant="default">
              Since {format(new Date(merchant.createdAt), "MMMM yyyy")}
            </Badge>
          )}
          <Badge variant={merchant.bannerImage ? "default" : "secondary"}>
            <IconHeartFilled className="text-red-400" />
            <span className="font-medium">
              {formatNumberCompact(merchant.statistics?.totalFavourites || 0)}
            </span>
          </Badge>
          <Badge variant={merchant.bannerImage ? "default" : "secondary"}>
            <IconStarFilled className="text-yellow-400" />
            <span className="font-medium">
              {formatNumberDecimalPoint(
                merchant.statistics?.averageRating || 0,
              )}
            </span>
          </Badge>
        </div>
      </div>
    </section>
  );
}

export { MerchantBanner };
