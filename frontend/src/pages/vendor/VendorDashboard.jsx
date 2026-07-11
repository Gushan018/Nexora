import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, Star, TrendingUp, Users, Briefcase, Package, Loader2, AlertCircle, Download, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

// Revenue chart dynamically powered by database data

export const VendorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors/stats');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (format = 'json') => {
    try {
      setDownloadLoading(true);
      const response = await api.get(`/vendors/report?format=${format}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vendor-report-${Date.now()}.${format === 'csv' ? 'csv' : 'json'}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg font-medium">Preparing your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-red-500 gap-4 text-center p-6">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg">{error}</p>
        <Button onClick={fetchStats} variant="outline">Try Again</Button>
      </div>
    );
  }

  const { stats = {}, recentRequests = [] } = data || {};

  const chartData = (data?.revenueChart && data.revenueChart.length > 0)
    ? data.revenueChart.map(item => ({
        label: item.month || item.day || item.label || '',
        amount: item.revenue !== undefined ? parseFloat(item.revenue) : (item.amount !== undefined ? parseFloat(item.amount) : 0)
      }))
    : [
        { label: 'May', amount: 0 },
        { label: 'Jun', amount: 0 },
        { label: 'Jul', amount: 0 },
        { label: 'Aug', amount: 0 },
        { label: 'Sep', amount: 0 },
        { label: 'Oct', amount: 0 },
      ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-slate-600 dark:text-slate-400">Welcome back, here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              disabled={downloadLoading}
            >
              {downloadLoading ? 'Downloading...' : 'Download Report'}
            </Button>
            <div className="absolute right-0 mt-2 w-40 rounded-lg bg-light-surface dark:bg-surface border border-slate-200 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-10">
              <button
                onClick={() => handleDownloadReport('json')}
                disabled={downloadLoading}
                className="w-full text-left px-4 py-2 text-sm text-slate-900 dark:text-white hover:bg-primary/10 transition-colors first:rounded-t-lg"
              >
                Download as JSON
              </button>
              <button
                onClick={() => handleDownloadReport('csv')}
                disabled={downloadLoading}
                className="w-full text-left px-4 py-2 text-sm text-slate-900 dark:text-white hover:bg-primary/10 transition-colors last:rounded-b-lg border-t border-slate-200 dark:border-white/5"
              >
                Download as CSV
              </button>
            </div>
          </div>
          <Link to="/vendor/create-service">
            <Button>Create Service</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`LKR ${(stats?.totalRevenue ?? 0).toLocaleString()}`} 
          trend="+15%" 
          trendUp={true}
          icon={<DollarSign className="w-5 h-5 text-primary" />} 
        />
        <StatCard 
          title="Active Bookings" 
          value={(stats?.activeBookings ?? stats?.totalBookings ?? 0).toString()} 
          trend={`+${stats?.pendingBookings ?? 0} pending`} 
          trendUp={true}
          icon={<Calendar className="w-5 h-5 text-yellow-500" />} 
        />
        <StatCard 
          title="Services & Packages" 
          value={((stats?.totalServices ?? 0) + (stats?.totalPackages ?? 0)).toString()} 
          trend={`${stats?.totalServices ?? 0} Svcs / ${stats?.totalPackages ?? 0} Pkgs`} 
          trendUp={true}
          icon={<Briefcase className="w-5 h-5 text-primary" />} 
        />
        <StatCard 
          title="Completed Bookings" 
          value={(stats?.completedBookings ?? 0).toString()} 
          trend="Total" 
          trendUp={true}
          icon={<Star className="w-5 h-5 text-green-500" />} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Interactive Recharts Graph */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="h-[420px]">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Your monthly revenue breakdown from the database.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenueVendor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(val) => `Rs.${val}`} />
                  <Tooltip 
                    formatter={(value) => [`LKR ${parseFloat(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }} 
                  />
                  <Area type="monotone" dataKey="amount" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenueVendor)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pending Booking Requests Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>You have {stats?.pendingBookings || 0} pending booking requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {recentRequests?.length ? recentRequests.map(request => (
                <div key={request.bookingId} className="flex items-center justify-between p-3 rounded-xl bg-light-surface dark:bg-surface/50 border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold">
                        {request.customer?.name?.split(' ').map(n => n[0]).join('') || 'C'}
                      </span>
                    </div>
                    <div className="max-w-[130px]">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{request.customer?.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {request.service?.serviceName || request.package?.packageName || 'Booking Request'}
                      </p>
                    </div>
                  </div>
                  <Link to="/vendor/booking-management">
                    <Button variant="ghost" size="sm">Review</Button>
                  </Link>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No pending requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendUp, icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
        <div className={cn(
          "text-xs font-semibold mb-1 flex items-center gap-1",
          trendUp ? "text-green-500" : "text-red-500"
        )}>
          {trend}
        </div>
      </div>
    </CardContent>
  </Card>
);
