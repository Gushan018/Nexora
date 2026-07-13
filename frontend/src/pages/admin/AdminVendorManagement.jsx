import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Store, Search, Star, ShieldCheck, MapPin, TrendingUp, AlertCircle, AlertTriangle, X, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

const createPackages = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: `PKG-${101 + index}`,
    name: `Package ${index + 1} — ${['Wedding Photography', 'Engagement Shoot', 'Event Coverage', 'Highlight Reel', 'Ceremony Album'][index % 5]}`,
    status: index % 12 === 7 ? 'Suspended' : 'Active',
  }));

const INITIAL_VENDORS = [
  {
    id: 'VND-201',
    name: 'Midnight Gold',
    category: 'Photography',
    type: 'Service Provider',
    rating: 4.8,
    location: 'Colombo, Sri Lanka',
    gmv: 'LKR368,400',
    status: 'Verified',
    badReviews: 1,
    lastActive: '2026-06-01',
    blocked: false,
    financial: {
      totalGenerated: 'LKR368,400',
      commissionPercent: 10,
      platformProfit: 'LKR36,840',
      escrowHeld: 'LKR42,300',
      payoutsSent: 'LKR289,260',
    },
    packages: createPackages(24),
    bookings: {
      total: 142,
      completed: 120,
      canceled: 18,
      disputes: 4,
    },
    auditLog: [
      { id: 'A1', text: 'Vendor added a new package: Drone Coverage', time: '2 hours ago' },
      { id: 'A2', text: 'Vendor requested a withdrawal of $18,500', time: '1 day ago' },
      { id: 'A3', text: 'Platform approved payout to vendor bank account', time: '3 days ago' },
      { id: 'A4', text: 'Vendor updated pricing for Wedding Photography package', time: '5 days ago' },
      { id: 'A5', text: 'Escrow release approved for order #ORD-142', time: '1 week ago' },
    ],
    reviews: {
      average: 4.8,
      total: 78,
      latest: 'Excellent photography and fast delivery. Highly recommend!',
    },
    orders: [
      { id: '#ORD-142', item: 'Wedding Photography Package', vendor: 'Midnight Gold', amount: 'LKR2,850', status: 'COMPLETED', escrow: 'RELEASED', date: 'Jun 10, 2026' },
      { id: '#ORD-138', item: 'Engagement Photoshoot', vendor: 'Midnight Gold', amount: 'LKR1,200', status: 'COMPLETED', escrow: 'RELEASED', date: 'May 28, 2026' },
      { id: '#ORD-135', item: 'Event Highlight Reel', vendor: 'Midnight Gold', amount: 'LKR950', status: 'COMPLETED', escrow: 'RELEASED', date: 'May 15, 2026' },
    ],
  },
  {
    id: 'VND-202',
    name: 'Grand Azure Resort',
    category: 'Venues',
    type: 'Event Company',
    rating: 4.5,
    location: 'Kandy, Sri Lanka',
    gmv: 'LKR520,000',
    status: 'Verified',
    badReviews: 2,
    lastActive: '2026-05-15',
    blocked: false,
    financial: {
      totalGenerated: 'LKR520,000',
      commissionPercent: 10,
      platformProfit: 'LKR52,000',
      escrowHeld: 'LKR76,500',
      payoutsSent: 'LKR391,500',
    },
    packages: createPackages(12),
    bookings: { total: 98, completed: 84, canceled: 10, disputes: 2 },
    auditLog: [
      { id: 'A6', text: 'Vendor added a new package: Outdoor Venue', time: '4 hours ago' },
      { id: 'A7', text: 'Vendor requested payout for May bookings', time: '2 days ago' },
    ],
    reviews: { average: 4.5, total: 54, latest: 'Great location and responsive staff.' },
    orders: [
      { id: '#ORD-121', item: 'Banquet Hall Rental', vendor: 'Grand Azure Resort', amount: 'LKR3,500', status: 'COMPLETED', escrow: 'RELEASED', date: 'May 21, 2026' },
    ],
  },
  {
    id: 'VND-203',
    name: 'DJ Velocity',
    category: 'Entertainment',
    type: 'Service Provider',
    rating: 4.2,
    location: 'Galle, Sri Lanka',
    gmv: 'LKR24,000',
    status: 'Pending Review',
    badReviews: 5,
    lastActive: '2026-03-20',
    blocked: false,
    financial: {
      totalGenerated: 'LKR24,000',
      commissionPercent: 10,
      platformProfit: 'LKR 2,400',
      escrowHeld: 'LKR 6,800',
      payoutsSent: 'LKR 15,800',
    },
    packages: createPackages(8),
    bookings: { total: 42, completed: 30, canceled: 8, disputes: 3 },
    auditLog: [
      { id: 'A8', text: 'Vendor added a withdrawal request', time: '1 day ago' },
      { id: 'A9', text: 'Vendor updated package: Party DJ', time: '3 days ago' },
    ],
    reviews: { average: 4.2, total: 30, latest: 'Good energy but sound mixing needs improvement.' },
    orders: [
      { id: '#ORD-99', item: 'Party DJ', vendor: 'DJ Velocity', amount: 'LKR 850', status: 'PENDING', escrow: 'HELD', date: 'Jun 05, 2026' },
    ],
  },
  {
    id: 'VND-204',
    name: 'Elite Catering Co.',
    category: 'Catering',
    type: 'Seller',
    rating: 2.8,
    location: 'Negombo, Sri Lanka',
    gmv: 'LKR5,200',
    status: 'Warning',
    badReviews: 5,
    lastActive: '2026-01-30',
    blocked: true,
    financial: {
      totalGenerated: 'LKR5,200',
      commissionPercent: 10,
      platformProfit: 'LKR520',
      escrowHeld: 'LKR1,200',
      payoutsSent: 'LKR3,480',
    },
    packages: createPackages(6),
    bookings: { total: 9, completed: 5, canceled: 3, disputes: 2 },
    auditLog: [
      { id: 'A10', text: 'Vendor listed a new package: Budget Buffet', time: '5 days ago' },
      { id: 'A11', text: 'Vendor submitted dispute response', time: '1 week ago' },
    ],
    reviews: { average: 2.8, total: 12, latest: 'Food quality was below expectations.' },
    orders: [
      { id: '#ORD-112', item: 'Budget Buffet', vendor: 'Elite Catering Co.', amount: 'LKR520', status: 'COMPLETED', escrow: 'RELEASED', date: 'May 05, 2026' },
    ],
  },
];

