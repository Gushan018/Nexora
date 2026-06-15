import React from 'react';
import { motion } from 'framer-motion';
import { Plus, CalendarDays, MapPin, Users, Activity, Clock, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';

export const EventDashboard = () => {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my');
      return res.data;
    }
  });

  if (isLoading) return <PageLoader text="Loading your events..." />;
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Events</h1>
          <p className="text-slate-600">Manage all your upcoming and past events.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bookings.length === 0 ? (
          <div className="col-span-2 text-center text-slate-600 py-12">No events found. Start by exploring the vendor directory to book a service or package!</div>
        ) : (
          bookings.map((booking, i) => {
            const name = booking.service?.serviceName || booking.package?.packageName || 'My Event';
            const type = booking.service?.category?.name || 'Event';
            const amount = Number(booking.service?.price || booking.package?.price || 0);

            return (
              <motion.div
                key={booking.bookingId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden hover:border-primary/30 transition-colors group">
                  <div className="h-40 w-full relative overflow-hidden">
                    <img src={booking.package?.imageUrl || booking.service?.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80'} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-slate-900 border border-slate-300">
                        {type}
                      </span>
                      <span className="px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-xs font-medium text-slate-900 border border-slate-300">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{name}</h2>
                        <div className="space-y-1.5 text-sm text-slate-600">
                          <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/> {new Date(booking.eventDate).toLocaleDateString()}</p>
                          <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {booking.location || 'Location not specified'}</p>
                          <p className="flex items-center gap-2"><Users className="w-4 h-4"/> Vendor: {booking.service?.vendor?.businessName || booking.package?.vendor?.businessName || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Placeholder */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-800 font-medium">Status</span>
                        <span className="text-primary font-bold">{booking.status === 'ACCEPTED' ? 'Vendor Approved (Pending Payment)' : booking.status === 'PENDING' ? 'Awaiting Vendor' : booking.status}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface border border-slate-200 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: booking.status === 'ACCEPTED' ? '50%' : booking.status === 'PENDING' ? '10%' : '100%' }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-premium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-surface/30 border border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                        <p className="text-lg font-bold text-slate-900">LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Notes</p>
                        <p className="text-sm text-slate-800 truncate">{booking.notes || 'No specific notes'}</p>
                      </div>
                    </div>

                    <Link to={`/customer/booking-details?id=${booking.bookingId}`}>
                      <Button className="w-full" variant="outline" rightIcon={<ArrowRight className="w-4 h-4"/>}>
                        View Booking Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  );
};
