import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, CheckCircle2, Clock, MapPin, MoreVertical, ShieldAlert, FileText, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

export const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/bookings');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
      setError('Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesQuery = !query || [b.bookingId, b.customer, b.vendor].some(val => val?.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All Statuses' || b.status?.toUpperCase() === statusFilter.toUpperCase();
      return matchesQuery && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const disputed = bookings.filter(b => b.issue || b.status === 'DISPUTED').length;
    const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;
    const cancelRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : '0.0';
    
    const totalEscrowVal = bookings.reduce((sum, b) => {
      const valStr = b.value?.toString().replace(/[^0-9.]/g, '') || '0';
      return sum + (parseFloat(valStr) || 0);
    }, 0);

    return {
      total,
      disputed,
      cancelRate,
      escrowVal: totalEscrowVal > 0 ? `LKR ${totalEscrowVal.toLocaleString()}` : 'LKR 0'
    };
  }, [bookings]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            Global Booking Registry
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor all cross-platform bookings, mediate issues, and track deposits.</p>
        </div>
        <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchBookings}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Active Bookings</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Bookings Value</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.escrowVal}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Flagged / Disputed</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-red-500">{stats.disputed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Cancellation Rate</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.cancelRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Booking ID, Customer, or Vendor..." 
              className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 cursor-pointer"
            >
              <option>All Statuses</option>
              <option value="ACCEPTED">ACCEPTED / Confirmed</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="DISPUTED">DISPUTED</option>
            </select>
            <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchBookings}>Refresh</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 uppercase tracking-wider">
                <th className="p-4 pl-6">Booking Info</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Value</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No bookings found in database.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking, i) => (
                  <tr key={i} className={cn(
                    "border-b border-slate-200 dark:border-white/5 transition-colors group",
                    booking.issue ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                  )}>
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{booking.bookingId}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3"/> {booking.date}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-900 dark:text-white font-semibold">{booking.customer}</td>
                    <td className="p-4 text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                      {booking.vendor}
                      {booking.issue && <AlertTriangle className="w-4 h-4 text-red-500" title="Flagged / Disputed" />}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{booking.value}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit",
                        booking.status === 'ACCEPTED' || booking.status === 'COMPLETED' || booking.status === 'Confirmed' ? "text-green-500 bg-green-500/10 border-green-500/20" : 
                        booking.status === 'DISPUTED' || booking.status === 'CANCELLED' ? "text-red-500 bg-red-500/10 border-red-500/20" :
                        "text-yellow-600 bg-yellow-500/10 border-yellow-500/20"
                      )}>
                        {(booking.status === 'ACCEPTED' || booking.status === 'COMPLETED') && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {booking.status === 'DISPUTED' && <ShieldAlert className="w-3.5 h-3.5" />}
                        {booking.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
