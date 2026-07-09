import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, DollarSign, Activity, TrendingUp, AlertTriangle, UserCheck, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/dashboard/stats');
      setData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textPrimary/40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg">Loading dashboard...</p>
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-primary" />
            Platform Overview
          </h1>
          <p className="text-textPrimary/60">Global metrics and system health for the Nexora Marketplace.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchStats}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        <StatCard
          title="Total Registered Users"
          value={data?.totalUsers?.toLocaleString() || '0'}
          trend={`${data?.totalCustomers || 0} customers`}
          trendUp={true}
          icon={<Users className="w-5 h-5 text-primary" />}
          color="bg-primary"
        />
        <StatCard
          title="Total Vendors"
          value={data?.totalVendors?.toLocaleString() || '0'}
          trend={`${data?.totalVendors || 0} total`}
          trendUp={true}
          icon={<UserCheck className="w-5 h-5 text-accent" />}
          color="bg-accent"
        />
        <StatCard
          title="Total Bookings"
          value={data?.totalBookings?.toLocaleString() || '0'}
          trend={`${data?.pendingBookings || 0} pending`}
          trendUp={true}
          icon={<Activity className="w-5 h-5 text-green-400" />}
          color="bg-green-400"
        />
        <StatCard
          title="Total Revenue"
          value={`LKR ${(data?.totalRevenue || 0).toLocaleString()}`}
          trend={`${data?.completedBookings || 0} completed`}
          trendUp={true}
          icon={<DollarSign className="w-5 h-5 text-yellow-500" />}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-white/5 h-[450px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-white/5">
            <div className="grid grid-cols-2 gap-6 w-full p-6">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-bold text-primary">{data?.totalServices || 0}</p>
                <p className="text-sm text-textPrimary/60 mt-1">Total Services</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-bold text-accent">{data?.totalProducts || 0}</p>
                <p className="text-sm text-textPrimary/60 mt-1">Total Products</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-bold text-green-400">{data?.completedBookings || 0}</p>
                <p className="text-sm text-textPrimary/60 mt-1">Completed Bookings</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-bold text-yellow-500">{data?.pendingBookings || 0}</p>
                <p className="text-sm text-textPrimary/60 mt-1">Pending Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/5">
            <CardHeader>
              <CardTitle>Pending Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors">
                  <div>
                    <h4 className="text-sm font-medium text-textPrimary">Total Vendors</h4>
                    <p className="text-xs text-textPrimary/40">Registered on the platform</p>
                  </div>
                  <span className="px-2 py-1 bg-primary/20 text-primary font-bold text-xs rounded-full">{data?.totalVendors || 0}</span>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors">
                  <div>
                    <h4 className="text-sm font-medium text-textPrimary">Pending Bookings</h4>
                    <p className="text-xs text-textPrimary/40">Awaiting vendor response</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 font-bold text-xs rounded-full">{data?.pendingBookings || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendUp, icon, color }) => (
  <Card className="border-white/5 overflow-hidden relative group">
    <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity", color)} />
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-textPrimary/60">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-surface/80 flex items-center justify-center border border-white/10 backdrop-blur-md">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-textPrimary">{value}</div>
        <div className={cn(
          "text-sm font-medium mb-1 flex items-center gap-1",
          trendUp ? "text-green-400" : "text-red-400"
        )}>
          {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
          {trend}
        </div>
      </div>
    </CardContent>
  </Card>
);
