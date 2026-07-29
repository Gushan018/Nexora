import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ExternalLink, ThumbsUp, MoreVertical, Calendar, Search, ArrowUpDown, Tag, Building2, UserCheck } from 'lucide-react';
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
  { label: 'All Reviews', value: 'all' },
  { label: 'Event Management Companies', value: 'event_company' },
  { label: 'Service Providers', value: 'service_provider' },
  { label: 'Products', value: 'product' },
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
    review.vendor?.businessName || review.product?.productName || review.service?.serviceName || 'Partner Review';

  const isEventCompanyReview = (review) => {
    return review.vendor?.vendorType === 'EVENT_COMPANY' || (review.vendorId && !review.serviceId && !review.productId);
  };

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

    if (typeFilter === 'event_company') {
      result = result.filter((r) => isEventCompanyReview(r));
    } else if (typeFilter === 'service_provider') {
      result = result.filter((r) => !isEventCompanyReview(r) && (r.serviceId || (r.vendorId && r.vendor?.vendorType !== 'EVENT_COMPANY')));
    } else if (typeFilter === 'product') {
      result = result.filter((r) => r.productId);
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-400" />
            My Ratings & Reviews
          </h1>
          <p className="text-textPrimary/60">Manage reviews left for Event Management Companies, Service Providers, and Sellers.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-amber-500/20 bg-amber-500/5">
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
                  <Star key={i} className={cn("w-3.5 h-3.5", i < Math.round(+averageRating) ? "text-amber-400 fill-amber-400" : "text-textPrimary/20")} />
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

      {/* Toolbar & Category Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textPrimary/40" />
              <input
                type="text"
                placeholder="Search by Event Company, Service Provider, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-white/10 rounded-lg text-sm text-textPrimary placeholder-textPrimary/30 focus:outline-none focus:border-amber-500 transition-colors"
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
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">{opt.label}</option>
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
                  <option value="newest" className="bg-slate-900 text-white">Newest First</option>
                  <option value="oldest" className="bg-slate-900 text-white">Oldest First</option>
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
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
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
        {filteredReviews.map((review) => {
          const isComp = isEventCompanyReview(review);
          return (
            <Card key={review.reviewId} className="border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-lg text-textPrimary flex items-center gap-2">
                        {isComp ? <Building2 className="w-4 h-4 text-amber-400" /> : <UserCheck className="w-4 h-4 text-purple-400" />}
                        {getReviewTitle(review)}
                      </h3>
                      {isComp ? (
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          Event Mgmt Company
                        </span>
                      ) : review.serviceId ? (
                        <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                          Service Provider
                        </span>
                      ) : review.productId ? (
                        <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          Product Seller
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                          Service Provider
                        </span>
                      )}

                      <div className="flex bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3.5 h-3.5", i < review.rating ? "text-amber-400 fill-amber-400" : "text-textPrimary/20")} />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-textPrimary/80 leading-relaxed text-sm">"{review.comment}"</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-textPrimary/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5"/> 
                        {new Date(review.reviewDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none" leftIcon={<ExternalLink className="w-4 h-4"/>}>
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredReviews.length === 0 && (
          <div className="text-center text-textPrimary/60 py-12">
            {reviews.length === 0
              ? "You haven't submitted any reviews yet."
              : "No reviews match your selected filter criteria."}
          </div>
        )}
      </div>
    </div>
  );
};