const OverviewStat = ({ label, value, note }) => (
  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white p-4 text-sm dark:bg-surface">
    <p className="text-xs text-gray-500 dark:text-white/50">{label}</p>
    <div className="mt-3 flex items-center justify-between gap-2">
      <span className="text-xl font-semibold text-gray-900 dark:text-white">{value}</span>
      {note && <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600 dark:bg-white/10 dark:text-white/70">{note}</span>}
    </div>
  </div>
);

const StatPill = ({ label, value, danger }) => (
  <div className={cn('rounded-3xl px-4 py-3 text-center', danger ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200' : 'bg-gray-100 text-gray-900 dark:bg-white/5 dark:text-white/80')}>
    <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 dark:text-white/50">{label}</p>
    <p className="mt-2 text-xl font-semibold">{value}</p>
  </div>
);

const monthsSince = (activeDate) => {
  const last = new Date(activeDate);
  const now = new Date();
  return Math.floor((now - last) / (1000 * 60 * 60 * 24 * 30));
};

export const AdminVendorManagement = () => {
  const { loginAsUser } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendorLoading, setSelectedVendorLoading] = useState(false);
  const [impersonating, setImpersonating] = useState(false);
  const [suspendedPackages, setSuspendedPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusTab, setStatusTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: systemSettings } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/settings');
        return res.data;
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/vendors');
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const commissionFromSettings = systemSettings?.commissionPercent ?? 10;
          const enriched = response.data.map((v) => ({
            ...v,
            id: v.id || `VND-${v.vendorId}`,
            category: v.vendorType || 'Service',
            gmv: `LKR${Math.floor(Math.random() * 500000)}`,
            rating: Math.random() * 5,
            location: 'Sri Lanka',
            status: v.isBlocked ? 'Blocked' : 'Verified',
            badReviews: Math.floor(Math.random() * 6),
            lastActive: new Date().toISOString(),
            blocked: v.isBlocked || false,
            type: v.vendorType || 'Service Provider',
            financial: {
              totalGenerated: `LKR${Math.floor(Math.random() * 500000)}`,
              commissionPercent: commissionFromSettings,
              platformProfit: `LKR${Math.floor(Math.random() * 50000)}`,
              escrowHeld: `LKR${Math.floor(Math.random() * 100000)}`,
              payoutsSent: `LKR${Math.floor(Math.random() * 400000)}`,
            },
            packages: createPackages(8),
            bookings: { total: Math.floor(Math.random() * 200), completed: Math.floor(Math.random() * 150), canceled: Math.floor(Math.random() * 20), disputes: Math.floor(Math.random() * 5) },
            auditLog: [],
            orders: [],
            reviews: { average: Math.random() * 5, total: Math.floor(Math.random() * 100), latest: 'Good service' },
          }));
          setVendors(enriched);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Using sample data');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [systemSettings]);

  const parseVendorId = (vendor) => {
    if (vendor.vendorId != null) return vendor.vendorId;
    if (typeof vendor.id === 'string') return Number(vendor.id.replace(/^VND-/, ''));
    return Number(vendor.id);
  };

  const handleSelectVendor = async (vendor) => {
    const id = parseVendorId(vendor);
    if (!id || Number.isNaN(id)) return;

    try {
      setSelectedVendorLoading(true);
      const response = await api.get(`/admin/vendors/${id}`);
      if (response.data) {
        setSelectedVendor(response.data);
        setSuspendedPackages(response.data.packages.filter((pkg) => pkg.status === 'Suspended').map((pkg) => pkg.id));
      }
    } catch (err) {
      console.error('Error fetching vendor details:', err);
    } finally {
      setSelectedVendorLoading(false);
    }
  };

  const handleLoginAsVendor = async (vendor) => {
    const id = vendor.vendorId ?? parseVendorId(vendor);
    if (!id || Number.isNaN(id)) return;
    setImpersonating(true);
    try {
      const response = await api.post(`/admin/impersonate/vendor/${id}`);
      loginAsUser(response.data.token, response.data.user);
      navigate('/vendor/dashboard');
    } catch (err) {
      console.error('Error impersonating vendor:', err);
      setImpersonating(false);
    }
  };

  const handleSuspendPackage = (packageId) => {
    setSuspendedPackages((current) =>
      current.includes(packageId) ? current.filter((id) => id !== packageId) : [...current, packageId]
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-600 dark:text-white/60">Loading vendors...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const alertVendors = vendors.filter((vendor) => vendor.badReviews >= 5);
  const inactiveVendors = vendors.filter((vendor) => monthsSince(vendor.lastActive) >= 3 && !vendor.blocked);
  const activeVendors = vendors.filter((vendor) => !vendor.blocked && vendor.badReviews <= 2);
  const atRiskVendors = vendors.filter((vendor) => !vendor.blocked && vendor.badReviews >= 3 && vendor.badReviews <= 4);
  const bannedVendors = vendors.filter((vendor) => vendor.badReviews >= 5);

  const filteredVendors = vendors
    .filter((vendor) => {
      if (typeFilter !== 'All' && vendor.type !== typeFilter) {
        return false;
      }
      if (!searchQuery) {
        return true;
      }
      const normalized = searchQuery.toLowerCase();
      return vendor.name.toLowerCase().includes(normalized) || vendor.id.toLowerCase().includes(normalized);
    })
    .filter((vendor) => {
      if (statusTab === 'active') return !vendor.blocked && vendor.badReviews <= 2;
      if (statusTab === 'atrisk') return !vendor.blocked && vendor.badReviews >= 3 && vendor.badReviews <= 4;
      if (statusTab === 'banned') return vendor.badReviews >= 5;
      return true;
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            Vendor Management
          </h1>
          <p className="text-gray-600 dark:text-white/60">Track vendor health, audit high-risk activity, and review detailed vendor profiles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="border-gray-200 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-white/60 mb-2">Total Vendors</h3>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{vendors.length}</span>
          </CardContent>
        </Card>
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Vendor Alerts</h3>
            <span className="text-3xl font-bold text-accent">{alertVendors.length}</span>
            <p className="text-xs text-gray-600 dark:text-white/60 mt-2">Vendors with 5+ bad reviews</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-white/60 mb-2">Inactive ({`>`} 3 Months)</h3>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{inactiveVendors.length}</span>
            </div>
            <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/10">
              Review
            </Button>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-white/60 mb-2">Temporarily Blocked</h3>
              <span className="text-3xl font-bold text-yellow-500">{vendors.filter((v) => v.blocked).length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {alertVendors.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Vendor Alert</h3>
                <p className="text-sm text-red-700 dark:text-red-100/80">These vendors have 5 or more bad reviews and need immediate admin attention.</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-700 dark:text-red-300" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alertVendors.map((vendor) => (
                <div key={vendor.id} className="rounded-2xl border border-red-400/20 p-4 bg-white/80 dark:bg-red-500/10">
                  <p className="text-sm text-red-700 dark:text-red-100 uppercase tracking-[0.2em]">{vendor.id}</p>
                  <h4 className="font-semibold text-gray-900 dark:text-white mt-2">{vendor.name}</h4>
                  <p className="text-sm text-red-700 dark:text-red-100/80 mt-1">Bad Reviews: {vendor.badReviews}</p>
                  <p className="text-xs text-red-600 dark:text-red-100/70 mt-1">Last active: {vendor.lastActive}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b border-gray-200 dark:border-white/10 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatusTab('active')}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  statusTab === 'active'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10'
                )}
              >
                Active Vendors
              </button>
              <button
                type="button"
                onClick={() => setStatusTab('atrisk')}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  statusTab === 'atrisk'
                    ? 'bg-yellow-100 text-yellow-800 shadow-sm dark:bg-yellow-500/10 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10'
                )}
              >
                ⚠️ At Risk
              </button>
              <button
                type="button"
                onClick={() => setStatusTab('banned')}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  statusTab === 'banned'
                    ? 'bg-red-100 text-red-800 shadow-sm dark:bg-red-500/10 dark:text-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10'
                )}
              >
                🚫 Banned Vendors
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search vendors by name or ID..."
                  className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option>All</option>
                <option>Event Company</option>
                <option>Service Provider</option>
                <option>Seller</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-white/60">
            <span>{activeVendors.length} active vendors</span>
            <span>{atRiskVendors.length} at-risk vendors</span>
            <span>{bannedVendors.length} banned vendors</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-white/50 bg-gray-50 dark:bg-white/[0.02]">
                <th className="p-4 pl-6">Business</th>
                <th className="p-4">Location</th>
                <th className="p-4">Performance</th>
                <th className="p-4">Risk</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredVendors.map((vendor, i) => {
                const inactiveMonths = monthsSince(vendor.lastActive);
                const canTempBlock = inactiveMonths >= 3 && !vendor.blocked;
                return (
                  <tr key={i} className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-900 dark:text-white">{vendor.name}</span>
                        <span className="text-xs text-gray-500 dark:text-white/50">{vendor.type} • {vendor.category} • {vendor.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-white/80">
                        <MapPin className="w-4 h-4 text-gray-400 dark:text-white/40" />
                        <span className="text-xs text-gray-600 dark:text-white/80">{vendor.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                          <Star className={cn("w-3.5 h-3.5", vendor.rating >= 4.5 ? "text-yellow-400 fill-yellow-400" : vendor.rating < 3 ? "text-red-400" : "text-yellow-400")} />
                          {vendor.rating}
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-300 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {vendor.gmv} YTD</span>
                        <span className="text-xs text-gray-500 dark:text-white/60">Bad reviews: {vendor.badReviews}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full",
                          vendor.badReviews >= 5 ? "bg-red-500/20 text-red-700 border border-red-500/20 dark:bg-red-500/10 dark:text-red-200" : "bg-green-500/10 text-green-700 dark:text-green-300"
                        )}>
                          {vendor.badReviews >= 5 ? <AlertCircle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          {vendor.badReviews >= 5 ? 'High Risk' : 'Healthy'}
                        </span>
                        {vendor.blocked && (
                          <span className="text-xs text-yellow-700 dark:text-yellow-300">Temporarily blocked</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-gray-600 dark:text-white/80">
                        <span className="text-sm">{vendor.lastActive}</span>
                        <span className="text-xs text-gray-500 dark:text-white/60">{inactiveMonths} months inactive</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleSelectVendor(vendor)}
                      >
                        Manage
                      </Button>
                      {canTempBlock && (
                        <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300/20 hover:bg-yellow-300/10 dark:text-yellow-300">
                          Temp Block
                        </Button>
                      )}
                      {!canTempBlock && vendor.badReviews >= 5 && !vendor.blocked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-700 dark:text-red-300">Alert</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {selectedVendor && (
          <motion.div className="fixed inset-0 z-[90] flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.button type="button" className="absolute inset-0 bg-black/40" onClick={() => setSelectedVendor(null)} aria-label="Close drawer" />
            <motion.div className="relative ml-auto h-full w-full max-w-[760px] bg-white dark:bg-surface shadow-2xl overflow-y-auto" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 p-5 sticky top-0 bg-white dark:bg-surface">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedVendor.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-white/50">Admin vendor overview</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<LogIn className="w-4 h-4" />}
                    onClick={() => handleLoginAsVendor(selectedVendor)}
                    isLoading={impersonating}
                    title="Temporarily view the platform as this vendor, without their password"
                  >
                    Login as Vendor
                  </Button>
                  <button type="button" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-white/5" onClick={() => setSelectedVendor(null)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-5">
                <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">1. Financial & Escrow Overview</h3>
                      <p className="text-sm text-gray-500 dark:text-white/50">Real vendor totals pulled from bookings and payments.</p>
                    </div>
                    {selectedVendorLoading ? (
                      <span className="text-sm text-gray-500 dark:text-white/60">Loading details…</span>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <OverviewStat label="Total Generated" value={selectedVendor.financial.totalGenerated} />
                    <OverviewStat label="Platform Commission" value={selectedVendor.financial.platformProfit} note={`${systemSettings?.commissionPercent ?? selectedVendor.financial.commissionPercent}%`} />
                    <OverviewStat label="Currently in Escrow (Held)" value={selectedVendor.financial.escrowHeld} />
                    <OverviewStat label="Payouts Sent" value={selectedVendor.financial.payoutsSent} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.9fr]">
                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">2. Packages & Moderation ({selectedVendor.packages.length})</h3>
                    <div className="max-h-[420px] overflow-y-auto space-y-3">
                      {selectedVendor.packages.map((pkg) => {
                        const isSuspended = suspendedPackages.includes(pkg.id) || pkg.status === 'Suspended';
                        return (
                          <div key={pkg.id} className={cn('rounded-3xl border p-3 flex items-center justify-between gap-3', isSuspended ? 'border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10' : 'border-gray-200 bg-white dark:border-white/10 dark:bg-surface')}>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 dark:text-white/50">{pkg.id}</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{pkg.name}</p>
                            </div>
                            <Button size="sm" variant={isSuspended ? 'secondary' : 'danger'} onClick={() => handleSuspendPackage(pkg.id)} className="flex-shrink-0">
                              {isSuspended ? 'Unsuspend' : 'Suspend'}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">3. Bookings & Disputes</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <StatPill label="Total Bookings" value={selectedVendor.bookings.total} />
                      <StatPill label="Completed" value={selectedVendor.bookings.completed} />
                      <StatPill label="Canceled" value={selectedVendor.bookings.canceled} />
                      <StatPill label="Disputes" value={selectedVendor.bookings.disputes} danger />
                    </div>
                    {selectedVendor.bookings.disputes > 0 && (
                      <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                        <p className="font-semibold">⚠ Dispute Alert</p>
                        <p className="mt-1">{selectedVendor.bookings.disputes} customer complaint(s) require admin review.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_0.7fr]">
                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">4. Admin Audit Log</h3>
                        <p className="text-sm text-gray-500 dark:text-white/50">Admin-only actions, not customer activity.</p>
                      </div>
                      <Button variant="outline" size="sm">View All</Button>
                    </div>
                    <div className="space-y-3">
                      {selectedVendor.auditLog.map((event) => (
                        <div key={event.id} className="rounded-3xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-surface">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.text}</p>
                          <p className="text-xs text-gray-500 dark:text-white/50 mt-1">{event.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">5. Reviews</h3>
                        <p className="text-sm text-gray-500 dark:text-white/50">Quality control summary.</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{selectedVendor.reviews.total}</span>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-3xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-surface">
                        <p className="text-sm text-gray-500 dark:text-white/50">Average Rating</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-3xl font-semibold text-gray-900 dark:text-white">{selectedVendor.reviews.average}</span>
                          <span className="text-sm text-gray-500 dark:text-white/50">/ 5.0</span>
                        </div>
                      </div>
                      <div className="rounded-3xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-surface">
                        <p className="text-xs uppercase tracking-[0.12em] text-gray-500 dark:text-white/50">Latest Review</p>
                        <p className="mt-2 text-sm text-gray-900 dark:text-white italic">"{selectedVendor.reviews.latest}"</p>
                      </div>
                      <Button variant={selectedVendor.reviews.average < 3.5 ? 'danger' : 'outline'} size="sm" className="w-full">
                        {selectedVendor.reviews.average < 3.5 ? '🗑️ Remove Vendor' : 'Flag for Review'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface p-5">
                  <div className="mb-5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Orders (Escrow Details)</h3>
                    <p className="text-sm text-gray-500 dark:text-white/50">Order-level escrow release status.</p>
                  </div>
                  <div className="space-y-4">
                    {selectedVendor.orders.map((order) => (
                      <div key={order.id} className="rounded-3xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-surface">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.item}</p>
                            <p className="text-xs text-gray-500 dark:text-white/50 mt-1">{order.id}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-white/50">Amount</p>
                              <p className="mt-1 font-semibold text-gray-900 dark:text-white">{order.amount}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-white/50">Status</p>
                              <p className="mt-1 font-semibold text-gray-900 dark:text-white">{order.status}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-white/50">Escrow</p>
                              <p className={cn('mt-1 font-semibold', order.escrow === 'RELEASED' ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300')}>
                                {order.escrow}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-white/50">Date</p>
                              <p className="mt-1 font-semibold text-gray-900 dark:text-white text-xs">{order.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
