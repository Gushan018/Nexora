import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Star, User, Package, MessageSquare, Loader2, AlertTriangle, ThumbsUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../../utils/api';
import { cn } from '../../utils/cn';

export const ProductReviews = () => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['seller-reviews'],
    queryFn: async () => {
      const res = await api.get('/reviews/seller');
      return res.data;
    }
  });

  const stats = useMemo(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return { average: '0.0', total: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const average = (sum / total).toFixed(1);

    const breakdown = { total, average, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      breakdown[star] = (breakdown[star] || 0) + 1;
    });

    return breakdown;
  }, [reviews]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-600 dark:text-slate-400">Loading product reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-red-500">
        <AlertTriangle className="w-12 h-12 opacity-60" />
        <p className="font-medium text-slate-800 dark:text-white">Failed to load customer reviews.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-primary" />
            Customer Reviews & Ratings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Feedback and ratings received from verified marketplace buyers.</p>
        </div>
      </div>

      {/* Review Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 text-center flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{stats.average}</span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-5 h-5",
                    star <= Math.round(parseFloat(stats.average))
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-300 dark:text-slate-700"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">Based on {stats.total} customer review{stats.total !== 1 ? 's' : ''}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Rating Breakdown</h3>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats[star] || 0;
              const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-medium text-slate-600 dark:text-slate-400">{star} Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-slate-500">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Review List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customer Reviews</CardTitle>
          <CardDescription>All product reviews submitted by verified buyers.</CardDescription>
        </CardHeader>
        <CardContent>
          {!reviews || reviews.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
              <p className="font-medium text-base text-slate-800 dark:text-white">No reviews yet</p>
              <p className="text-sm mt-1">When customers purchase and review your products, feedback will show here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-white/10">
              {reviews.map((rev) => (
                <div key={rev.reviewId} className="py-6 first:pt-0 last:pb-0 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {rev.customer?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{rev.customer?.name || 'Customer'}</h4>
                        <span className="text-xs text-slate-500">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Buyer'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= rev.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.product && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                      <img
                        src={getImageUrl(rev.product.imageUrl)}
                        alt=""
                        className="w-5 h-5 rounded object-cover"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{rev.product.productName}</span>
                    </div>
                  )}

                  <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{rev.comment || 'No written comment provided.'}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
