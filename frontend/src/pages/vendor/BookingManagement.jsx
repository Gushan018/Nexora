import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, CheckCircle2, Clock, MapPin, MoreVertical, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

const BOOKINGS = [
  { id: 'BKG-8492', customer: 'Sarah Jenkins', eventType: 'Wedding Reception', date: 'Oct 14, 2026', status: 'Confirmed', amount: 'LKR 3,200', paid: 'LKR 640' },
  { id: 'BKG-8491', customer: 'David Osei', eventType: 'Corporate Gala', date: 'Oct 22, 2026', status: 'Confirmed', amount: 'LKR 1,500', paid: 'LKR 1,500' },
  { id: 'BKG-8100', customer: 'Emma Watson', eventType: 'Engagement Party', date: 'Sep 20, 2026', status: 'Completed', amount: 'LKR 2,100', paid: 'LKR 2,100' },
  { id: 'BKG-7944', customer: 'Liam Hemsworth', eventType: 'Birthday Bash', date: 'Aug 15, 2026', status: 'Cancelled', amount: 'LKR 800', paid: 'LKR 160' },
];

export const BookingManagement = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            Booking Management
          </h1>
          <p className="text-white/60">Manage your active pipeline and past events.</p>
        </div>
        <Link to="/vendor/vendor-booking-calendar">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4"/>}>View Calendar</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Upcoming Events</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">12</span>
              <span className="text-sm text-white/40 mb-1">Next 30 Days</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Pending Balance</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">LKR 14,500</span>
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
              placeholder="Search by customer name or ID..." 
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
                <th className="p-4 pl-6">Client & Event</th>
                <th className="p-4">Date</th>
                <th className="p-4">Financials</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {BOOKINGS.map((booking, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{booking.customer}</span>
                      <span className="text-xs text-white/50">{booking.eventType} • {booking.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/80">{booking.date}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{booking.amount}</span>
                      <span className={cn(
                        "text-xs",
                        booking.paid === booking.amount ? "text-green-400" : "text-primary"
                      )}>
                        {booking.paid === booking.amount ? 'Fully Paid' : `${booking.paid} Paid`}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border border-current/20 flex items-center gap-1.5 w-fit",
                      booking.status === 'Confirmed' ? "text-primary bg-primary/10" : 
                      booking.status === 'Completed' ? "text-green-400 bg-green-400/10" :
                      "text-red-400 bg-red-400/10"
                    )}>
                      {booking.status === 'Confirmed' && <Clock className="w-3.5 h-3.5" />}
                      {booking.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Manage
                    </Button>
                    <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Actions">
                      <MoreVertical className="w-5 h-5"/>
                    </button>
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
