import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Upload, CheckCircle2, ChevronLeft, Building, Camera, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../utils/api';

export const ReviewSubmission = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchParams] = useSearchParams();

  const vendorId = searchParams.get('vendorId');
  const serviceId = searchParams.get('serviceId');
  const productId = searchParams.get('productId');

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
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to submit review.');
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
          <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
<<<<<<< HEAD
          <h1 className="text-3xl font-bold text-textPrimary mb-4">Review Submitted!</h1>
          <p className="text-textPrimary/60 mb-8">
=======
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Review Submitted!</h1>
          <p className="text-slate-600 mb-8">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            Thank you for sharing your experience. Your feedback helps other planners make informed decisions and helps vendors improve their services.
          </p>
          <Link to="/customer/event-dashboard">
            <Button variant="outline" className="w-full mt-4">Return to Events</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-2xl">
        
        <div className="mb-8">
<<<<<<< HEAD
          <Link to="/customer/booking-history" className="text-sm text-textPrimary/60 hover:text-textPrimary flex items-center gap-1 w-fit mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to History
          </Link>
          <h1 className="text-3xl font-bold text-textPrimary mb-2">Leave a Review</h1>
          <p className="text-textPrimary/60">Share your experience with the vendor.</p>
=======
          <Link to="/customer/event-dashboard" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 w-fit mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Leave a Review</h1>
          <p className="text-slate-600">Share your experience with the vendor.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>

        <Card className="mb-8 border-slate-200 bg-surface/30">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
              <Camera className="w-8 h-8" />
            </div>
            <div>
<<<<<<< HEAD
              <h2 className="text-xl font-bold text-textPrimary">Reviewing Your Experience</h2>
              <p className="text-sm text-textPrimary/50">Your feedback is highly valued.</p>
=======
              <h2 className="text-xl font-bold text-slate-900">Reviewing Your Experience</h2>
              <p className="text-sm text-slate-500">Your feedback is highly valued.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Feedback</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            
            <div className="flex flex-col items-center space-y-4 pt-4">
<<<<<<< HEAD
              <p className="text-lg font-medium text-textPrimary">How was your overall experience?</p>
=======
              <p className="text-lg font-medium text-slate-900">How was your overall experience?</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
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
                          ? "text-yellow-400 fill-yellow-400" 
<<<<<<< HEAD
                          : "text-textPrimary/20"
=======
                          : "text-slate-300"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                      )} 
                    />
                  </button>
                ))}
              </div>
<<<<<<< HEAD
              <span className="text-sm font-medium text-textPrimary/60 h-5">
=======
              <span className="text-sm font-medium text-slate-600 h-5">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                {rating === 1 && "Terrible"}
                {rating === 2 && "Poor"}
                {rating === 3 && "Average"}
                {rating === 4 && "Great"}
                {rating === 5 && "Excellent"}
              </span>
            </div>

<<<<<<< HEAD
            <div className="space-y-3 pt-6 border-t border-white/5">
              <label className="text-sm font-medium text-textPrimary/80">Detailed Review</label>
=======
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <label className="text-sm font-medium text-slate-800">Detailed Review</label>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              <textarea 
                rows="6" 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did you like? What could be improved? Describe your experience working with this vendor..." 
<<<<<<< HEAD
                className="w-full bg-surface border border-white/10 rounded-xl p-4 text-textPrimary focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <p className="text-xs text-textPrimary/40 flex items-center justify-between">
                <span>Minimum 50 characters required for a public review.</span>
                <span className={cn(
                  reviewText.length >= 50 ? "text-green-400" : "text-textPrimary/40"
=======
                className="w-full bg-surface border border-slate-300 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <p className="text-xs text-slate-500 flex items-center justify-between">
                <span>Minimum 50 characters required for a public review.</span>
                <span className={cn(
                  reviewText.length >= 50 ? "text-green-400" : "text-slate-500"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                )}>{reviewText.length}/500</span>
              </p>
            </div>

<<<<<<< HEAD
            <div className="space-y-3 pt-6 border-t border-white/5">
              <label className="text-sm font-medium text-textPrimary/80">Add Photos (Optional)</label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-surface/50">
                <Upload className="w-8 h-8 text-textPrimary/40 mb-3" />
                <p className="text-sm text-textPrimary mb-1">Click to upload photos</p>
                <p className="text-xs text-textPrimary/40">PNG, JPG up to 5MB</p>
=======
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <label className="text-sm font-medium text-slate-800">Add Photos (Optional)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-surface/50">
                <Upload className="w-8 h-8 text-slate-500 mb-3" />
                <p className="text-sm text-slate-900 mb-1">Click to upload photos</p>
                <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400/80">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-400" />
              <p>Reviews are public and cannot be edited once submitted. Please ensure your feedback is constructive and adheres to our community guidelines.</p>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              disabled={rating === 0 || reviewText.length < 50 || submitReviewMutation.isPending}
              onClick={() => submitReviewMutation.mutate()}
            >
              {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};
