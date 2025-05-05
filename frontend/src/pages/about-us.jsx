import { Button } from "@/components/ui/button";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


function Page(props) {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero Banner Section */}
      <section
        className="relative z-1 mx-auto h-[24svh] lg:h-[32svh] overflow-hidden rounded-3xl bg-(image:--background-banner-primary) bg-cover bg-center bg-no-repeat shadow-lg">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-4 text-center backdrop-blur-md">
          <h1 className="mb-2 text-xl lg:text-4xl font-bold text-white">
            Get to Know <span className="text-yellow-400">Have a Seat</span> Better
          </h1>
          <p className="text-base text-white">
            Get to know who we are and what we’re all about.
          </p>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-8 text-center px-6  max-w-prose text-balance mx-auto">
        <p className="text-lg leading-relaxed">
          Welcome to our website, where you can find your go-to destination for booking the best bars in town!
          Whether you're planning a casual night out, a birthday celebration, or a private event,
          we make it easy to find and reserve the perfect spot.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Our goal is to take the stress out of planning and give you more time to enjoy.
          We partner with top bars to bring you exclusive deals, instant booking, and a seamless
          experience from start to cheers.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          At <strong>Take A Seat</strong>, we believe great nights start with great places.
          So explore, book, and let the good times roll.
        </p>
        <p className="text-lg leading-relaxed mt-4 font-semibold">
          Cheers to better nights out!
        </p>
      </section>
    </div>
  );
}

export default Page;