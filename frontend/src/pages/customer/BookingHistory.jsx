import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, CheckCircle2, Clock, MapPin, Download, MoreVertical, Star } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';

// Mock data removed

export const BookingHistory = () => {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my');
      return res.data;
    }
  });

  if (isLoading) return <PageLoader text="Loading booking history..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            My Bookings
          </h1>
          <p className="text-textPrimary/60">View and manage all your past and upcoming reservations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Upcoming Events</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">
                {bookings.filter(b => b.status === 'ACCEPTED' && new Date(b.eventDate) >= new Date()).length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Spent</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">LKR {bookings.reduce((acc, b) => acc + Number(b.service?.price || b.package?.price || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input 
              type="text" 
              placeholder="Search bookings by vendor or ID..." 
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
                <th className="p-4 pl-6">Booking Details</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {bookings.map((booking) => (
                <tr key={booking.bookingId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-textPrimary">
                          {booking.service ? booking.service.serviceName : booking.package ? booking.package.packageName : 'Unknown'}
                        </span>
                        <span className="text-xs text-textPrimary/50">ID: {booking.bookingId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-textPrimary/80">{new Date(booking.eventDate).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-textPrimary">LKR {booking.service ? Number(booking.service.price).toFixed(2) : booking.package ? Number(booking.package.price).toFixed(2) : '0.00'}
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border border-current/20 flex items-center gap-1.5 w-fit",
                      booking.status === 'ACCEPTED' ? "text-primary bg-primary/10" : 
                      booking.status === 'COMPLETED' ? "text-green-400 bg-green-400/10" :
                      booking.status === 'REJECTED' ? "text-red-400 bg-red-400/10" :
                      "text-yellow-400 bg-yellow-400/10"
                    )}>
                      {booking.status === 'ACCEPTED' && <Clock className="w-3.5 h-3.5" />}
                      {booking.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    {booking.status === 'COMPLETED' && (
                      <Link to={`/customer/review-submission?vendorId=${booking.package?.vendorId || booking.service?.vendorId || ''}&serviceId=${booking.serviceId || ''}&productId=${booking.packageId || ''}`}>
                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Review
                        </Button>
                      </Link>
                    )}
                    {booking.status === 'ACCEPTED' && (
                      <Link to={`/customer/payment-page?bookingId=${booking.bookingId}&amount=${booking.service ? booking.service.price : booking.package ? booking.package.price : 0}&item=Booking%20Payment`}>
                        <Button size="sm" className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          Pay Now
                        </Button>
                      </Link>
                    )}
                    <Link to={`/customer/booking-details`}>
                      <button className="p-2 text-textPrimary/40 hover:text-textPrimary hover:bg-white/10 rounded-lg transition-colors" title="View Details">
                        <MoreVertical className="w-5 h-5"/>
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-textPrimary/60">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

