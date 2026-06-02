import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, CheckCircle2, Clock, MapPin, Download, MoreVertical, Star } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

const BOOKINGS = [
  { id: 'BKG-8492', vendor: 'Lumiere Photography', type: 'Photography', date: 'Oct 14, 2026', status: 'Confirmed', amount: '$3,200', rating: null },
  { id: 'BKG-8491', vendor: 'Grand Azure Resort', type: 'Venue', date: 'Oct 14, 2026', status: 'Confirmed', amount: '$4,500', rating: null },
  { id: 'BKG-8100', vendor: 'Bloom Catering', type: 'Catering', date: 'Sep 20, 2026', status: 'Completed', amount: '$2,100', rating: 5 },
  { id: 'BKG-7944', vendor: 'DJ Velocity', type: 'Entertainment', date: 'Aug 15, 2026', status: 'Cancelled', amount: '$800', rating: null },
];

export const BookingHistory = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            My Bookings
          </h1>
          <p className="text-white/60">View and manage all your past and upcoming reservations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Upcoming Events</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">2</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Total Spent</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">$10,600</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search bookings by vendor or ID..." 
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
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
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
                <th className="p-4 pl-6">Booking Details</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {BOOKINGS.map((booking, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{booking.vendor}</span>
                        <span className="text-xs text-white/50">{booking.type} • {booking.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white/80">{booking.date}</td>
                  <td className="p-4 font-medium text-white">{booking.amount}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border border-current/20 flex items-center gap-1.5 w-fit",
                      booking.status === 'Confirmed' ? "text-primary bg-primary/10" : 
                      booking.status === 'Completed' ? "text-green-400 bg-green-400/10" :
                      "text-white/40 bg-white/5"
                    )}>
                      {booking.status === 'Confirmed' && <Clock className="w-3.5 h-3.5" />}
                      {booking.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    {booking.status === 'Completed' && !booking.rating && (
                      <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Review
                      </Button>
                    )}
                    {booking.status === 'Completed' && booking.rating && (
                      <span className="inline-flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
                        {booking.rating} <Star className="w-3 h-3 fill-current" />
                      </span>
                    )}
                    <Link to={`/customer/booking-details`}>
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="View Details">
                        <MoreVertical className="w-5 h-5"/>
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
