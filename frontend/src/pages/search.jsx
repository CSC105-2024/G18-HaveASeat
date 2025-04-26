import React from "react";
import { VenueCard } from "@/components/reservation/venue.jsx";
import { ReservationSiteHero } from "@/components/reservation/site.jsx";
import { Badge } from "@/components/ui/badge.jsx";

function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <ReservationSiteHero />

      <section className="px-6 py-6">
        <h2 className="mb-4 inline-flex items-center gap-4 text-xl font-semibold">
          Search Results
          <Badge variant="secondary">12 Results</Badge>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            {
              name: "Indy Bar Bangmot",
              image:
                "https://i.pinimg.com/736x/67/86/94/67869432930f288a4f31328f20793cc8.jpg",
              location: "Bang Mot",
              rating: 4.8,
              favorite: true,
            },
            {
              name: "The Iron Fairies",
              image:
                "https://i.pinimg.com/736x/cc/c7/51/ccc751f538b11b8754aab71541380f61.jpg",
              location: "Thonglor",
              rating: 4.7,
              favorite: true,
            },
            {
              name: "Tep Bar",
              image:
                "https://i.pinimg.com/736x/e0/57/2e/e0572ef05c1b65db4f9d15856fbab25c.jpg",
              location: "Phra Nakhon",
              rating: 4.7,
              favorite: true,
            },
            {
              name: "Rabbit Hole",
              image:
                "https://i.pinimg.com/736x/76/3b/16/763b169502915df85c8b210177ae5db9.jpg",
              location: "Thonglor",
              rating: 4.9,
              favorite: true,
            },
            {
              name: "Smalls",
              image:
                "https://i.pinimg.com/736x/fc/d0/4f/fcd04f2e706b457b512491dc7eef2fba.jpg",
              location: "Sukhumvit",
              rating: 4.9,
              favorite: true,
            },
            {
              name: "Havana Social",
              image:
                "https://i.pinimg.com/736x/20/f7/1f/20f71f0e17d11e6875c53d05a14d3695.jpg",
              location: "Sathon",
              rating: 4.8,
              favorite: true,
            },
            {
              name: "Sing Sing Theater",
              image:
                "https://i.pinimg.com/736x/1f/22/57/1f22578a1062fab1bc0047b5b1fcc51b.jpg",
              location: "Sukhumvit",
              rating: 4.7,
              favorite: true,
            },
            {
              name: "Jazz Happens",
              image:
                "https://i.pinimg.com/736x/f1/86/d0/f186d03e84f1be3acad2f4932b479fb3.jpg",
              location: "Ekkamai",
              rating: 4.6,
              favorite: true,
            },
            {
              name: "Tropic City",
              image:
                "https://i.pinimg.com/736x/a7/3c/65/a73c652a267eb2118211fa56dffe3c07.jpg",
              location: "Bang Rak",
              rating: 4.5,
              favorite: true,
            },
            {
              name: "Teens of Thailand",
              image:
                "https://i.pinimg.com/736x/68/71/da/6871da03a6f8ae746957a9300c4d0b9d.jpg",
              location: "Phra Nakhon",
              rating: 4.0,
              favorite: true,
            },
            {
              name: "Vesper",
              image:
                "https://i.pinimg.com/736x/8c/19/ee/8c19ee9fe8483488671e8ec906a77767.jpg",
              location: "Sathon",
              rating: 3.9,
              favorite: true,
            },
            {
              name: "Octave Rooftop",
              image:
                "https://i.pinimg.com/736x/31/bd/e3/31bde3f144d7660c3dd5a2e803a75a6a.jpg",
              location: "Sukhumvit",
              rating: 0.0,
              favorite: false,
            },
          ].map((venue, i) => (
            <VenueCard
              key={i}
              image={venue.image}
              name={venue.name}
              location={venue.location}
              rating={venue.rating}
              favorite={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Page;
