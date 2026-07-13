import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Star, User, Package, MessageSquare, Loader2, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';

export const ProductReviews = () => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['seller-reviews'],
    queryFn: async () => {
      const res = await api.get('/reviews/seller');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-textPrimary/60">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-red-400">
        <AlertTriangle className="w-12 h-12 opacity-50" />
        <p>Failed to load reviews. Please try again later.</p>
      </div>
    );
  }

  const averageRating = reviews?.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Customer Reviews</h1>
          <p className="text-textPrimary/60">Manage and respond to feedback from your customers.</p>
        </div>
        <div className="px-6 py-3 bg-surface border border-white/10 rounded-2xl flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-bold text-textPrimary">{averageRating}</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-sm">
            <p className="text-textPrimary font-medium">{reviews?.length} Reviews</p>
            <p className="text-textPrimary/40">Lifetime feedback</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-textPrimary/40">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No reviews received yet. Reviews will appear here once customers provide feedback.</p>
            </CardContent>
          </Card>
        ) : (
          reviews?.map((review) => (
            <motion.div
              key={review.reviewId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:border-white/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Customer & Rating */}
                    <div className="w-full md:w-48 shrink-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
                          {review.customer.profileImage ? (
                            <img src={review.customer.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <span className="font-bold text-textPrimary">{review.customer.name}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-4 h-4", 
                              i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-textPrimary/10"
                            )} 
                          />
                        ))}
                      </div>
                      <p className="text-xs text-textPrimary/40">{new Date(review.reviewDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 space-y-4">
                      {review.product && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-textPrimary/60">
                          <Package className="w-3.5 h-3.5" />
                          <span>Product: <span className="text-textPrimary font-medium">{review.product.productName}</span></span>
                        </div>
                      )}
                      {review.service && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-textPrimary/60">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span>Service: <span className="text-textPrimary font-medium">{review.service.serviceName}</span></span>
                        </div>
                      )}
                      
                      <p className="text-textPrimary/80 leading-relaxed italic">"{review.comment || 'No comment provided.'}"</p>
                      
                      <div className="pt-4 border-t border-white/5 flex justify-end">
                        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Reply to Review
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
=======
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Reviews</h1>
          <p className="text-slate-600 mt-2">Information and details for Product Reviews.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Product Reviews Content</CardTitle>
            <CardDescription>Premium layout structure.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col items-center justify-center border border-slate-200 rounded-xl bg-surface/30">
              <p className="text-slate-500 mb-4">Detailed page content area.</p>
              <div className="flex gap-4">
                <div className="w-32 h-4 bg-slate-100 rounded animate-pulse"></div>
                <div className="w-24 h-4 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
    </div>
  );
};
