import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Filter, Search, Flag, Loader2, AlertTriangle, Package, Send, Edit3, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';

export const CustomerReviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [reportingTo, setReportingTo] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['vendor-reviews'],
    queryFn: async () => {
      const res = await api.get('/reviews/seller');
      return res.data;
    }
  });

  const replyMutation = useMutation({
    mutationFn: async ({ reviewId, reply }) => {
      const res = await api.put(`/reviews/${reviewId}/reply`, { reply });
      return res.data;
    },
    onSuccess: () => {
      setReplyingTo(null);
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['vendor-reviews'] });
    }
  });

  const reportMutation = useMutation({
    mutationFn: async ({ reviewId, reason }) => {
      const res = await api.put(`/reviews/${reviewId}/report`, { reason });
      return res.data;
    },
    onSuccess: () => {
      setReportingTo(null);
      setReportReason('');
      queryClient.invalidateQueries({ queryKey: ['vendor-reviews'] });
    }
  });

  const deleteReplyMutation = useMutation({
    mutationFn: async (reviewId) => {
      const res = await api.delete(`/reviews/${reviewId}/reply`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-reviews'] });
    }
  });

  const unreportMutation = useMutation({
    mutationFn: async (reviewId) => {
      const res = await api.put(`/reviews/${reviewId}/unreport`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-reviews'] });
    }
  });

  const filteredReviews = useMemo(() => {
    if (!reviews) return [];

    const normalizedSearch = searchTerm.trim().toLowerCase();

    return reviews.filter((review) => {
      const searchableFields = [
        review.customer?.name,
        review.comment,
        review.product?.productName,
        review.service?.serviceName,
      ]
        .filter(Boolean)
        .map((value) => value.toLowerCase());

      const matchesSearch =
        !normalizedSearch || searchableFields.some((value) => value.includes(normalizedSearch));

      const matchesFilter =
        filter === 'all' ||
        (filter === '5' && review.rating === 5) ||
        (filter === '4' && review.rating === 4) ||
        (filter === '3' && review.rating === 3) ||
        (filter === '2' && review.rating === 2) ||
        (filter === '1' && review.rating === 1) ||
        (filter === 'product' && !!review.product) ||
        (filter === 'service' && !!review.service);

      return matchesSearch && matchesFilter;
    });
  }, [reviews, searchTerm, filter]);

  const totalReviews = reviews?.length ?? 0;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
  const positiveFeedback = totalReviews > 0
    ? Math.round((reviews.filter((review) => review.rating >= 4).length / totalReviews) * 100)
    : 0;

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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight flex items-center gap-3">
            <Star className="w-7 h-7 text-yellow-400" />
            Customer Reviews
          </h1>
          <p className="text-textPrimary/60">See all feedback left for your products and services.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-7 h-7 text-yellow-400" />
            Customer Reviews
          </h1>
          <p className="text-slate-600">Manage your reputation and respond to client feedback.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="p-5 bg-surface border border-white/10 rounded-3xl text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-textPrimary/50">Average rating</p>
            <p className="mt-3 text-3xl font-semibold text-textPrimary">{averageRating}</p>
          </div>
          <div className="p-5 bg-surface border border-white/10 rounded-3xl text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-textPrimary/50">Total reviews</p>
            <p className="mt-3 text-3xl font-semibold text-textPrimary">{totalReviews}</p>
          </div>
          <div className="p-5 bg-surface border border-white/10 rounded-3xl text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-textPrimary/50">Positive feedback</p>
            <p className="mt-3 text-3xl font-semibold text-textPrimary">{positiveFeedback}%</p>
          </div>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reviews by name, product, or keyword..."
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary/50 cursor-pointer"
            >
              <option value="all">All Reviews</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
              <option value="product">Product Reviews</option>
              <option value="service">Service Reviews</option>
=======
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Rating Overview */}
        <Card className="md:col-span-2 border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="text-center">
              <span className="text-5xl font-bold text-slate-900">4.8</span>
              <div className="flex text-yellow-400 my-2 justify-center">
                <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current opacity-50"/>
              </div>
              <span className="text-xs text-slate-500">Based on 128 reviews</span>
            </div>
            
            <div className="flex-1 space-y-1.5">
              {[5,4,3,2,1].map(star => (
                <div key={star} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-2">{star}</span>
                  <Star className="w-3 h-3 text-slate-500" />
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : star === 3 ? '3%' : '1%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-300">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Response Rate</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">92%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-300">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Pending Replies</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-primary">2</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search reviews by name or keyword..." 
              className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>All Reviews</option>
              <option>5 Stars</option>
              <option>Needs Reply</option>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </select>

          </div>
        </div>

<<<<<<< HEAD
        <div className="p-6 space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 text-textPrimary/60">
              <AlertTriangle className="mx-auto mb-4 w-12 h-12 opacity-40" />
              <p>No reviews match your search or filters.</p>
=======
        <div className="divide-y divide-white/5">
          {REVIEWS.map((review) => (
            <div key={review.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                  {review.customer.charAt(0)}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{review.customer}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{review.date}</span>
                        <span>•</span>
                        <span>{review.event}</span>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-current" : "text-slate-300")} />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-800 text-sm leading-relaxed">"{review.text}"</p>

                  {/* Vendor Reply Block */}
                  {review.reply ? (
                    <div className="mt-4 bg-surface/50 border-l-2 border-primary p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-primary">Your Reply</span>
                      </div>
                      <p className="text-sm text-slate-700 italic">"{review.reply}"</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <Button variant="outline" size="sm" leftIcon={<Reply className="w-4 h-4"/>}>Reply to Review</Button>
                    </div>
                  )}
                </div>
                
                <div className="shrink-0 flex sm:flex-col gap-2">
                  <button className="p-2 text-slate-500 hover:text-slate-900 rounded-lg transition-colors" title="Helpful">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors" title="Report">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>
          ) : (
            filteredReviews.map((review) => (
              <motion.div
                key={review.reviewId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-white/10 hover:border-white/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                      <div className="flex items-center gap-4 lg:w-72">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-textPrimary text-lg font-semibold">
                          {review.customer?.name?.charAt(0) ?? 'C'}
                        </div>
                        <div>
                          <p className="text-sm text-textPrimary/50">Reviewed by</p>
                          <p className="font-semibold text-textPrimary">{review.customer?.name ?? 'Anonymous'}</p>
                          <p className="text-xs text-textPrimary/40 mt-1">
                            {new Date(review.reviewDate).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={cn(
                                'w-4 h-4',
                                index < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-textPrimary/10'
                              )}
                            />
                          ))}
                          <span className="text-sm text-textPrimary/50">{review.rating} / 5</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {review.product && (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/80 px-3 py-1 text-xs text-textPrimary/70">
                              <Package className="w-3.5 h-3.5" />
                              Product: {review.product.productName}
                            </span>
                          )}
                          {review.service && (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/80 px-3 py-1 text-xs text-textPrimary/70">
                              <Package className="w-3.5 h-3.5" />
                              Service: {review.service.serviceName}
                            </span>
                          )}
                        </div>

                        <p className="text-textPrimary/80 leading-relaxed">{review.comment || 'No comment provided.'}</p>

                        {review.vendorReply && (
                          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                            <p className="text-xs font-medium text-primary mb-1">Your Reply</p>
                            <p className="text-sm text-textPrimary/80">{review.vendorReply}</p>
                            {review.vendorReplyDate && (
                              <p className="text-xs text-textPrimary/40 mt-1">
                                {new Date(review.vendorReplyDate).toLocaleDateString('en-GB', {
                                  day: '2-digit', month: 'short', year: 'numeric'
                                })}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 justify-between">
                          <div>
                            {replyingTo === review.reviewId && (
                              <span className="text-xs text-textPrimary/50">{review.vendorReply ? 'Edit your reply' : 'Write a reply'}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {replyingTo === review.reviewId ? (
                              <div className="flex flex-col gap-2 w-full">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Write your reply..."
                                  rows={2}
                                  className="w-full bg-surface border border-white/10 rounded-xl px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => { setReplyingTo(null); setReplyText(''); setConfirmingDelete(null); }}
                                    className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-textPrimary/60 hover:text-textPrimary transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => replyMutation.mutate({ reviewId: review.reviewId, reply: replyText })}
                                    disabled={!replyText.trim() || replyMutation.isPending}
                                    className="px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {replyMutation.isPending ? 'Saving...' : <><Send className="w-3 h-3" /> {review.vendorReply ? 'Save' : 'Send'}</>}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {review.vendorReply ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => { setReplyingTo(review.reviewId); setReplyText(review.vendorReply); }}
                                      type="button"
                                      className="rounded-xl border border-white/10 px-3 py-2 text-sm text-textPrimary/80 hover:bg-white/5 transition flex items-center gap-1.5"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirmingDelete === review.reviewId) {
                                          deleteReplyMutation.mutate(review.reviewId);
                                          setConfirmingDelete(null);
                                        } else {
                                          setConfirmingDelete(review.reviewId);
                                        }
                                      }}
                                      type="button"
                                      className={cn(
                                        "rounded-xl border px-3 py-2 text-sm transition flex items-center gap-1.5",
                                        confirmingDelete === review.reviewId
                                          ? "border-red-500/30 text-red-400 bg-red-500/10"
                                          : "border-white/10 text-textPrimary/80 hover:text-red-400 hover:border-red-400/30"
                                      )}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      {confirmingDelete === review.reviewId ? 'Confirm?' : 'Delete'}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => { setReplyingTo(review.reviewId); setReplyText(''); setConfirmingDelete(null); }}
                                    type="button"
                                    className="rounded-xl border border-white/10 px-3 py-2 text-sm text-textPrimary/80 hover:bg-white/5 transition flex items-center gap-1.5"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" /> Reply
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    if (review.isReported) {
                                      unreportMutation.mutate(review.reviewId);
                                    } else {
                                      setReportingTo(review.reviewId);
                                      setReportReason('');
                                    }
                                  }}
                                  type="button"
                                  className={cn(
                                    "rounded-xl border px-3 py-2 text-sm transition flex items-center gap-1.5",
                                    review.isReported
                                      ? "border-red-500/20 text-red-400 bg-red-500/5"
                                      : "border-white/10 text-textPrimary/80 hover:bg-white/5"
                                  )}
                                >
                                  <Flag className="w-3.5 h-3.5" />
                                  {review.isReported ? 'Undo Report' : 'Report'}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      <Modal isOpen={!!reportingTo} onClose={() => { setReportingTo(null); setReportReason(''); }} title="Report Review">
        <p className="text-textPrimary/80 mb-4">
          Why are you reporting this review? This will notify the admin team.
        </p>
        <textarea
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="Optional: provide a reason..."
          rows={3}
          className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-textPrimary focus:outline-none focus:border-primary/50 transition-colors resize-none mb-6"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => { setReportingTo(null); setReportReason(''); }}
            className="px-4 py-2 rounded-xl border border-white/10 text-textPrimary/70 hover:text-textPrimary hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => reportMutation.mutate({ reviewId: reportingTo, reason: reportReason })}
            disabled={reportMutation.isPending}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {reportMutation.isPending ? 'Reporting...' : <><Flag className="w-4 h-4" /> Report</>}
          </button>
        </div>
      </Modal>
    </div>
  );
};
