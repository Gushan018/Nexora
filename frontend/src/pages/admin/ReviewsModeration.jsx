import React, { useMemo, useState, useEffect } from 'react';
import { Search, Flag, Ban, Eye, RotateCcw, Star, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';

const FLAGGED_REVIEWS = [
  {
    id: 'REV-2401',
    customerId: 'CUST-567',
    customerName: 'Aisha Patel',
    vendorId: 'VND-201',
    vendorName: 'Midnight Gold',
    rating: 1,
    comment: 'Worst service ever! Vendor is a scammer. DO NOT USE!!!',
    flaggedReason: 'Potentially Abusive Language',
    flaggedBy: 'System',
    flaggedDate: 'Jun 15, 2026',
    status: 'flagged',
  },
  {
    id: 'REV-2402',
    customerId: 'CUST-891',
    customerName: 'Marcus Chen',
    vendorId: 'VND-202',
    vendorName: 'Grand Azure Resort',
    rating: 5,
    comment: 'Book with my competitor at Elite Events instead! Best deals there.',
    flaggedReason: 'Promotional Competitor Link',
    flaggedBy: 'Admin',
    flaggedDate: 'Jun 14, 2026',
    status: 'flagged',
  },
  {
    id: 'REV-2403',
    customerId: 'CUST-123',
    customerName: 'Priya Senarath',
    vendorId: 'VND-203',
    vendorName: 'DJ Velocity',
    rating: 2,
    comment: 'Audio quality was disappointing. Not worth the LKR 15,000 we paid.',
    flaggedReason: 'Duplicate Review',
    flaggedBy: 'User Report',
    flaggedDate: 'Jun 13, 2026',
    status: 'flagged',
  },
];

const PENALTY_VENDORS = [
  {
    id: 'PEN-801',
    vendorId: 'VND-204',
    vendorName: 'Elite Catering Co.',
    penaltyDate: 'Jun 05, 2026',
    reason: '5 Bad Reviews',
    reasonType: 'bad-reviews',
    status: 'banned',
  },
  {
    id: 'PEN-802',
    vendorId: 'VND-205',
    vendorName: 'Lazy Decorators Inc.',
    penaltyDate: 'May 25, 2026',
    reason: 'Inactive (90 Days)',
    reasonType: 'inactive',
    status: 'suspended',
  },
  {
    id: 'PEN-803',
    vendorId: 'VND-206',
    vendorName: 'Broken Sound Studio',
    penaltyDate: 'Jun 01, 2026',
    reason: '5 Bad Reviews',
    reasonType: 'bad-reviews',
    status: 'banned',
  },
  {
    id: 'PEN-804',
    vendorId: 'VND-207',
    vendorName: 'Ghost Catering',
    penaltyDate: 'May 15, 2026',
    reason: 'Inactive (90 Days)',
    reasonType: 'inactive',
    status: 'suspended',
  },
];

const ALL_REVIEWS = [
  ...FLAGGED_REVIEWS.map(r => ({ ...r, status: 'flagged' })),
  {
    id: 'REV-2404',
    customerId: 'CUST-234',
    customerName: 'David Kumar',
    vendorId: 'VND-201',
    vendorName: 'Midnight Gold',
    rating: 5,
    comment: 'Exceptional photography! Every moment was captured beautifully. Highly recommend.',
    flaggedReason: null,
    flaggedBy: null,
    flaggedDate: null,
    status: 'approved',
  },
  {
    id: 'REV-2405',
    customerId: 'CUST-345',
    customerName: 'Sophia Rodriguez',
    vendorId: 'VND-202',
    vendorName: 'Grand Azure Resort',
    rating: 4,
    comment: 'Beautiful venue, great staff, but food could have been better.',
    flaggedReason: null,
    flaggedBy: null,
    flaggedDate: null,
    status: 'approved',
  },
];

const TABS = [
  { id: 'flagged', label: '🚩 Flagged Reviews' },
  { id: 'penalty', label: '🚫 Penalty Box' },
  { id: 'all', label: '📜 All Reviews' },
];

const reasonBadge = (reason) => {
  const styles = {
    'bad-reviews': 'bg-red-500/10 text-red-600 border-red-300/30 dark:text-red-300 dark:border-red-300/20',
    'inactive': 'bg-yellow-500/10 text-yellow-700 border-yellow-300/30 dark:text-yellow-300 dark:border-yellow-300/20',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', styles[reason] || 'bg-gray-100 border-gray-300')}>
      {reason === 'bad-reviews' && '⭐'} {reason === 'inactive' && '💤'} {reason === 'bad-reviews' ? '5 Bad Reviews' : 'Inactive (90 Days)'}
    </span>
  );
};

export const ReviewsModeration = () => {
  const [activeTab, setActiveTab] = useState('flagged');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    reportedReviews: 0,
    bannedVendors: 0,
    suspendedVendors: 0,
    platformAvgRating: 0,
  });
  const [flaggedReviews, setFlaggedReviews] = useState([]);
  const [penaltyVendors, setPenaltyVendors] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/reviews-stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching review stats:', err);
    }
  };

  const fetchFlaggedReviews = async () => {
    try {
      const response = await api.get('/admin/reviews-flagged');
      setFlaggedReviews(response.data || []);
    } catch (err) {
      console.error('Error fetching flagged reviews:', err);
    }
  };

  const fetchPenaltyVendors = async () => {
    try {
      const response = await api.get('/admin/penalty-vendors');
      setPenaltyVendors(response.data || []);
    } catch (err) {
      console.error('Error fetching penalty vendors:', err);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const response = await api.get('/admin/reviews-all');
      setAllReviews(response.data || []);
    } catch (err) {
      console.error('Error fetching all reviews:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchStats(),
        fetchFlaggedReviews(),
        fetchPenaltyVendors(),
        fetchAllReviews(),
      ]);
    } catch (err) {
      setError('Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredFlaggedReviews = useMemo(() => {
    const normalized = searchQuery.toLowerCase();
    return flaggedReviews.filter((review) =>
      [review.customerName, review.vendorName, review.id, review.comment]
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [searchQuery, flaggedReviews]);

  const filteredPenaltyVendors = useMemo(() => {
    const normalized = searchQuery.toLowerCase();
    return penaltyVendors.filter((vendor) =>
      [vendor.vendorName, vendor.id, vendor.reason]
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [searchQuery, penaltyVendors]);

  const filteredAllReviews = useMemo(() => {
    const normalized = searchQuery.toLowerCase();
    return allReviews.filter((review) =>
      [review.customerName, review.vendorName, review.id, review.comment]
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [searchQuery, allReviews]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Flag className="w-7 h-7 text-amber-500" />
            Reviews & Moderation
          </h1>
          <p className="text-gray-600 dark:text-white/60">Flag and review customer feedback, manage vendor penalties.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Reported Reviews</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">{stats.reportedReviews}</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-white/60">Flagged for review.</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Banned (Reviews)</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">{stats.bannedVendors}</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-white/60">Vendors in penalty box.</p>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-white/60">Suspended (Inactive)</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">{stats.suspendedVendors}</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-white/60">90+ days inactive.</p>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-white/60">Platform Avg Rating</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {stats.platformAvgRating} <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </p>
            <p className="mt-3 text-sm text-gray-500 dark:text-white/60">Across all vendors.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 border-b border-gray-200/70 dark:border-white/10">
          <div>
            <CardTitle>Review Queue</CardTitle>
            <p className="text-sm text-gray-500 dark:text-white/60">Manage flagged reviews and vendor penalties.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all flex items-center gap-2',
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-md dark:bg-white dark:!text-gray-900' // <--- මෙතන තමයි වෙනස් කළේ
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, ID, or comment..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-white/10 dark:bg-surface dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button variant="outline" size="sm">Refresh</Button>
            </div>
          </div>

          {activeTab === 'flagged' && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-500 dark:bg-white/5 dark:text-white/50">
                    <th className="p-4 text-left">Review ID</th>
                    <th className="p-4 text-left">Customer Name</th>
                    <th className="p-4 text-left">Vendor Name</th>
                    <th className="p-4 text-center">Rating</th>
                    <th className="p-4 text-left">Comment</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlaggedReviews.length > 0 ? (
                    filteredFlaggedReviews.map((review) => (
                      <tr key={review.id} className="border-b border-gray-200/70 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 font-semibold text-gray-900 dark:text-white">{review.id}</td>
                        <td className="p-4 text-gray-700 dark:text-white/80">{review.customerName}</td>
                        <td className="p-4 text-gray-700 dark:text-white/80">{review.vendorName}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'w-4 h-4',
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                )}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-gray-700 dark:text-white/80 truncate max-w-[200px]" title={review.comment}>
                          {review.comment}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Button variant="danger" size="sm" className="inline-flex" leftIcon={<AlertCircle className="w-4 h-4" />}>
                            Delete
                          </Button>
                          <Button variant="outline" size="sm" className="inline-flex" leftIcon={<Check className="w-4 h-4" />}>
                            Keep
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm text-gray-500 dark:text-white/60">
                        No flagged reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'penalty' && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-500 dark:bg-white/5 dark:text-white/50">
                    <th className="p-4 text-left">Vendor Name</th>
                    <th className="p-4 text-left">Penalty Date</th>
                    <th className="p-4 text-left">Reason</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPenaltyVendors.length > 0 ? (
                    filteredPenaltyVendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b border-gray-200/70 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 font-semibold text-gray-900 dark:text-white">{vendor.vendorName}</td>
                        <td className="p-4 text-gray-700 dark:text-white/80">{vendor.penaltyDate}</td>
                        <td className="p-4">{reasonBadge(vendor.reasonType)}</td>
                        <td className="p-4 text-right space-x-2">
                          <Button variant="outline" size="sm" className="inline-flex" leftIcon={<Eye className="w-4 h-4" />}>
                            View Profile
                          </Button>
                          <Button variant="secondary" size="sm" className="inline-flex" leftIcon={<RotateCcw className="w-4 h-4" />}>
                            Reactivate
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-sm text-gray-500 dark:text-white/60">
                        No penalty records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'all' && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-500 dark:bg-white/5 dark:text-white/50">
                    <th className="p-4 text-left">Review ID</th>
                    <th className="p-4 text-left">Customer Name</th>
                    <th className="p-4 text-left">Vendor Name</th>
                    <th className="p-4 text-center">Rating</th>
                    <th className="p-4 text-left">Comment</th>
                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllReviews.length > 0 ? (
                    filteredAllReviews.map((review) => (
                      <tr key={review.id} className="border-b border-gray-200/70 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 font-semibold text-gray-900 dark:text-white">{review.id}</td>
                        <td className="p-4 text-gray-700 dark:text-white/80">{review.customerName}</td>
                        <td className="p-4 text-gray-700 dark:text-white/80">{review.vendorName}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'w-4 h-4',
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                )}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-gray-700 dark:text-white/80 truncate max-w-[200px]" title={review.comment}>
                          {review.comment}
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
                              review.status === 'flagged'
                                ? 'bg-amber-500/10 text-amber-700 border-amber-300/30 dark:text-amber-300 dark:border-amber-300/20'
                                : 'bg-emerald-500/10 text-emerald-700 border-emerald-300/30 dark:text-emerald-300 dark:border-emerald-300/20'
                            )}
                          >
                            {review.status === 'flagged' ? '🚩 Flagged' : '✅ Approved'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm text-gray-500 dark:text-white/60">
                        No reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
