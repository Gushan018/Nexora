import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, Star, TrendingUp, Users, Briefcase, Package, Loader2, AlertCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

const REVENUE_DATA = [
  { day: '01 Oct', amount: 4500 },
  { day: '05 Oct', amount: 5200 },
  { day: '10 Oct', amount: 4800 },
  { day: '15 Oct', amount: 6100 },
  { day: '20 Oct', amount: 5900 },
  { day: '25 Oct', amount: 7200 },
  { day: '30 Oct', amount: 8450 },
];

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
      <div className="h-[60vh] flex flex-col items-center justify-center text-textPrimary/40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg">Preparing your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-red-400 gap-4 text-center p-6">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg">{error}</p>
        <Button onClick={fetchStats} variant="outline">Try Again</Button>
      </div>
    );
  }

  const { stats, recentRequests } = data;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-600">Welcome back, here's what's happening with your business today.</p>
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
            <div className="absolute right-0 mt-2 w-40 rounded-lg bg-surface border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-10">
              <button
                onClick={() => handleDownloadReport('json')}
                disabled={downloadLoading}
                className="w-full text-left px-4 py-2 text-sm text-textPrimary hover:bg-primary/10 transition-colors first:rounded-t-lg"
              >
                Download as JSON
              </button>
              <button
                onClick={() => handleDownloadReport('csv')}
                disabled={downloadLoading}
                className="w-full text-left px-4 py-2 text-sm text-textPrimary hover:bg-primary/10 transition-colors last:rounded-b-lg border-t border-white/5"
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
          value={`LKR ${stats.totalRevenue.toLocaleString()}`} 
          trend="+15%" 
          trendUp={true}
          icon={<DollarSign className="w-5 h-5 text-primary" />} 
        />
        <StatCard 
          title="Active Bookings" 
          value={stats.activeBookings.toString()} 
          trend={`+${stats.pendingBookings} pending`} 
          trendUp={true}
          icon={<Calendar className="w-5 h-5 text-accent" />} 
        />
        <StatCard 
          title="Services & Packages" 
          value={(stats.totalServices + stats.totalPackages).toString()} 
          trend={`${stats.totalServices} Svcs / ${stats.totalPackages} Pkgs`} 
          trendUp={true}
          icon={<Briefcase className="w-5 h-5 text-primary" />} 
        />
        <StatCard 
          title="Completed" 
          value={stats.completedBookings.toString()} 
          trend="Total" 
          trendUp={true}
          icon={<Star className="w-5 h-5 text-yellow-500" />} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts/Main Data */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="h-[450px] overflow-hidden">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Your earnings over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-full flex items-center justify-center border-t border-slate-200">
              <span className="text-slate-500">Chart visualization goes here (Recharts)</span>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar/Secondary Data */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>You have {stats.pendingBookings} pending booking requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {recentRequests?.length ? recentRequests.map(request => (
                <div key={request.bookingId} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {request.customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="max-w-[120px]">
                      <p className="text-sm font-medium text-textPrimary truncate">{request.customer.name}</p>
                      <p className="text-xs text-textPrimary/50 truncate">
                        {request.service?.serviceName || request.package?.packageName}
                      </p>
                    </div>
                  </div>
                  <Link to="/vendor/booking-management">
                    <Button variant="ghost" size="sm">Review</Button>
                  </Link>
                </div>
              )) : (
                <p className="text-sm text-gray-500 dark:text-white/40 text-center py-4">No pending requests</p>
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-300">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <div className={cn(
          "text-xs font-medium mb-1 flex items-center gap-1",
          trendUp ? "text-green-400" : "text-red-400"
        )}>
          {trend}
        </div>
      </div>
    </CardContent>
  </Card>
);
