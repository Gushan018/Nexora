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
    </div>
  );
};
