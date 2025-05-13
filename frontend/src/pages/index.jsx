import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { IconMapPin } from "@tabler/icons-react";
import { ReservationSiteHero } from "@/components/site.jsx";
import { MerchantCard } from "@/components/merchant/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import axiosInstance from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useAuthStore } from "@/store/auth";

function Page() {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [topRatedMerchants, setTopRatedMerchants] = useState([]);
  const [popularMerchants, setPopularMerchants] = useState([]);
  const [featuredLocations, setFeaturedLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get("/merchant");

        setFeaturedLocations(response.data.featuredLocations || []);
        setTopRatedMerchants(response.data.topRatedMerchants || []);
        setPopularMerchants(response.data.popularMerchants || []);
      } catch (error) {
        console.error("Error fetching merchants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated) return;
      if (!topRatedMerchants.length && !popularMerchants.length) return;

      try {
        const merchantIds = [
          ...topRatedMerchants.map((m) => m.id),
          ...popularMerchants.map((m) => m.id),
        ];

        const uniqueIds = [...new Set(merchantIds)];

        const response = await axiosInstance.post("/user/favourites/check", {
          ids: uniqueIds,
        });

        const { favoriteStatusMap } = response.data;

        setTopRatedMerchants((prev) =>
          prev.map((merchant) => ({
            ...merchant,
            favorite: favoriteStatusMap[merchant.id] || false,
          })),
        );

        setPopularMerchants((prev) =>
          prev.map((merchant) => ({
            ...merchant,
            favorite: favoriteStatusMap[merchant.id] || false,
          })),
        );
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [isAuthenticated, topRatedMerchants.length, popularMerchants.length]);

  const handleFavoriteToggle = (merchantId, isFavorite) => {
    setTopRatedMerchants((prev) =>
      prev.map((merchant) =>
        merchant.id === merchantId
          ? { ...merchant, favorite: isFavorite }
          : merchant,
      ),
    );

    setPopularMerchants((prev) =>
      prev.map((merchant) =>
        merchant.id === merchantId
          ? { ...merchant, favorite: isFavorite }
          : merchant,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-12">
      <ReservationSiteHero />

      {/* Featured Locations */}
      <section className="px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Featured Locations</h2>
          <p className="text-muted-foreground text-sm">
            Explore merchants in popular areas
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="flex flex-col gap-4">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="aspect-[4/3] w-full" />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="aspect-[4/3] w-full" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredLocations.slice(0, 5).map((location, index) => {
              const placeholderImages = [
                "https://i.pinimg.com/736x/67/86/94/67869432930f288a4f31328f20793cc8.jpg",
                "https://i.pinimg.com/736x/cc/c7/51/ccc751f538b11b8754aab71541380f61.jpg",
                "https://i.pinimg.com/736x/e0/57/2e/e0572ef05c1b65db4f9d15856fbab25c.jpg",
                "https://i.pinimg.com/736x/76/3b/16/763b169502915df85c8b210177ae5db9.jpg",
                "https://i.pinimg.com/736x/fc/d0/4f/fcd04f2e706b457b512491dc7eef2fba.jpg",
              ];

              if (index === 0) {
                return (
                  <Link
                    key={location.name}
                    to={`/search?location=${encodeURIComponent(location.name)}`}
                    className="group relative aspect-[3/4] overflow-hidden rounded-xl shadow-md"
                  >
                    <img
                      src={placeholderImages[index % placeholderImages.length]}
                      alt={location.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute right-4 bottom-4 left-4">
                      <h3 className="text-xl font-semibold text-white">
                        {location.name}
                      </h3>
                      <p className="mt-1 flex items-center text-sm text-white/80">
                        <IconMapPin className="mr-1 h-4 w-4" />
                        {location.merchantCount} merchants
                      </p>
                    </div>
                  </Link>
                );
              }

              return null;
            })}

            <div className="flex flex-col gap-4">
              {featuredLocations.slice(1, 3).map((location, idx) => (
                <Link
                  key={location.name}
                  to={`/search?location=${encodeURIComponent(location.name)}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-md"
                >
                  <img
                    src={`https://i.pinimg.com/736x/${["cc/c7/51/ccc751f538b11b8754aab71541380f61", "e0/57/2e/e0572ef05c1b65db4f9d15856fbab25c"][idx]}.jpg`}
                    alt={location.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4">
                    <h3 className="text-lg font-semibold text-white">
                      {location.name}
                    </h3>
                    <p className="mt-1 flex items-center text-sm text-white/80">
                      <IconMapPin className="mr-1 h-3 w-3" />
                      {location.merchantCount} merchants
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {featuredLocations.slice(3, 5).map((location, idx) => (
                <Link
                  key={location.name}
                  to={`/search?location=${encodeURIComponent(location.name)}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-md"
                >
                  <img
                    src={`https://i.pinimg.com/736x/${["76/3b/16/763b169502915df85c8b210177ae5db9", "fc/d0/4f/fcd04f2e706b457b512491dc7eef2fba"][idx]}.jpg`}
                    alt={location.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4">
                    <h3 className="text-lg font-semibold text-white">
                      {location.name}
                    </h3>
                    <p className="mt-1 flex items-center text-sm text-white/80">
                      <IconMapPin className="mr-1 h-3 w-3" />
                      {location.merchantCount} merchants
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Top-rated Merchants */}
      <section className="px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Top-rated Merchants</h2>
            <p className="text-muted-foreground text-sm">
              Highest rated by our customers
            </p>
          </div>
          <Link to="/search?sort=rating">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="aspect-video w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {topRatedMerchants.map((merchant) => (
              <MerchantCard
                key={merchant.id}
                merchantId={merchant.id}
                image={merchant.bannerImage}
                name={merchant.name}
                location={merchant.location}
                rating={merchant.averageRating}
                favorite={merchant.favorite}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </section>

      {/* Most Popular Merchants */}
      <section className="px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Most Popular Merchants</h2>
            <p className="text-muted-foreground text-sm">
              Loved by our community
            </p>
          </div>
          <Link to="/search?sort=popular">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="aspect-video w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {popularMerchants.map((merchant) => (
              <MerchantCard
                key={merchant.id}
                merchantId={merchant.id}
                image={merchant.bannerImage}
                name={merchant.name}
                location={merchant.location}
                rating={merchant.favoriteCount}
                favorite={merchant.favorite}
                isFavoriteCount={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Page;
