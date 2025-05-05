import React from "react";
import { Badge } from "@/components/ui/badge.jsx";
import { IconHeartFilled, IconSettings, IconStarFilled } from "@tabler/icons-react";
import { formatNumberCompact, formatNumberDecimalPoint } from "@/lib/formatter.js";
import { Link } from "react-router";
import { cn } from "@/lib/utils.js";
import { buttonVariants } from "@/components/ui/button.jsx";

function MerchantBanner({merchant, merchantId}) {
  return (
    <section className="relative flex flex-row items-center gap-4 rounded-lg bg-gray-50 px-8 py-16">
      <div className="space-y-2">
        <h1 className="ml-1 text-xl font-semibold">{merchant.name}</h1>
        <div className="flex flex-row flex-wrap gap-2 text-sm">
          <Badge>
            <span className="font-medium">Since</span>{" "}
            {merchant.created_at.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </Badge>
          <Badge variant="secondary">
            <IconHeartFilled className="text-red-400" />
            <span className="font-medium">
                {formatNumberCompact(merchant.favourite)}
              </span>
          </Badge>
          <Badge variant="secondary">
            <IconStarFilled className="text-yellow-400" />
            <span className="font-medium">
                {formatNumberDecimalPoint(merchant.rating)}
              </span>
          </Badge>
          {import.meta.env.DEV && (
            <Badge variant="destructive">
              <span className="font-medium">ID</span> {merchantId}
            </Badge>
          )}
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <Link
          to={`/merchant/${merchantId}/settings`}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "flex w-full items-center justify-center",
          )}
        >
          <IconSettings />
          Settings
        </Link>
      </div>
    </section>
  );
}

export { MerchantBanner };