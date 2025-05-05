import React from "react";
import { ReservationPlaceSearch, ReservationPlaceSearchSheet } from "@/components/reservation/search.jsx";

function ReservationSiteHero() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <div
          className="relative z-1 mx-auto lg:-mb-8 h-[24svh] lg:h-[32svh] overflow-hidden rounded-3xl bg-(image:--background-banner-primary) bg-cover bg-center bg-no-repeat shadow-lg">
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-4 text-center backdrop-blur-md">
            <h1 className="mb-2 text-xl lg:text-4xl font-bold text-white">
              Reserve your table with Have a Seat
            </h1>
            <p className="text-base text-white">
              Discover available tables near you!
            </p>
          </div>
        </div>
        <div
          className="relative z-20 mx-auto mb-6 hidden lg:flex flex-col lg:flex-row w-full max-w-6xl lg:items-end gap-4 rounded-md bg-white px-4 py-4 shadow">
          <ReservationPlaceSearch />
        </div>
      </div>
      <ReservationPlaceSearchSheet />
    </section>
  );
}

export {ReservationSiteHero};