import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, Calendar, Package, DollarSign, CheckCircle2, Clock, Plus, Activity, MessageSquare, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: vendorData } = useQuery({
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

  const totalPackages = packagesList.length;
  const totalBookings = bookingsList.length;
  const pendingRequests = bookingsList.filter(b => b.status === 'PENDING').length;
  const completedEvents = bookingsList.filter(b => b.status === 'COMPLETED').length;
  const totalRevenue = bookingsList.reduce((sum, b) => {
    const price = Number(b.package?.price || b.service?.price || 0);
    return sum + price;
  }, 0);

  const stats = [
    { title: 'Total Packages', value: totalPackages, badge: '+0%', icon: <Package className="w-5 h-5 text-amber-400" /> },
    { title: 'Total Bookings', value: totalBookings, badge: '+0%', icon: <Calendar className="w-5 h-5 text-amber-400" /> },
    { title: 'Pending Requests', value: pendingRequests, badge: '0', icon: <Clock className="w-5 h-5 text-amber-400" /> },
    { title: 'Completed Events', value: completedEvents, badge: '+0%', icon: <CheckCircle2 className="w-5 h-5 text-amber-400" /> },
    { title: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, badge: '+0%', icon: <DollarSign className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-slate-100">
      {/* Header Banner with High-Contrast Navy Glassmorphism */}
      <div className="bg-[#151D2F] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-3xl sm:text-4xl font-serif text-white font-bold mb-2 relative z-10">Dashboard</h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium relative z-10">Manage your events and track performance</p>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="border border-white/10 bg-[#151D2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {stat.badge}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs font-medium text-slate-400">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Middle Section: Revenue Analytics & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="border border-white/10 bg-[#151D2F] rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-[320px]">
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-1">Revenue Analytics</h3>
            <p className="text-xs text-slate-400">Monthly revenue overview</p>
          </div>
          <div className="flex-1 flex flex-col justify-end pt-6">
            <div className="h-44 border-b border-l border-white/10 flex items-end justify-between px-4 pb-2 relative">
              <span className="absolute top-2 left-2 text-[11px] text-slate-400 font-medium">Rs.4</span>
              <span className="absolute top-1/3 left-2 text-[11px] text-slate-400 font-medium">Rs.2</span>
              <span className="absolute bottom-2 left-2 text-[11px] text-slate-400 font-medium">Rs.0</span>
              <div className="w-full border-t-2 border-amber-400/80 my-auto"></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium pt-3 px-2">
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-[#151D2F] rounded-2xl p-6 shadow-lg min-h-[320px]">
          <h3 className="text-lg font-serif font-bold text-white mb-4">Upcoming Events</h3>
          {bookingsList.length > 0 ? (
            <div className="space-y-3">
              {bookingsList.slice(0, 3).map((b) => (
                <div key={b.bookingId} className="p-3 rounded-xl border border-white/10 bg-white/5">
                  <p className="font-bold text-white text-sm">{b.package?.packageName || b.service?.serviceName || 'Custom Gala'}</p>
                  <p className="text-xs text-slate-400">{b.customer?.name} • {b.eventDate ? new Date(b.eventDate).toLocaleDateString() : 'Upcoming'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              No upcoming events
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Recent Customer Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="border border-white/10 bg-[#151D2F] rounded-2xl p-6 shadow-lg min-h-[260px]">
          <h3 className="text-lg font-serif font-bold text-white mb-4">Recent Customer Activities</h3>
          <div className="flex h-36 items-center justify-center text-sm text-slate-400">
            No recent activities
          </div>
        </div>

        <div className="border border-white/10 bg-[#151D2F] rounded-2xl p-6 shadow-lg min-h-[260px]">
          <h3 className="text-lg font-serif font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl border-none shadow-md" onClick={() => navigate('/company/package-management')}>
              Add New Package
            </Button>
            <Button variant="outline" className="w-full justify-center py-2.5 rounded-xl border-white/10 text-white hover:bg-white/5" onClick={() => navigate('/vendor/booking-management')}>
              View All Bookings
            </Button>
            <Button variant="outline" className="w-full justify-center py-2.5 rounded-xl border-white/10 text-white hover:bg-white/5" onClick={() => navigate('/customer/chat-inbox')}>
              Check Messages
            </Button>
            <Button variant="outline" className="w-full justify-center py-2.5 rounded-xl border-white/10 text-white hover:bg-white/5" onClick={() => navigate('/vendor/vendor-booking-analytics')}>
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
