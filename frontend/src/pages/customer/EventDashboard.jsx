import React from 'react';
import { motion } from 'framer-motion';
import { Plus, CalendarDays, MapPin, Users, Activity, Clock, Settings, ArrowRight, CheckCircle2, ListOrdered, Hourglass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';
import { cn } from '../../utils/cn';

export const EventDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('ALL');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my');
      return res.data;
    }
  });

  const filteredBookings = React.useMemo(() => {
    if (activeTab === 'ALL') return bookings;
    if (activeTab === 'PENDING') return bookings.filter(b => b.status === 'PENDING');
    if (activeTab === 'UPCOMING') return bookings.filter(b => b.status === 'ACCEPTED');
    if (activeTab === 'COMPLETED') return bookings.filter(b => b.status === 'COMPLETED');
    return bookings;
  }, [bookings, activeTab]);

  const tabs = [
    { id: 'ALL', label: 'All Events', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'PENDING', label: 'Pending Approval', icon: <Hourglass className="w-4 h-4" /> },
    { id: 'UPCOMING', label: 'Upcoming (Accepted)', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'COMPLETED', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  if (isLoading) return <PageLoader text="Loading your events..." />;
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Events</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage all your upcoming and past events.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2",
              activeTab === tab.id 
                ? "bg-primary text-slate-950 font-bold shadow-sm border border-primary/20" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBookings.length === 0 ? (
          <div className="col-span-2 text-center text-slate-500 dark:text-slate-400 py-12">No events found for this status.</div>
        ) : (
          filteredBookings.map((booking, i) => {
            const name = booking.service?.serviceName || booking.package?.packageName || 'My Event';
            const type = booking.service?.category?.categoryName || booking.package?.category || 'Event Service';
            const amount = Number(booking.service?.price || booking.package?.price || 0);
            const vendorName = booking.service?.vendor?.businessName || booking.package?.vendor?.businessName || 'Vendor';
            const vendorLocation = booking.location || booking.service?.vendor?.location || booking.package?.vendor?.location || 'Location not specified';
            const imageUrl = booking.service?.imageUrl || booking.package?.images?.[0]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80';

            return (
              <motion.div
                key={booking.bookingId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden border-slate-200 dark:border-white/10 hover:border-primary/50 transition-colors group">
                  <div className="h-40 w-full relative overflow-hidden">
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white border border-slate-300/50 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                        {type}
                      </span>
                      <span className="px-3 py-1 bg-primary text-slate-950 backdrop-blur-md rounded-full text-xs font-bold border border-primary/30">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{name}</h2>
                        <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                          <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary"/> {new Date(booking.eventDate).toLocaleDateString()}</p>
                          <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary"/> {vendorLocation}</p>
                          <p className="flex items-center gap-2"><Users className="w-4 h-4 text-primary"/> Vendor: {vendorName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Status</span>
                        <span className="text-primary font-bold">
                          {booking.payment ? `Paid (${booking.payment.status.replace(/_/g, ' ')})` : booking.status === 'ACCEPTED' ? 'Vendor Approved (Pending Payment)' : booking.status === 'PENDING' ? 'Awaiting Vendor Approval' : booking.status}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: booking.payment ? '100%' : booking.status === 'ACCEPTED' ? '60%' : booking.status === 'PENDING' ? '20%' : '100%' }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Amount</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Booking ID</p>
                        <p className="text-sm font-bold text-primary">#{booking.bookingId}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link to={`/customer/booking-details?id=${booking.bookingId}`} className="flex-1">
                        <Button className="w-full text-slate-900 dark:text-white border-slate-300 dark:border-slate-700" variant="outline" rightIcon={<ArrowRight className="w-4 h-4"/>}>
                          View Booking Details
                        </Button>
                      </Link>
                      {booking.status === 'ACCEPTED' && !booking.payment && (
                        <Link to={`/customer/payment-page?bookingId=${booking.bookingId}&amount=${amount}&item=${encodeURIComponent('Booking: ' + name)}`}>
                          <Button className="bg-primary text-slate-950 font-bold hover:bg-primary/90">
                            Pay Now
                          </Button>
                        </Link>
                      )}
                    </div>
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

