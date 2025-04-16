import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconHeart, IconStar } from "@tabler/icons-react";

const VenueCard = ({ image, name, location, rating, favorite }) => (
  <div className="relative rounded-xl overflow-hidden shadow bg-white">
    <div className="w-full h-40 relative">
      <img
        src={image || "https://i.pinimg.com/736x/a5/9e/5a/a59e5a03148fb899661ad2b1639f54d8.jpg"}
        alt={name}
        className="object-cover w-full h-full"
      />
      <div className="absolute top-2 left-2 bg-white text-black text-xs font-bold px-2 py-1 rounded">
        {rating ? (
          <span className="flex items-center gap-1">
            <IconStar size={12} className="text-yellow-500" />
            {rating}
          </span>
        ) : (
          "0.0"
        )}
      </div>
      {favorite && (
        <IconHeart
          className="absolute top-2 right-2 text-white fill-white/80"
          size={20}
        />
      )}
    </div>
    <div className="p-2">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">@{location}</p>
    </div>
  </div>
);

function Page() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section
        className="relative w-[95%] max-w-11xl mx-auto h-[460px] bg-cover bg-center bg-no-repeat mb-6 rounded-3xl overflow-hidden shadow-lg"
        style={{ backgroundImage: "url(https://i.pinimg.com/736x/a5/9e/5a/a59e5a03148fb899661ad2b1639f54d8.jpg)", }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="text-white text-4xl font-bold mb-2">
            Reserve your table with Have a Seat
          </h1>
          <p className="text-white mb-4 text-base">
            Discover available tables near you!
          </p>
          <div className="flex items-center bg-gray-100 rounded-3xl px-4 py-2 w-full max-w-3xl shadow-md">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Bar Name"
                className="w-full text-sm rounded-xl bg-gray-200 border-none focus:ring-0"
              />
            </div>
            <div className="h-10 w-px bg-gray-400 mx-4" />

            <div className="flex flex-col items-start text-sm pr-4">
              <span className="font-semibold text-black">Date</span>
              <span className="text-gray-500">Choose date</span>
            </div>

            <div className="h-10 w-px bg-gray-400 mx-4" />

            <div className="flex flex-col items-start text-sm pr-4">
              <span className="font-semibold text-black">Time</span>
              <span className="text-gray-500">Select time</span>
            </div>

            <div className="h-10 w-px bg-gray-400 mx-4" />

            <div className="flex flex-col items-start text-sm relative pr-4">
              <span className="font-semibold text-black">Location</span>
              <span className="text-gray-500">Select location</span>
            </div>

            <Button className="ml-2 bg-black text-white p-2 rounded-xl">
              <span className="text-xl leading-none">➜</span>
            </Button>
          </div>

        </div>
      </section>

      {/* Popular Venues */}
      <section className="px-6 py-6">
        <h2 className="text-xl font-semibold mb-4">Popular Venues</h2>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "Bang Mot", image: "https://i.pinimg.com/736x/67/86/94/67869432930f288a4f31328f20793cc8.jpg" },
            { name: "Sukhumvit", image: "https://i.pinimg.com/736x/cc/c7/51/ccc751f538b11b8754aab71541380f61.jpg" },
            { name: "Bang Rak", image: "https://i.pinimg.com/736x/e0/57/2e/e0572ef05c1b65db4f9d15856fbab25c.jpg" },
            { name: "Sathon", image: "https://i.pinimg.com/736x/76/3b/16/763b169502915df85c8b210177ae5db9.jpg" },
            { name: "Pathumwan", image: "https://i.pinimg.com/736x/fc/d0/4f/fcd04f2e706b457b512491dc7eef2fba.jpg" },
            { name: "Phra Nakhon", image: "https://i.pinimg.com/736x/20/f7/1f/20f71f0e17d11e6875c53d05a14d3695.jpg" },
            { name: "Lat Phrao", image: "https://i.pinimg.com/736x/1f/22/57/1f22578a1062fab1bc0047b5b1fcc51b.jpg" },
            { name: "Thonglor", image: "https://i.pinimg.com/736x/f1/86/d0/f186d03e84f1be3acad2f4932b479fb3.jpg" },
            { name: "Ekkamai", image: "https://i.pinimg.com/736x/a7/3c/65/a73c652a267eb2118211fa56dffe3c07.jpg" },
          ].map((venue, i, arr) => {
            if (i % 3 === 0) {
              return (
                <div key={i} className="flex flex-col md:flex-row gap-4">
                  {/* แนวตั้ง */}
                  <div className="relative overflow-hidden rounded-xl aspect-[3/4] w-full md:w-50 max-w-xs shadow-md">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="object-cover w-full h-full"
                    />
                    <p className="absolute bottom-2 left-2 text-white text-sm bg-black/70 px-2 py-1 rounded">
                      {venue.name}
                    </p>
                  </div>

                  {/* แนวนอน 2 อัน */}
                  <div className="flex flex-col gap-4 w-full md:w-49 max-w-xs">
                    {arr[i + 1] && (
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] w-full shadow-md">
                        <img
                          src={arr[i + 1].image}
                          alt={arr[i + 1].name}
                          className="object-cover w-full h-full"
                        />
                        <p className="absolute bottom-2 left-2 text-white text-sm bg-black/70 px-2 py-1 rounded">
                          {arr[i + 1].name}
                        </p>
                      </div>
                    )}
                    {arr[i + 2] && (
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] w-full shadow-md">
                        <img
                          src={arr[i + 2].image}
                          alt={arr[i + 2].name}
                          className="object-cover w-full h-full"
                        />
                        <p className="absolute bottom-2 left-2 text-white text-sm bg-black/70 px-2 py-1 rounded">
                          {arr[i + 2].name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>
      </section>

      {/* Top-rated Venues */}
      <section className="px-6 py-6">
        <h2 className="text-xl font-semibold mb-4">Top-rated Venues by guests</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            {
              name: "Indy Bar Bangmot",
              image: "https://i.pinimg.com/736x/67/86/94/67869432930f288a4f31328f20793cc8.jpg",
              location: "Bang Mot",
              rating: "4.9",
              favorite: true
            },
            {
              name: "The Iron Fairies",
              image: "https://i.pinimg.com/736x/cc/c7/51/ccc751f538b11b8754aab71541380f61.jpg",
              location: "Thonglor",
              rating: "4.8",
              favorite: true
            },
            {
              name: "Tep Bar",
              image: "https://i.pinimg.com/736x/e0/57/2e/e0572ef05c1b65db4f9d15856fbab25c.jpg",
              location: "Phra Nakhon",
              rating: "4.7",
              favorite: true
            },
            {
              name: "Rabbit Hole",
              image: "https://i.pinimg.com/736x/76/3b/16/763b169502915df85c8b210177ae5db9.jpg",
              location: "Thonglor",
              rating: "4.6",
              favorite: true
            },
            {
              name: "Smalls",
              image: "https://i.pinimg.com/736x/fc/d0/4f/fcd04f2e706b457b512491dc7eef2fba.jpg",
              location: "Sukhumvit",
              rating: "4.5",
              favorite: true
            },
            {
              name: "Havana Social",
              image: "https://i.pinimg.com/736x/20/f7/1f/20f71f0e17d11e6875c53d05a14d3695.jpg",
              location: "Sathon",
              rating: "4.4",
              favorite: true
            },
            {
              name: "Sing Sing Theater",
              image: "https://i.pinimg.com/736x/1f/22/57/1f22578a1062fab1bc0047b5b1fcc51b.jpg",
              location: "Sukhumvit",
              rating: "4.3",
              favorite: true
            },
            {
              name: "Jazz Happens",
              image: "https://i.pinimg.com/736x/f1/86/d0/f186d03e84f1be3acad2f4932b479fb3.jpg",
              location: "Ekkamai",
              rating: "4.2",
              favorite: true
            },
            {
              name: "Tropic City",
              image: "https://i.pinimg.com/736x/a7/3c/65/a73c652a267eb2118211fa56dffe3c07.jpg",
              location: "Bang Rak",
              rating: "4.1",
              favorite: true
            },
            {
              name: "Teens of Thailand",
              image: "https://i.pinimg.com/736x/68/71/da/6871da03a6f8ae746957a9300c4d0b9d.jpg",
              location: "Phra Nakhon",
              rating: "4.0",
              favorite: true
            },
            {
              name: "Vesper",
              image: "https://i.pinimg.com/736x/8c/19/ee/8c19ee9fe8483488671e8ec906a77767.jpg",
              location: "Sathon",
              rating: "3.9",
              favorite: true
            },
            {
              name: "Octave Rooftop",
              image: "https://i.pinimg.com/736x/31/bd/e3/31bde3f144d7660c3dd5a2e803a75a6a.jpg",
              location: "Sukhumvit",
              rating: "3.8",
              favorite: true
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

      {/* Most Favorite Venues */}
      <section className="px-6 py-6">
        <h2 className="text-xl font-semibold mb-2">Most Favorite Venues</h2>
        <p className="text-sm text-gray-600 mb-4">
          Explore the venues our guests love the most!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            {
              name: "Indy Bar Bangmot",
              image: "https://i.pinimg.com/736x/67/86/94/67869432930f288a4f31328f20793cc8.jpg",
              location: "Bang Mot",
              rating: "1.2K",
              favorite: true
            },
            {
              name: "The Iron Fairies",
              image: "https://i.pinimg.com/736x/cc/c7/51/ccc751f538b11b8754aab71541380f61.jpg",
              location: "Thonglor",
              rating: "1.3K",
              favorite: true
            },
            {
              name: "Tep Bar",
              image: "https://i.pinimg.com/736x/e0/57/2e/e0572ef05c1b65db4f9d15856fbab25c.jpg",
              location: "Phra Nakhon",
              rating: "1.4K",
              favorite: true
            },
            {
              name: "Rabbit Hole",
              image: "https://i.pinimg.com/736x/76/3b/16/763b169502915df85c8b210177ae5db9.jpg",
              location: "Thonglor",
              rating: "1.5K",
              favorite: true
            },
            {
              name: "Smalls",
              image: "https://i.pinimg.com/736x/fc/d0/4f/fcd04f2e706b457b512491dc7eef2fba.jpg",
              location: "Sukhumvit",
              rating: "1.1K",
              favorite: true
            },
            {
              name: "Havana Social",
              image: "https://i.pinimg.com/736x/20/f7/1f/20f71f0e17d11e6875c53d05a14d3695.jpg",
              location: "Sathon",
              rating: "1.6K",
              favorite: true
            },
            {
              name: "Sing Sing Theater",
              image: "https://i.pinimg.com/736x/1f/22/57/1f22578a1062fab1bc0047b5b1fcc51b.jpg",
              location: "Sukhumvit",
              rating: "1.7K",
              favorite: true
            },
            {
              name: "Jazz Happens",
              image: "https://i.pinimg.com/736x/f1/86/d0/f186d03e84f1be3acad2f4932b479fb3.jpg",
              location: "Ekkamai",
              rating: "1.3K",
              favorite: true
            },
            {
              name: "Tropic City",
              image: "https://i.pinimg.com/736x/a7/3c/65/a73c652a267eb2118211fa56dffe3c07.jpg",
              location: "Bang Rak",
              rating: "1.2K",
              favorite: true
            },
            {
              name: "Teens of Thailand",
              image: "https://i.pinimg.com/736x/68/71/da/6871da03a6f8ae746957a9300c4d0b9d.jpg",
              location: "Phra Nakhon",
              rating: "1.4K",
              favorite: true
            },
            {
              name: "Vesper",
              image: "https://i.pinimg.com/736x/8c/19/ee/8c19ee9fe8483488671e8ec906a77767.jpg",
              location: "Sathon",
              rating: "1.5K",
              favorite: true
            },
            {
              name: "Octave Rooftop",
              image: "https://i.pinimg.com/736x/31/bd/e3/31bde3f144d7660c3dd5a2e803a75a6a.jpg",
              location: "Sukhumvit",
              rating: "1.7K",
              favorite: true
            },
          ].map((venue, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden shadow bg-white">
              <div className="w-full h-40 relative">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 left-2 bg-white text-black text-xs font-bold px-2 py-1 rounded">
                  <span className="flex items-center gap-1">
                    <IconHeart size={12} className="text-red-500 fill-red-500" />
                    {venue.rating}
                  </span>
                </div>
                {venue.favorite && (
                  <IconHeart
                    className="absolute top-2 right-2 text-white fill-white/80"
                    size={20}
                  />
                )}
              </div>
              <div className="p-2">
                <p className="font-semibold">{venue.name}</p>
                <p className="text-sm text-gray-500">@{venue.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Page;