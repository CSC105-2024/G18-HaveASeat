import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { ReviewCard } from "@/components/review/card.jsx";
import { useReviewAddOverlay } from "@/overlay/review/add.jsx";
import {
  IconCalendar,
  IconMessageCircle,
  IconPencil,
  IconSortAscending,
  IconSortDescending,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { useMerchantContext } from "@/providers/merchant.jsx";
import { useAuthStore } from "@/store/auth.js";
import axiosInstance from "@/lib/axios.js";
import { toast } from "sonner";
import { cn } from "@/lib/utils.js";
import { formatNumberDecimalPoint } from "@/lib/formatter.js";

function RatingFilterButton({ rating, isActive, onClick }) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={() => onClick(rating)}
      className={cn(
        "flex items-center gap-1",
        isActive && "bg-yellow-500 text-white hover:bg-yellow-600",
      )}
    >
      {rating}
      <IconStarFilled className="h-3 w-3" />
    </Button>
  );
}

function FilterItem({ children, active }) {
  return (
    <div
      className={cn(
        "hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm",
        active && "bg-accent",
      )}
    >
      {children}
    </div>
  );
}

function MerchantReviewSection({ merchant, merchantId }) {
  const { isOwner } = useMerchantContext();
  const { isAuthenticated, user } = useAuthStore();
  const { open: openReviewAddOverlay } = useReviewAddOverlay();

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOption, setSortOption] = useState("recent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const checkUserReview = async () => {
      if (!isAuthenticated || !merchantId) return;

      try {
        const response = await axiosInstance.get(
          `/review/list?merchantId=${merchantId}&userId=${user.id}`,
        );
        setHasReviewed(response.data.reviews.length > 0);
      } catch (error) {
        console.error("Error checking user review:", error);
      }
    };

    checkUserReview();
  }, [isAuthenticated, merchantId, user?.id]);

  const fetchReviews = async () => {
    if (!merchantId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/review/list?merchantId=${merchantId}&sort=${sortOption}&order=${sortOrder}`,
      );
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [merchantId, sortOption, sortOrder]);

  useEffect(() => {
    if (ratingFilter === 0) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(
        reviews.filter((review) => Math.floor(review.rating) === ratingFilter),
      );
    }
  }, [reviews, ratingFilter]);

  const handleRatingFilter = (rating) => {
    setRatingFilter((prevRating) => (prevRating === rating ? 0 : rating));
  };

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleWriteReview = () => {
    openReviewAddOverlay({
      merchantId,
      onSuccess: () => {
        fetchReviews();
        setHasReviewed(true);
      },
    });
  };

  const calculateRatings = () => {
    if (!reviews.length) return Array(5).fill(0);

    const ratings = Array(5).fill(0);
    reviews.forEach((review) => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratings[rating - 1]++;
      }
    });

    return ratings;
  };

  const ratingsCount = calculateRatings();
  const totalReviews = reviews.length;

  const averageRating = totalReviews
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>

        {isAuthenticated && !isOwner && !hasReviewed && (
          <Button onClick={handleWriteReview}>
            <IconPencil className="h-4 w-4" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Ratings Summary */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center lg:w-1/4">
            <div className="text-5xl font-bold text-yellow-500">
              {formatNumberDecimalPoint(averageRating)}
            </div>
            <div className="mt-2 flex">
              {[...Array(5)].map((_, i) => (
                <IconStarFilled
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-200",
                  )}
                />
              ))}
            </div>
            <div className="text-muted-foreground mt-1 text-sm">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </div>
          </div>

          {/* Rating Bars */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingsCount[rating - 1];
              const percentage = totalReviews
                ? (count / totalReviews) * 100
                : 0;

              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex w-10 items-center">
                    <span className="text-sm">{rating}</span>
                    <IconStarFilled className="ml-1 h-3 w-3 text-yellow-400" />
                  </div>
                  <div className="flex-1 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-10 text-right text-sm">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Filter:</span>
          <RatingFilterButton
            rating={5}
            isActive={ratingFilter === 5}
            onClick={handleRatingFilter}
          />
          <RatingFilterButton
            rating={4}
            isActive={ratingFilter === 4}
            onClick={handleRatingFilter}
          />
          <RatingFilterButton
            rating={3}
            isActive={ratingFilter === 3}
            onClick={handleRatingFilter}
          />
          <RatingFilterButton
            rating={2}
            isActive={ratingFilter === 2}
            onClick={handleRatingFilter}
          />
          <RatingFilterButton
            rating={1}
            isActive={ratingFilter === 1}
            onClick={handleRatingFilter}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                <div className="flex items-center">
                  <IconCalendar className="mr-2 h-4 w-4" />
                  Most Recent
                </div>
              </SelectItem>
              <SelectItem value="rating">
                <div className="flex items-center">
                  <IconStar className="mr-2 h-4 w-4" />
                  Highest Rating
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            title={sortOrder === "desc" ? "Descending" : "Ascending"}
          >
            {sortOrder === "desc" ? (
              <IconSortDescending className="h-4 w-4" />
            ) : (
              <IconSortAscending className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onUpdated={fetchReviews}
              isOwner={isOwner}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <IconMessageCircle className="text-muted-foreground/60 mb-4 h-12 w-12" />
            <h3 className="text-lg font-medium">No Reviews Yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
              {ratingFilter > 0
                ? `There are no ${ratingFilter}-star reviews yet.`
                : "Be the first to share your experience with this establishment!"}
            </p>
            {isAuthenticated && !isOwner && !hasReviewed && (
              <Button onClick={handleWriteReview} className="mt-6">
                Write a Review
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination can be added here if needed */}
    </div>
  );
}

export { MerchantReviewSection };
