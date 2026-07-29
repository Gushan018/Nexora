import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Upload, CheckCircle2, ChevronLeft, Building2, Camera, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export const ReviewSubmission = () => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchParams] = useSearchParams();

  const vendorId = searchParams.get('vendorId');
  const serviceId = searchParams.get('serviceId');
  const productId = searchParams.get('productId');

  const { data: vendorInfo } = useQuery({
    queryKey: ['vendorInfoForReview', vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      try {
        const res = await api.get(`/vendors/${vendorId}`);
        return res.data;
      } catch (err) {
        return null;
      }
    },
    enabled: !!vendorId
  });

  const isEventCompany = vendorInfo?.vendorType === 'EVENT_COMPANY';

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/reviews', {
        rating,
        comment: reviewText,
        vendorId: vendorId ? parseInt(vendorId) : null,
        serviceId: serviceId ? parseInt(serviceId) : null,
        productId: productId ? parseInt(productId) : null
      });
      return res.data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      showToast('Review submitted successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    }
  });

  if (isSubmitted) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="container mx-auto px-6 max-w-lg text-center"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Review Submitted!</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Thank you for sharing your feedback. Your review helps other customers choose the right {isEventCompany ? 'Event Management Company' : 'Service Provider'}.
          </p>
          <Link to="/customer/review-management">
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">View My Reviews</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-2xl">
        
        <div className="mb-8">
          <Link to="/customer/booking-history" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 w-fit mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to My Bookings
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Leave a Rating & Review</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Share your feedback for {vendorInfo?.businessName || (isEventCompany ? 'Event Management Company' : 'Service Provider')}.
          </p>
        </div>

        {/* Entity Card Header */}
        <Card className="mb-8 border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              {isEventCompany ? <Building2 className="w-8 h-8" /> : <UserCheck className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {vendorInfo?.businessName || 'Reviewing Partner'}
                </h2>
                <span className={cn(
                  "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                  isEventCompany ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                )}>
                  {isEventCompany ? 'Event Mgmt Company' : 'Service Provider'}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Help others make informed hiring choices.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Detailed Rating</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            
            <div className="flex flex-col items-center space-y-4 pt-4">
              <p className="text-lg font-medium text-slate-900 dark:text-white">Overall Experience Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="p-2 transition-transform hover:scale-110 active:scale-95"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className={cn(
                        "w-12 h-12 transition-colors",
                        (hoveredRating || rating) >= star 
                          ? "text-amber-400 fill-amber-400" 
                          : "text-slate-300 dark:text-slate-600"
                      )} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-semibold text-amber-400 h-5">
                {rating === 1 && "Terrible"}
                {rating === 2 && "Poor"}
                {rating === 3 && "Average"}
                {rating === 4 && "Great"}
                {rating === 5 && "Excellent"}
              </span>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">Written Feedback</label>
              <textarea 
                rows="5" 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={isEventCompany 
                  ? "Describe the event management, organization, package setup, communication, and overall quality..."
                  : "Describe the service quality, punctuality, expertise, and overall experience with this provider..."
                } 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Constructive feedback helps vendors improve.</span>
                <span className={cn(
                  reviewText.length > 0 ? "text-amber-400 font-bold" : "text-slate-500 dark:text-slate-400"
                )}>{reviewText.length}/500</span>
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <p>Reviews are verified and published on the partner's public profile page.</p>
            </div>

            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-12 rounded-xl text-base" 
              disabled={rating === 0 || submitReviewMutation.isPending}
              onClick={() => submitReviewMutation.mutate()}
            >
              {submitReviewMutation.isPending ? 'Submitting Review...' : 'Submit Review'}
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};
