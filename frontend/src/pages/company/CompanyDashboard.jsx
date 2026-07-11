import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, Calendar, Package, DollarSign, ArrowUpRight, Users, CheckCircle2, Clock, Plus, Star, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: vendorData, isLoading } = useQuery({
    queryKey: ['companyDashboardData'],
    queryFn: async () => {
      try {
        const res = await api.get('/vendor/profile');
        return res.data;
      } catch (err) {
        return null;
      }
    },
  });

  const { data: bookingsData } = useQuery({
    queryKey: ['companyBookings'],
    queryFn: async () => {
      try {
        const res = await api.get('/bookings/my');
        return res.data;
      } catch (err) {
        return [];
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
  const bookingsList = Array.isArray(bookingsData) ? bookingsData : bookingsData?.bookings || [];

  const activeBookings = bookingsList.filter(b => b.status === 'ACCEPTED' || b.status === 'PENDING').length;
  const completedEvents = bookingsList.filter(b => b.status === 'COMPLETED').length;
  const totalRevenue = bookingsList.reduce((sum, b) => {
    const price = Number(b.package?.price || b.service?.price || 0);
    return sum + price;
  }, 0);

  const stats = [
    { title: 'Total Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, note: 'Real-time event earnings', icon: <DollarSign className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Event Packages', value: packagesList.length, note: `${packagesList.filter(p => p.isApproved).length} published`, icon: <Package className="w-5 h-5 text-amber-400" />, color: 'bg-amber-500/10 border-amber-500/20' },
    { title: 'Active Events', value: activeBookings, note: 'Weddings & Galas in progress', icon: <Calendar className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Completed Galas', value: completedEvents, note: 'Successfully organized events', icon: <CheckCircle2 className="w-5 h-5 text-purple-400" />, color: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
              Event Management Company
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            {user?.businessName || vendorData?.businessName || 'Event Company Dashboard'}
          </h1>
          <p className="text-gray-600 dark:text-white/60">Organize full-service event packages, client proposals, sub-vendor allocations, and gala execution timelines.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/company/inquiries')}>Client Inquiries</Button>
          <Button onClick={() => navigate('/company/package-management')} leftIcon={<Plus className="w-4 h-4" />}>
            Create Event Package
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className={`border ${stat.color} bg-white dark:bg-surface`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600 dark:text-white/60">{stat.title}</span>
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-white/50 mt-2">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Event Packages & Upcoming Execution Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Published Event Packages */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-gray-200 dark:border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Full-Service Event Packages
                </CardTitle>
                <CardDescription>Weddings, Corporate Galas, Anniversaries, & Private Events</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/company/package-management')}>
                View All ({packagesList.length})
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {packagesList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packagesList.slice(0, 4).map((pkg) => (
                    <div key={pkg.packageId || pkg.id} className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 bg-gray-50 dark:bg-surface/80 hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                          {pkg.category || 'Event Package'}
                        </span>
                        <span className="text-lg font-bold text-primary">LKR {Number(pkg.price || 0).toLocaleString()}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base mb-2">{pkg.packageName}</h4>
                      <p className="text-xs text-gray-600 dark:text-white/60 line-clamp-2 mb-4">{pkg.description || 'Full-service event coordination package.'}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/50 pt-3 border-t border-gray-200 dark:border-white/5">
                        <span>Max {pkg.maxGuests || 250} Guests</span>
                        <span className="font-medium text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Approved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-bold text-gray-900 dark:text-white">No Event Packages Published</p>
                  <p className="text-xs text-gray-500 dark:text-white/60 mt-1 mb-4">Create your first all-inclusive wedding or corporate event package.</p>
                  <Button size="sm" onClick={() => navigate('/company/package-management')}>
                    Create Package
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Event Timeline & Inquiries */}
        <div className="space-y-6">
          <Card className="border-gray-200 dark:border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  Upcoming Event Schedule
                </CardTitle>
                <CardDescription>Confirmed Galas & Celebrations</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/company/calendar')}>
                Full Calendar
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              {bookingsList.length > 0 ? (
                bookingsList.slice(0, 3).map((b) => (
                  <div key={b.bookingId} className="rounded-xl border border-gray-200 dark:border-white/5 p-4 bg-gray-50 dark:bg-surface/80">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-primary">BK-{b.bookingId}</span>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {b.status}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {b.package?.packageName || b.service?.serviceName || 'Custom Event'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/50 mt-1">
                      Client: {b.customer?.name || 'Client'} • {b.eventDate ? new Date(b.eventDate).toLocaleDateString() : 'Upcoming'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-gray-500 dark:text-white/50">
                  No upcoming events scheduled.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
