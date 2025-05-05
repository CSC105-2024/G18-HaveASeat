import React from "react";
import {
  IconChevronRight, IconHeartFilled,
  IconMapPin,
  IconPhotoCancel,
  IconStarFilled
} from "@tabler/icons-react";
import { formatNumberCompact } from "@/lib/formatter.js";
import { Link } from "react-router";

export const VenueCard = ({ id, image, name, location, rating, favorite }) => {
  return (
    <Link to={`/merchant/${id}`} className="relative overflow-hidden rounded bg-white shadow">
      <div className="relative aspect-video w-full flex items-center justify-center bg-gray-100">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <IconPhotoCancel className="text-gray-400 size-8"/>
        )}
        <div className="absolute top-2 left-2 flex flex-row gap-2">
          <div className="flex items-center justify-center gap-1 rounded bg-white px-2 py-1 text-xs shadow-lg">
            <IconStarFilled size={12} className="inline text-yellow-500" />
            <span className="font-semibold text-black">
              {rating > 0 ? parseFloat(rating).toFixed(1) : "No review yet"}
            </span>
          </div>
          {favorite > 0 && (
            <div className="flex items-center justify-center gap-1 rounded bg-white px-2 py-1 text-xs shadow-lg">
              <IconHeartFilled size={12} className="inline text-red-500" />
              <span className="font-semibold text-black">
                {formatNumberCompact(favorite)}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-between gap-4 px-1.5">
        <div className="p-2">
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-gray-500">
            <IconMapPin className="inline size-3.5" /> {location}
          </p>
        </div>
        <div className="self-center">
          <IconChevronRight className="size-3.5" />
        </div>
      </div>
    </Link>
  );
};