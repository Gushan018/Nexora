import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, CheckCircle2, Clock, MoreVertical, ShieldCheck, Loader2, AlertCircle, XCircle, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

const STATUS_OPTIONS = ['All', 'PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'];
const STATUS_STYLES = {
  ACCEPTED: 'text-primary bg-primary/10 border-primary/20',
  COMPLETED: 'text-green-400 bg-green-400/10 border-green-400/20',
  PENDING: 'text-accent bg-accent/10 border-accent/20',
  REJECTED: 'text-red-400 bg-red-400/10 border-red-400/20',
  CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/bookings/vendor');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingBookingId(bookingId);
      const response = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      const updatedBooking = response.data?.booking;
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, ...(updatedBooking || {}), status: newStatus } : b));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      console.error(err);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const filteredBookings = useMemo(() => bookings.filter(booking => {
    const query = searchTerm.trim().toLowerCase();
    if (statusFilter !== 'All' && booking.status !== statusFilter) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [
      booking.customer?.name,
      booking.service?.serviceName,
      booking.package?.packageName,
      `BKG-${booking.bookingId}`,
      booking.location,
    ].some(value => value?.toString().toLowerCase().includes(query));
  }), [bookings, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            Booking Management
          </h1>
          <p className="text-textPrimary/60">Manage your active pipeline and past events.</p>
        </div>
        <Link to="/vendor/vendor-booking-calendar">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4"/>}>View Calendar</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Upcoming Events</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">
                {bookings.filter(b => b.status === 'ACCEPTED').length}
              </span>
              <span className="text-sm text-textPrimary/40 mb-1">Confirmed</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Pending Requests</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">
                {bookings.filter(b => b.status === 'PENDING').length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Completed</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">
                {bookings.filter(b => b.status === 'COMPLETED').length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Value</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">
                LKR {bookings.reduce((sum, b) => { try { return sum + parseFloat(b.service?.price || b.package?.price || 0); } catch { return sum; } }, 0).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <div className="relative max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
              <input
                type="text"
                placeholder="Search by customer, service, package, location, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface/50 border border-white/10 rounded-xl px-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option} value={option} className="bg-surface text-textPrimary">
                  {option === 'All' ? 'All Statuses' : option}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={fetchBookings} leftIcon={<RefreshCcw className="w-4 h-4" />}>
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-textPrimary/40 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center text-red-400 gap-3 text-center">
              <AlertCircle className="w-8 h-8" />
              <p>{error}</p>
              <Button onClick={fetchBookings} variant="outline" size="sm">Try Again</Button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-textPrimary/40 gap-3 text-center">
              <Calendar className="w-12 h-12 opacity-20" />
              <p>No bookings found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
                  <th className="p-4 pl-6">Client & Event</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Service/Package</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredBookings.map((booking) => (
                  <tr key={booking.bookingId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-textPrimary">{booking.customer?.name || 'Unknown Customer'}</span>
                        <span className="text-xs text-textPrimary/50">ID: BKG-{booking.bookingId}</span>
                        {booking.customer?.contactNumber && (
                          <span className="text-xs text-textPrimary/40">{booking.customer.contactNumber}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-textPrimary/80">{booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 text-textPrimary/60">
                      {booking.service?.serviceName || booking.package?.packageName || 'N/A'}
                    </td>
                    <td className="p-4 font-medium text-textPrimary/80">
                      LKR {(() => { try { return parseFloat(booking.service?.price || booking.package?.price || 0).toLocaleString(); } catch { return '0'; } })()}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border border-current/20 flex items-center gap-1.5 w-fit",
                        booking.status === 'ACCEPTED' ? "text-primary bg-primary/10" : 
                        booking.status === 'COMPLETED' ? "text-green-400 bg-green-400/10" :
                        booking.status === 'PENDING' ? "text-accent bg-accent/10" :
                        "text-red-400 bg-red-400/10"
                      )}>
                        {booking.status === 'ACCEPTED' && <Clock className="w-3.5 h-3.5" />}
                        {booking.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {booking.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {booking.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      {booking.status === 'PENDING' && (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 border-none h-8"
                            onClick={() => handleStatusUpdate(booking.bookingId, 'ACCEPTED')}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-400 border-red-400/30 hover:bg-red-400/10 h-8"
                            onClick={() => handleStatusUpdate(booking.bookingId, 'REJECTED')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {booking.status === 'ACCEPTED' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8"
                          onClick={() => handleStatusUpdate(booking.bookingId, 'COMPLETED')}
                        >
                          Mark Completed
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};
