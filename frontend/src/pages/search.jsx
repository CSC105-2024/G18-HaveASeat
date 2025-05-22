import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { ReservationSiteHero } from "@/components/site.jsx";
import { MerchantCard } from "@/components/merchant/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import {
  IconCalendar,
  IconMapPin,
  IconSearch,
  IconStarFilled,
  IconX,
} from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import { format } from "date-fns";
import { useAuthStore } from "@/store/auth";

function SearchSummary({ search, date, location, totalResults }) {
  return (
    <div className="space-y-2">
      {search && (
        <div className="flex items-center gap-2">
          <IconSearch className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">"{search}"</span>
        </div>
      )}

      {location && (
        <div className="flex items-center gap-2">
          <IconMapPin className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>
      )}

      {date && (
        <div className="flex items-center gap-2">
          <IconCalendar className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{format(new Date(date), "PPP")}</span>
        </div>
      )}

      <p className="text-muted-foreground text-sm">
        {totalResults} {totalResults === 1 ? "merchant" : "merchants"} found
      </p>
    </div>
  );
}

function Page() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const initialFilters = {
    minRating: 1,
    province: searchParams.get("province") || "",
    district: searchParams.get("district") || "",
  };

  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState([]);
  const [filteredMerchants, setFilteredMerchants] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const searchQuery = searchParams.get("name") || "";
  const searchDate = searchParams.get("date") || null;
  const searchLocation = searchParams.get("location") || "";
  const searchProvince = searchParams.get("province") || "";
  const searchDistrict = searchParams.get("district") || "";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (searchQuery) params.append("name", searchQuery);

        if (searchDistrict) {
          params.append("location", searchDistrict);
        } else if (searchProvince) {
          params.append("location", searchProvince);
        } else if (searchLocation) {
          params.append("location", searchLocation);
        }

        if (searchDate) params.append("date", searchDate);

        if (searchParams.get("sort")) {
          params.append("sort", searchParams.get("sort"));
          params.append("order", searchParams.get("order") || "desc");
        }

        const response = await axiosInstance.get(
          `/merchant/search?${params.toString()}`,
        );

        const apiMerchants = response.data.merchants || [];

        const processedMerchants = apiMerchants.map((merchant) => ({
          ...merchant,
          favorite: false,
        }));

        setMerchants(processedMerchants);
        setFilteredMerchants(processedMerchants);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setMerchants([]);
        setFilteredMerchants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [
    searchQuery,
    searchDate,
    searchLocation,
    searchProvince,
    searchDistrict,
    searchParams,
  ]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !merchants.length) return;

      try {
        const merchantIds = merchants.map((m) => m.id);

        const response = await axiosInstance.post("/user/favourites/check", {
          ids: merchantIds,
        });

        const { favoriteStatusMap } = response.data;

        setMerchants((prev) =>
          prev.map((merchant) => ({
            ...merchant,
            favorite: favoriteStatusMap[merchant.id] || false,
          })),
        );

        setFilteredMerchants((prev) =>
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
  }, [isAuthenticated, merchants.length]);

  const resetFilters = () => {
    setFilters({
      minRating: 1,
      province: "",
      district: "",
    });
    setFilteredMerchants(merchants);
    setAppliedFilters({
      minRating: 1,
      province: "",
      district: "",
    });
  };

  const handleFavoriteToggle = (merchantId, isFavorite) => {
    setMerchants((prev) =>
      prev.map((merchant) =>
        merchant.id === merchantId
          ? { ...merchant, favorite: isFavorite }
          : merchant,
      ),
    );

    setFilteredMerchants((prev) =>
      prev.map((merchant) =>
        merchant.id === merchantId
          ? { ...merchant, favorite: isFavorite }
          : merchant,
      ),
    );
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.minRating > 1) count++;
    if (appliedFilters.province) count++;
    if (appliedFilters.district) count++;
    return count;
  }, [appliedFilters]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <ReservationSiteHero />

      <div className="grid grid-cols-1 gap-8 px-4 lg:gap-12">
        {/* Search Results */}
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Search Results</h2>
              <SearchSummary
                search={searchQuery}
                date={searchDate}
                location={searchDistrict || searchProvince || searchLocation}
                totalResults={
                  filteredMerchants.filter(
                    (merchant) => merchant.hasCompletedSetup,
                  ).length
                }
              />
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="hidden sm:flex"
              >
                <IconX className="mr-1 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="aspect-video w-full" />
              ))}
            </div>
          ) : filteredMerchants
              .length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {filteredMerchants.map((merchant) => (
                <MerchantCard
                  key={merchant.id}
                  merchantId={merchant.id}
                  image={merchant.bannerImage}
                  name={merchant.name}
                  location={merchant.location}
                  rating={merchant.averageRating}
                  favorite={merchant.favorite}
                  description={merchant.description}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <IconSearch className="text-muted-foreground/60 mb-4 h-12 w-12" />
              <h3 className="text-lg font-medium">No Results Found</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                We couldn't find any merchants matching your criteria. Try
                adjusting your filters or search terms.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchQuery) params.set("name", searchQuery);
                  window.location.href = `${window.location.pathname}?${params.toString()}`;
                }}
                className="mt-6"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
