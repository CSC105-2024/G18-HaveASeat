import React, { useEffect, useState } from "react";
import AccountLayout from "@/components/layout/account.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { IconMessageCircle, IconRefresh } from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Link } from "react-router";
import { ReviewCard } from "@/components/review/card.jsx";

function Page() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/review/list?userId=current");
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
  }, []);

  const handleReviewUpdated = () => {
    fetchReviews();
  };

  return (
    <AccountLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">My Reviews</h2>
            <p className="text-muted-foreground text-sm">
              Reviews you've submitted for merchants
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchReviews}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <IconRefresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <Separator />

        <div className="space-y-6">
          {loading ? (
            [...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/merchant/${review.merchant.id}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {review.merchant.name}
                  </Link>
                </div>
                <ReviewCard review={review} onUpdated={handleReviewUpdated} />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <IconMessageCircle className="text-muted-foreground/60 mb-4 h-12 w-12" />
              <h3 className="text-lg font-medium">No Reviews Yet</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                You haven't submitted any reviews yet. Visit merchant pages to
                share your experiences!
              </p>
              <Link to="/" className="mt-6">
                <Button>Explore Merchants</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}

export default Page;
