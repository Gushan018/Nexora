import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Map, Briefcase, TrendingUp, Filter, MapPin, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

export const VendorBookingAnalytics = () => {
  const { data: bookingsData, isLoading, refetch } = useQuery({
    queryKey: ['vendorBookingAnalytics'],
    queryFn: async () => {
      try {
        const res = await api.get('/bookings/my');
        return res.data;
      } catch (err) {
        return [];
      }
    },
  });

  const bookingsList = Array.isArray(bookingsData) ? bookingsData : bookingsData?.bookings || [];

  // Calculate real DB metrics
  const totalBookings = bookingsList.length;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthCounts = Array(12).fill(0);

  let totalLeadDays = 0;
  let leadCount = 0;
  const locationCounts = {};

  bookingsList.forEach((b) => {
    const d = b.eventDate ? new Date(b.eventDate) : new Date(b.bookingDate);
    if (!isNaN(d.getTime())) {
      monthCounts[d.getMonth()] += 1;
    }

    if (b.eventDate && b.createdAt) {
      const created = new Date(b.createdAt);
      const event = new Date(b.eventDate);
      const diffDays = Math.max(0, Math.round((event.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
      if (diffDays > 0) {
        totalLeadDays += diffDays;
        leadCount += 1;
      }
    }

    const loc = b.location || b.eventLocation || 'Colombo, Sri Lanka';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  const maxMonthIdx = monthCounts.indexOf(Math.max(...monthCounts));
  const busiestMonth = totalBookings > 0 ? monthNames[maxMonthIdx] : 'N/A';
  const busiestCount = totalBookings > 0 ? monthCounts[maxMonthIdx] : 0;

  const avgLeadMonths = leadCount > 0 ? (totalLeadDays / leadCount / 30).toFixed(1) : '1.5';

  const maxSeasonalCount = Math.max(...monthCounts, 1);
  const seasonalData = monthCounts.map((count, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    count,
    heightPct: totalBookings > 0 ? Math.max(10, Math.round((count / maxSeasonalCount) * 100)) : 10,
  }));

  const locationList = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);

  if (locationList.length === 0) {
    locationList.push({ location: 'Colombo, Sri Lanka', count: totalBookings });
  }

  const handleDownloadReport = () => {
    const headers = ['Booking ID', 'Customer', 'Service/Package', 'Date', 'Status'];
    const rows = bookingsList.map(b => [
      `BK-${b.bookingId || 'N/A'}`,
      b.customer?.name || 'Customer',
      b.package?.packageName || b.service?.serviceName || 'Service',
      b.eventDate ? new Date(b.eventDate).toLocaleDateString() : 'N/A',
      b.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Booking_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CalendarDays className="w-7 h-7 text-primary" />
            Booking Analytics
          </h1>
          <p className="text-gray-600 dark:text-white/60">Deep dive into your real event volume, seasonality, and client demographics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} leftIcon={<Filter className="w-4 h-4" />}>
            Refresh DB Stats
          </Button>
          <Button onClick={handleDownloadReport} leftIcon={<Download className="w-4 h-4" />}>
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Total Bookings</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : totalBookings}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
              <p className="text-xs text-gray-500 dark:text-white/50">Real-time database bookings count</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Busiest Month</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : busiestMonth}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
              <p className="text-xs text-gray-500 dark:text-white/50">{busiestCount} bookings scheduled</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Avg. Booking Lead Time</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{avgLeadMonths} <span className="text-lg text-gray-500 dark:text-white/50 font-normal">months</span></h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
              <p className="text-xs text-gray-500 dark:text-white/50">Clients book in advance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seasonality Chart */}
        <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface h-[360px] flex flex-col">
          <CardHeader>
            <CardTitle>Booking Seasonality</CardTitle>
            <CardDescription>Number of events per month from PostgreSQL</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-end gap-2 p-6 pt-0 border-t border-gray-200 dark:border-white/5 mt-4">
            {seasonalData.map((item, i) => (
              <div key={item.month} className="flex-1 flex flex-col justify-end items-center group relative">
                <div className="absolute -top-8 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count} events
                </div>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${item.heightPct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                  className="w-full bg-primary/80 hover:bg-primary rounded-t transition-colors min-h-[6px]"
                />
                <span className="text-xs text-gray-500 dark:text-white/50 mt-2">{item.month}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface h-[360px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Top Event Locations
            </CardTitle>
            <CardDescription>Where your services are most requested</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 border-t border-gray-200 dark:border-white/5 mt-4 space-y-4 flex-1 overflow-y-auto">
            {locationList.map((item, idx) => {
              const pct = totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                    <span>{item.location}</span>
                    <span className="font-bold text-primary">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

