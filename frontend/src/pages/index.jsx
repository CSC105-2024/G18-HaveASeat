import React from "react";
import { IconHeart, IconStar } from "@tabler/icons-react";
import { ReservationSiteHero } from "@/components/reservation/site.jsx";
import { VenueCard } from "@/components/reservation/venue.jsx";

function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <ReservationSiteHero />

      {/* Popular Venues */}
      <section className="px-2 md:px-4 lg:px-8 md:py-6">
        <h2 className="mb-4 text-xl font-semibold">Popular Venues</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Bang Mot",
              image:
                "https://i.pinimg.com/736x/67/86/94/67869432930f288a4f31328f20793cc8.jpg",
            },
            {
              name: "Sukhumvit",
              image:
                "https://i.pinimg.com/736x/cc/c7/51/ccc751f538b11b8754aab71541380f61.jpg",
            },
            {
              name: "Bang Rak",
              image:
                "https://i.pinimg.com/736x/e0/57/2e/e0572ef05c1b65db4f9d15856fbab25c.jpg",
            },
            {
              name: "Sathon",
              image:
                "https://i.pinimg.com/736x/76/3b/16/763b169502915df85c8b210177ae5db9.jpg",
            },
            {
              name: "Pathumwan",
              image:
                "https://i.pinimg.com/736x/fc/d0/4f/fcd04f2e706b457b512491dc7eef2fba.jpg",
            },
            {
              name: "Phra Nakhon",
              image:
                "https://i.pinimg.com/736x/20/f7/1f/20f71f0e17d11e6875c53d05a14d3695.jpg",
            },
            {
              name: "Lat Phrao",
              image:
                "https://i.pinimg.com/736x/1f/22/57/1f22578a1062fab1bc0047b5b1fcc51b.jpg",
            },
            {
              name: "Thonglor",
              image:
                "https://i.pinimg.com/736x/f1/86/d0/f186d03e84f1be3acad2f4932b479fb3.jpg",
            },
            {
              name: "Ekkamai",
              image:
                "https://i.pinimg.com/736x/a7/3c/65/a73c652a267eb2118211fa56dffe3c07.jpg",
            },
          ].map((venue, i, arr) => {
            if (i % 3 === 0) {
              return (
                <div key={i} className="flex flex-col gap-4 sm:flex-row">
                  {/* Horizontal 1 item */}
                  <div className="relative aspect-video md:aspect-[3/4] w-full md:max-w-xs overflow-hidden rounded-xl shadow-md">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="h-full w-full object-cover"
                    />
                    <p className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
                      {venue.name}
                    </p>
                  </div>

                  {/* Vertical 2 items */}
                  <div className="flex w-full md:max-w-xs flex-col gap-4 max-md:w-full">
                    {arr[i + 1] && (
                      <div className="relative aspect-video md:aspect-[4/3] w-full overflow-hidden rounded-xl shadow-md">
                        <img
                          src={arr[i + 1].image}
                          alt={arr[i + 1].name}
                          className="h-full w-full object-cover"
                        />
                        <p className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
                          {arr[i + 1].name}
                        </p>
                      </div>
                    )}
                    {arr[i + 2] && (
                      <div className="relative aspect-video md:aspect-[4/3] w-full overflow-hidden rounded-xl shadow-md">
                        <img
                          src={arr[i + 2].image}
                          alt={arr[i + 2].name}
                          className="h-full w-full object-cover"
                        />
                        <p className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
                          {arr[i + 2].name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </section>

      {/* Top-rated Venues */}
      <section className="px-2 md:px-4 lg:px-8 md:py-6">
        <h2 className="mb-4 text-xl font-semibold">
          Top-rated Venues by guests
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            {
              name: "Indy Bar Bangmot",
              image:
                "https://i.pinimg.com/736x/67/86/94/67869432930f288a4f31328f20793cc8.jpg",
              location: "Bang Mot",
              rating: 4.9,
              favorite: 10000,
            },
            {
              name: "The Iron Fairies",
              image:
                "https://i.pinimg.com/736x/cc/c7/51/ccc751f538b11b8754aab71541380f61.jpg",
              location: "Thonglor",
              rating: 4.8,
              favorite: 10000,
            },
            {
              name: "Tep Bar",
              image:
                "https://i.pinimg.com/736x/e0/57/2e/e0572ef05c1b65db4f9d15856fbab25c.jpg",
              location: "Phra Nakhon",
              rating: 4.7,
              favorite: 10000,
            },
            {
              name: "Rabbit Hole",
              image:
                "https://i.pinimg.com/736x/76/3b/16/763b169502915df85c8b210177ae5db9.jpg",
              location: "Thonglor",
              rating: 4.6,
              favorite: 10000,
            },
            {
              name: "Smalls",
              image:
                "https://i.pinimg.com/736x/fc/d0/4f/fcd04f2e706b457b512491dc7eef2fba.jpg",
              location: "Sukhumvit",
              rating: 4.5,
              favorite: 10000,
            },
            {
              name: "Havana Social",
              image:
                "https://i.pinimg.com/736x/20/f7/1f/20f71f0e17d11e6875c53d05a14d3695.jpg",
              location: "Sathon",
              rating: 4.4,
              favorite: 10000,
            },
            {
              name: "Sing Sing Theater",
              image:
                "https://i.pinimg.com/736x/1f/22/57/1f22578a1062fab1bc0047b5b1fcc51b.jpg",
              location: "Sukhumvit",
              rating: 4.3,
              favorite: 10000,
            },
            {
              name: "Jazz Happens",
              image:
                "https://i.pinimg.com/736x/f1/86/d0/f186d03e84f1be3acad2f4932b479fb3.jpg",
              location: "Ekkamai",
              rating: 4.2,
              favorite: 10000,
            },
            {
              name: "Tropic City",
              image:
                "https://i.pinimg.com/736x/a7/3c/65/a73c652a267eb2118211fa56dffe3c07.jpg",
              location: "Bang Rak",
              rating: 4.1,
              favorite: 10000,
            },
            {
              name: "Teens of Thailand",
              image:
                "https://i.pinimg.com/736x/68/71/da/6871da03a6f8ae746957a9300c4d0b9d.jpg",
              location: "Phra Nakhon",
              rating: 4.0,
              favorite: 10000,
            },
            {
              name: "Vesper",
              image:
                "https://i.pinimg.com/736x/8c/19/ee/8c19ee9fe8483488671e8ec906a77767.jpg",
              location: "Sathon",
              rating: 3.9,
              favorite: 10000,
            },
            {
              name: "Octave Rooftop",
              image:
                "https://i.pinimg.com/736x/31/bd/e3/31bde3f144d7660c3dd5a2e803a75a6a.jpg",
              location: "Sukhumvit",
              rating: 3.8,
              favorite: 10000,
            },
          ].map((venue, i) => (
            <VenueCard
              key={i}
              image={venue.image}
              name={venue.name}
              location={venue.location}
              rating={venue.rating}
              favorite={venue.favorite}
            />
          ))}
        </div>
      </section>

      {/* Most Favorite Venues */}
      <section className="px-2 md:px-4 lg:px-8 md:py-6">
        <h2 className="mb-2 text-xl font-semibold">Most Favorite Venues</h2>
        <p className="mb-4 text-sm text-gray-600">
          Explore the venues our guests love the most!
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            {
              name: "Indy Bar Bangmot",
              image:
                "https://i.pinimg.com/736x/67/86/94/67869432930f288a4f31328f20793cc8.jpg",
              location: "Bang Mot",
              rating: "1.2K",
              favorite: true,
            },
            {
              name: "The Iron Fairies",
              image:
                "https://i.pinimg.com/736x/cc/c7/51/ccc751f538b11b8754aab71541380f61.jpg",
              location: "Thonglor",
              rating: "1.3K",
              favorite: true,
            },
            {
              name: "Tep Bar",
              image:
                "https://i.pinimg.com/736x/e0/57/2e/e0572ef05c1b65db4f9d15856fbab25c.jpg",
              location: "Phra Nakhon",
              rating: "1.4K",
              favorite: true,
            },
            {
              name: "Rabbit Hole",
              image:
                "https://i.pinimg.com/736x/76/3b/16/763b169502915df85c8b210177ae5db9.jpg",
              location: "Thonglor",
              rating: "1.5K",
              favorite: true,
            },
            {
              name: "Smalls",
              image:
                "https://i.pinimg.com/736x/fc/d0/4f/fcd04f2e706b457b512491dc7eef2fba.jpg",
              location: "Sukhumvit",
              rating: "1.1K",
              favorite: true,
            },
            {
              name: "Havana Social",
              image:
                "https://i.pinimg.com/736x/20/f7/1f/20f71f0e17d11e6875c53d05a14d3695.jpg",
              location: "Sathon",
              rating: "1.6K",
              favorite: true,
            },
            {
              name: "Sing Sing Theater",
              image:
                "https://i.pinimg.com/736x/1f/22/57/1f22578a1062fab1bc0047b5b1fcc51b.jpg",
              location: "Sukhumvit",
              rating: "1.7K",
              favorite: true,
            },
            {
              name: "Jazz Happens",
              image:
                "https://i.pinimg.com/736x/f1/86/d0/f186d03e84f1be3acad2f4932b479fb3.jpg",
              location: "Ekkamai",
              rating: "1.3K",
              favorite: true,
            },
            {
              name: "Tropic City",
              image:
                "https://i.pinimg.com/736x/a7/3c/65/a73c652a267eb2118211fa56dffe3c07.jpg",
              location: "Bang Rak",
              rating: "1.2K",
              favorite: true,
            },
            {
              name: "Teens of Thailand",
              image:
                "https://i.pinimg.com/736x/68/71/da/6871da03a6f8ae746957a9300c4d0b9d.jpg",
              location: "Phra Nakhon",
              rating: "1.4K",
              favorite: true,
            },
            {
              name: "Vesper",
              image:
                "https://i.pinimg.com/736x/8c/19/ee/8c19ee9fe8483488671e8ec906a77767.jpg",
              location: "Sathon",
              rating: "1.5K",
              favorite: true,
            },
            {
              name: "Octave Rooftop",
              image:
                "https://i.pinimg.com/736x/31/bd/e3/31bde3f144d7660c3dd5a2e803a75a6a.jpg",
              location: "Sukhumvit",
              rating: "1.7K",
              favorite: true,
            },
          ].map((venue, i) => (
            <VenueCard
              key={i}
              image={venue.image}
              name={venue.name}
              location={venue.location}
              rating={venue.rating}
              favorite={venue.favorite}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Page;
