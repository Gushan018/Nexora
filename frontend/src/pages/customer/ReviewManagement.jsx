import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ExternalLink, ThumbsUp, MoreVertical, Calendar, Search, ArrowUpDown, Tag } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';

const RATINGS = [
  { label: 'All', value: 0 },
  { label: '5★', value: 5 },
  { label: '4★', value: 4 },
  { label: '3★', value: 3 },
  { label: '2★', value: 2 },
  { label: '1★', value: 1 },
];

const TYPE_OPTIONS = [
  { label: 'All Types', value: 'all' },
  { label: 'Vendors', value: 'vendor' },
  { label: 'Products', value: 'product' },
  { label: 'Services', value: 'service' },
];

export const ReviewManagement = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['myReviews'],
    queryFn: async () => {
      const res = await api.get('/reviews/my');
      return res.data;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const getReviewTitle = (review) =>
    review.vendor?.businessName || review.product?.productName || review.service?.serviceName || 'Unknown';

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((r) =>
        getReviewTitle(r).toLowerCase().includes(term) ||
        (r.comment || '').toLowerCase().includes(term)
      );
    }

    if (ratingFilter > 0) {
      result = result.filter((r) => r.rating === ratingFilter);
    }

    if (typeFilter === 'vendor') {
      result = result.filter((r) => r.vendorId);
    } else if (typeFilter === 'product') {
      result = result.filter((r) => r.productId);
    } else if (typeFilter === 'service') {
      result = result.filter((r) => r.serviceId);
    }

    result.sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.reviewDate) - new Date(a.reviewDate)
        : new Date(a.reviewDate) - new Date(b.reviewDate)
    );

    return result;
  }, [reviews, searchTerm, ratingFilter, typeFilter, sortOrder]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (isLoading) return <div className="pt-32 pb-20 text-center text-textPrimary">Loading reviews...</div>;
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Star className="w-7 h-7 text-yellow-400" />
            My Reviews
          </h1>
          <p className="text-textPrimary/60">Manage feedback you've left for vendors and sellers.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Total Reviews Written</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{reviews.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Average Rating Given</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{averageRating}</span>
              <div className="flex mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-3.5 h-3.5", i < Math.round(+averageRating) ? "text-yellow-400 fill-yellow-400" : "text-textPrimary/20")} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Filtered Results</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{filteredReviews.length}</span>
              <span className="text-textPrimary/40 text-sm mb-1">of {reviews.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textPrimary/40" />
              <input
                type="text"
                placeholder="Search by vendor, product, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-white/10 rounded-lg text-sm text-textPrimary placeholder-textPrimary/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-background border border-white/10 rounded-lg px-2 py-1">
                <Tag className="w-3.5 h-3.5 text-textPrimary/40" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-sm text-textPrimary border-none outline-none cursor-pointer"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1 bg-background border border-white/10 rounded-lg px-2 py-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-textPrimary/40" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent text-sm text-textPrimary border-none outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => setRatingFilter(r.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  ratingFilter === r.value
                    ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
                    : "bg-background border-white/10 text-textPrimary/60 hover:border-white/30"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.reviewId} className="border-white/5 hover:border-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-lg text-textPrimary">
                      {getReviewTitle(review)}
                    </h3>
                    {review.vendorId && <span className="text-[10px] uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">Vendor</span>}
                    {review.productId && <span className="text-[10px] uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Product</span>}
                    {review.serviceId && <span className="text-[10px] uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">Service</span>}
                    <div className="flex bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3.5 h-3.5", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-textPrimary/20")} />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-textPrimary/80 leading-relaxed text-sm">"{review.comment}"</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-textPrimary/40">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {new Date(review.reviewDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none" leftIcon={<ExternalLink className="w-4 h-4"/>}>View Public</Button>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
        {filteredReviews.length === 0 && (
          <div className="text-center text-textPrimary/60 py-12">
            {reviews.length === 0
              ? "You haven't written any reviews yet."
              : "No reviews match your filters. Try adjusting your search or filter criteria."}
          </div>
        )}
      </div>
    </div>
  );
};

