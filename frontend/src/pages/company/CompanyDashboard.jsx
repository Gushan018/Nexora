import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, Calendar, Package, DollarSign, CheckCircle2, Clock, 
  Plus, Activity, MessageSquare, FileText, TrendingUp, ShieldCheck, PieChart, ArrowUpRight, Percent, Receipt, Wallet
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ['companyVendorStats'],
    queryFn: async () => {
      try {
        const res = await api.get('/vendors/stats');
        return res.data;
      } catch (err) {
        return null;
      }
    },
  });

  const { data: packagesData } = useQuery({
    queryKey: ['companyPackages'],
    queryFn: async () => {
      try {
        const res = await api.get('/packages/my');
        return res.data;
      } catch (err) {
        return [];
      }
    },
  });

  const packagesList = Array.isArray(packagesData) ? packagesData : packagesData?.packages || [];
  const statsObj = statsResponse?.stats || {};
  const recentRequests = statsResponse?.recentRequests || [];
  const revenueChartFromDb = statsResponse?.revenueChart || [];

  const totalPackages = packagesList.length || statsObj.totalPackages || 0;
  const totalBookings = statsObj.totalBookings ?? 0;
  const pendingRequests = statsObj.pendingBookings ?? 0;
  const completedEvents = statsObj.completedBookings ?? 0;
  const acceptedBookings = statsObj.activeBookings ?? (completedEvents + pendingRequests);
  const cancelledBookings = 0;

  const grossRevenue = statsObj.totalRevenue ?? 0;
  const platformFee = statsObj.platformFee ?? Math.round(grossRevenue * 0.10);
  const netEarnings = statsObj.netEarnings ?? Math.round(grossRevenue - platformFee);
  
  const avgBookingValue = totalBookings > 0 ? (grossRevenue / totalBookings) : 0;
  const acceptanceRate = totalBookings > 0 ? Math.round(((acceptedBookings + completedEvents) / totalBookings) * 100) : 100;

  // Monthly Revenue Chart Data calculation
  const monthsMap = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
  const currentMonthIdx = new Date().getMonth();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (revenueChartFromDb && revenueChartFromDb.length > 0) {
    revenueChartFromDb.forEach(item => {
      if (item.label || item.month) {
        const mKey = item.label || item.month;
        if (monthsMap[mKey] !== undefined) {
          monthsMap[mKey] = Number(item.revenue || item.amount || 0);
        }
      }
    });
  }

  const chartData = monthNames.slice(Math.max(0, currentMonthIdx - 5), currentMonthIdx + 1).map(m => ({
    month: m,
    Revenue: monthsMap[m] || 0,
    Bookings: totalBookings || 0
  }));

  const stats = [
    { title: 'Gross Revenue', value: `LKR ${grossRevenue.toLocaleString()}`, badge: 'Total', icon: <TrendingUp className="w-5 h-5 text-amber-500 dark:text-amber-400" /> },
    { title: 'Platform Fee (10%)', value: `-LKR ${platformFee.toLocaleString()}`, badge: '10% Fee', icon: <Percent className="w-5 h-5 text-amber-500 dark:text-amber-400" /> },
    { title: 'Net Earnings', value: `LKR ${netEarnings.toLocaleString()}`, badge: 'Take-Home', icon: <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> },
    { title: 'Total Bookings', value: totalBookings.toString(), badge: `${acceptanceRate}% rate`, icon: <Calendar className="w-5 h-5 text-amber-500 dark:text-amber-400" /> },
    { title: 'Total Packages', value: totalPackages.toString(), badge: 'Active', icon: <Package className="w-5 h-5 text-amber-500 dark:text-amber-400" /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#151D2F] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white font-bold mb-2">Company Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium">
              Manage your event packages, review revenue analytics, and track booking performance
            </p>
          </div>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl border-none shadow-md shrink-0" 
            onClick={() => navigate('/company/package-management')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Package
          </Button>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {stat.badge}
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{stat.value}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Middle Section: Interactive Revenue Chart & Payment & Platform Fee Card */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Revenue Analytics Interactive Recharts Graph */}
        <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F] rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-[340px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                Revenue Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time revenue performance over recent months</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Net</p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">LKR {netEarnings.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff' }}
                  formatter={(value) => [`LKR ${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment & Platform Fee Card */}
        <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                Payment & Platform Fee Card
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Financial breakdown, net balance, and standard platform fees.</p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Gross Total Revenue</span>
                  <span className="font-bold text-slate-900 dark:text-white">LKR {grossRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Platform Fee (10%)
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">- LKR {platformFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Net Take-Home Earnings</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">LKR {netEarnings.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-500 dark:text-amber-400 shrink-0" />
                <div className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed">
                  Platform fees automatically support escrow protection, booking verification, and customer dispute resolution.
                </div>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-6 justify-center py-2.5 rounded-xl border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
            onClick={() => navigate('/vendor/withdrawals')}
          >
            Manage Payout Account & Withdrawals
          </Button>
        </div>
      </div>

      {/* Bottom Section: Booking Analyse Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Booking Analyse Card */}
        <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              Booking Analyse Card
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pipeline Summary</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Accepted</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{acceptedBookings}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{pendingRequests}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{completedEvents}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Cancelled</p>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{cancelledBookings}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300">Acceptance Rate</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{acceptanceRate}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${acceptanceRate}%` }} />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10">
              <span>Average Booking Value:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">LKR {avgBookingValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl border-none shadow-md" onClick={() => navigate('/company/package-management')}>
              Add New Package
            </Button>
            <Button variant="outline" className="w-full justify-center py-2.5 rounded-xl border-slate-300 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5" onClick={() => navigate('/vendor/booking-management')}>
              View All Bookings
            </Button>
            <Button variant="outline" className="w-full justify-center py-2.5 rounded-xl border-slate-300 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5" onClick={() => navigate('/customer/chat-inbox')}>
              Check Messages
            </Button>
            <Button variant="outline" className="w-full justify-center py-2.5 rounded-xl border-slate-300 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5" onClick={() => navigate('/vendor/vendor-booking-analytics')}>
              Generate Analytics Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
