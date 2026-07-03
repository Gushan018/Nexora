import { useState, useEffect } from "react";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getVendorReviews, getProfile } from "../lib/api";

const COLORS = ["#D4AF37", "#C8A646", "#B8973C", "#E8C547", "#F0D878"];

export function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((profile) => getVendorReviews(profile.vendorId))
      .then((data) => setReviews(data.reviews || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalReviews = reviews.length;
  const avgRating = totalReviews ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    color: COLORS[5 - stars],
  }));

  const satisfactionRate = totalReviews
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / totalReviews) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
    ));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reviews & Ratings</h1>
        <p className="text-muted-foreground">Monitor customer feedback and satisfaction</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{avgRating.toFixed(1)}</h3>
              <p className="text-sm text-muted-foreground">Average Rating — out of 5</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{totalReviews}</h3>
              <p className="text-sm text-muted-foreground">Total Reviews — all time</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{satisfactionRate}%</h3>
              <p className="text-sm text-muted-foreground">Satisfaction Rate — rating 4+</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {reviews.filter((r) => r.rating === 5).length}
              </h3>
              <p className="text-sm text-muted-foreground">5-Star Reviews — excellent</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Rating Distribution</h3>
              {totalReviews === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={ratingDistribution.filter((r) => r.count > 0)}
                        cx="50%" cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="count"
                        nameKey="stars"
                      >
                        {ratingDistribution.filter((r) => r.count > 0).map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "8px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {ratingDistribution.map((r) => (
                      <div key={r.stars} className="text-center">
                        <p className="text-sm font-medium text-foreground">{r.stars}★</p>
                        <p className="text-xs text-muted-foreground">{r.count}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Performance Insights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-foreground">{satisfactionRate}%</p>
                  <p className="text-xs text-muted-foreground">Satisfaction Rate</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-foreground">{totalReviews}</p>
                  <p className="text-xs text-muted-foreground">Total Reviews</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 10).map((review: any) => (
                  <div key={review.reviewId} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {(review.customer?.name || 'NA').split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{review.customer?.name || 'Anonymous'}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.reviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
