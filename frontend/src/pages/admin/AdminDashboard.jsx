import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Users, DollarSign, Activity, TrendingUp, AlertTriangle, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

const CHART_COLORS = ['#D4AF37', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B'];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard-stats');
      return res.data;
    },
  });

  const STATS = [
    { id: 's1', title: 'Total Users', value: isLoading ? '...' : `${data?.totalUsers ?? 0}`, trend: '14 Cust • 12 Vend', trendUp: true, icon: <Users className="w-5 h-5 text-primary" />, color: 'bg-primary' },
    { id: 's2', title: 'Active Vendors', value: isLoading ? '...' : `${data?.activeVendors ?? 0}`, trend: '100% Active', trendUp: true, icon: <UserCheck className="w-5 h-5 text-accent" />, color: 'bg-accent' },
    { id: 's3', title: 'Total Revenue', value: isLoading ? '...' : `LKR ${Number(data?.totalRevenue ?? 0).toLocaleString()}`, trend: 'Live DB', trendUp: true, icon: <DollarSign className="w-5 h-5 text-green-400" />, color: 'bg-green-400' },
    { id: 's4', title: 'Escrow Balance', value: isLoading ? '...' : `LKR ${Number(data?.escrowBalance ?? 0).toLocaleString()}`, trend: 'Escrow Held', trendUp: true, icon: <DollarSign className="w-5 h-5 text-yellow-500" />, color: 'bg-yellow-400' },
  ];

  const monthlyLabels = data?.monthlyIncome?.map((item) => item.label) || ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const monthlyData = data?.monthlyIncome?.length
    ? data.monthlyIncome.map((item) => Number(item.amount))
    : Array(12).fill(0);

  const servicesDistribution = data?.serviceRevenueMix?.length
    ? data.serviceRevenueMix.map((item, idx) => ({
        ...item,
        color: CHART_COLORS[idx % CHART_COLORS.length],
      }))
    : [
        { label: 'Catering', value: 35, color: '#D4AF37' },
        { label: 'Photography', value: 20, color: '#3B82F6' },
        { label: 'Entertainment', value: 18, color: '#10B981' },
        { label: 'Venues', value: 12, color: '#EC4899' },
        { label: 'Other', value: 15, color: '#8B5CF6' },
      ];

  const recentActivities = data?.recentActivities?.length
    ? data.recentActivities.map((activity) => {
        const date = new Date(activity.createdAt);
        const time = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          ...activity,
          time,
        };
      })
    : [
        { id: 'BKG-901', type: 'Booking', text: 'New booking from Sarah Customer — Premium Buffet', time: '2 hours ago' },
        { id: 'VND-802', type: 'Vendor', text: 'Vendor "Bloom Designs" registered', time: '5 hours ago' },
        { id: 'BKG-899', type: 'Booking', text: 'Booking completed — Live DJ Set', time: '1 day ago' },
      ];

  const handleExportCSV = () => {
    if (!data) return;
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Users', data.totalUsers],
      ['Active Vendors', data.activeVendors],
      ['Total Revenue', `LKR ${data.totalRevenue}`],
      ['Escrow Balance', `LKR ${data.escrowBalance}`],
      ...monthlyLabels.map((lbl, idx) => [`Revenue (${lbl})`, data.monthlyIncome?.[idx]?.amount || 0])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Admin_Overview_Stats_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-primary" />
            Admin Overview
          </h1>
          <p className="text-gray-600 dark:text-white/60">Key platform metrics, service distribution, and the latest admin activity.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
          <Button onClick={() => refetch()}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} trend={stat.trend} trendUp={stat.trendUp} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 sm:gap-6">
        <Card className="border-gray-200 dark:border-white/5 min-h-[460px] flex flex-col">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Monthly Income</CardTitle>
              <CardDescription>Platform commission earned each month.</CardDescription>
            </div>
            <select className="bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between border-t border-gray-200 dark:border-white/5 p-6">
            <div className="w-full flex-1 flex flex-col justify-end">
              {monthlyData.some((val) => val > 0) ? (
                <SimpleAreaChart data={monthlyData} labels={monthlyLabels} />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-gray-500 dark:text-white/60">No monthly revenue data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 flex flex-col">
          <Card className="border-gray-200 dark:border-white/5 min-h-[280px]">
            <CardHeader>
              <CardTitle>Service Revenue Mix</CardTitle>
              <CardDescription>Commission share by service category.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6">
              <div className="flex items-center justify-center shrink-0">
                {servicesDistribution.some((item) => item.value > 0) ? (
                  <DonutChart data={servicesDistribution} size={160} />
                ) : (
                  <div className="flex h-[160px] w-[160px] items-center justify-center text-sm text-gray-500 dark:text-white/60">No service mix data</div>
                )}
              </div>
              <div className="flex-1 space-y-2.5 w-full">
                {servicesDistribution.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-gray-900 dark:text-white truncate">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 dark:text-white/60 shrink-0">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-white/5 flex-1 min-h-[280px]">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest bookings and vendor sign-ups.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-surface/80 p-4 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0',
                        activity.type === 'Booking' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                      )}>
                        {activity.type === 'Booking' ? <Activity className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.text}</p>
                        <p className="text-xs text-gray-500 dark:text-white/50">{activity.type} • {activity.time}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] font-semibold text-gray-500 dark:text-white/60 bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-full shrink-0">{activity.type}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendUp, icon, color, onClick, clickable }) => (
  <Card 
    className={cn(
      "border-gray-200 dark:border-white/5 overflow-hidden relative group",
      clickable && "cursor-pointer hover:shadow-lg dark:hover:shadow-primary/20 transition-shadow"
    )}
    onClick={onClick}
  >
    <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity", color)} />
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-white/60">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-surface/80 flex items-center justify-center border border-gray-300 dark:border-white/10 backdrop-blur-md">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        {trend && (
          <div className={cn(
            "text-xs font-semibold mb-1 px-2 py-0.5 rounded-full flex items-center gap-1",
            trendUp ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
          )}>
            {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5 rotate-180" />}
            {trend}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Area chart with bottom X-axis month labels
const SimpleAreaChart = ({ data = [], labels = [] }) => {
  const w = 800;
  const h = 200;
  const max = Math.max(...data, 1);
  const points = data.map((d, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (d / max) * (h - 30)}`).join(' ');
  const poly = `0,${h} ${points} ${w},${h}`;
  return (
    <div className="w-full space-y-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44 overflow-visible">
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="url(#grad)" stroke="transparent" points={poly} />
        <polyline fill="none" stroke="#D4AF37" strokeWidth="3" points={points} strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <circle key={i} cx={(i / Math.max(data.length - 1, 1)) * w} cy={h - (d / max) * (h - 30)} r="4" fill="#D4AF37" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 dark:text-white/50 pt-1 border-t border-gray-200 dark:border-white/5">
        {labels.map((lbl, idx) => (
          <span key={idx} className="text-[11px] font-medium">{lbl}</span>
        ))}
      </div>
    </div>
  );
};

// SVG Donut Chart
const DonutChart = ({ data = [], size = 160 }) => {
  const total = data.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  const r = size / 2;
  const stroke = 22;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      {data.map((d, i) => {
        const start = acc / total;
        acc += d.value;
        const end = acc / total;
        const large = end - start > 0.5 ? 1 : 0;
        const a0 = 2 * Math.PI * start - Math.PI / 2;
        const a1 = 2 * Math.PI * end - Math.PI / 2;
        const x0 = r + (r - 2) * Math.cos(a0);
        const y0 = r + (r - 2) * Math.sin(a0);
        const x1 = r + (r - 2) * Math.cos(a1);
        const y1 = r + (r - 2) * Math.sin(a1);
        const path = `M ${r} ${r} L ${x0} ${y0} A ${r - 2} ${r - 2} 0 ${large} 1 ${x1} ${y1} Z`;
        return <path key={i} d={path} fill={d.color} opacity="0.9" />;
      })}
      <circle cx={r} cy={r} r={r - stroke} className="fill-white dark:fill-[#0F172A]" />
    </svg>
  );
};

