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
    <div className="bg-white text-black">
      {/* Hero Banner Section */}
      <section
        className="relative w-full h-[300px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(https://i.pinimg.com/736x/a5/9e/5a/a59e5a03148fb899661ad2b1639f54d8.jpg)"
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
          <h1 className="text-white text-5xl font-bold text-center px-4">
            Have A Seat
          </h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 text-center px-6 max-w-4xl mx-auto">
        <p className="text-lg text-gray-700 leading-relaxed">
          Welcome to our website, where you can find your go-to destination for booking the best bars in town!
          Whether you're planning a casual night out, a birthday celebration, or a private event,
          we make it easy to find and reserve the perfect spot.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mt-4">
          Our goal is to take the stress out of planning and give you more time to enjoy.
          We partner with top bars to bring you exclusive deals, instant booking, and a seamless
          experience from start to cheers.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mt-4">
          At <strong>Take A Seat</strong>, we believe great nights start with great places.
          So explore, book, and let the good times roll.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mt-4 font-semibold">
          Cheers to better nights out!
        </p>
      </section>
    </div>
  );
}

export default Page;