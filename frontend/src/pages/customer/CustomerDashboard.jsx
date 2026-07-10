import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ShoppingBag, Clock, Heart, ChevronRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { useQuery } from '@tanstack/react-query';

const PROMO_SLIDES = [
  {
    id: 1,
    image: '/images/promo_catering.png',
    title: 'Summer Event Extravaganza',
    subtitle: 'Get up to 20% off on all catering packages this month.'
  },
  {
    id: 2,
    image: '/images/promo_wedding_decor.png',
    title: 'Flash Sale: Wedding Decor',
    subtitle: 'Book your decor vendors today and receive a complimentary lighting setup.'
  },
  {
    id: 3,
    image: '/images/promo_dj_event.png',
    title: 'Exclusive Vendor Discounts',
    subtitle: 'Top-rated DJs and bands are offering special weekend rates.'
  }
];

const PromoSlideshow = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden group shadow-2xl border border-slate-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={PROMO_SLIDES[currentSlide].image} 
            alt={PROMO_SLIDES[currentSlide].title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 sm:p-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-2"
            >
              {PROMO_SLIDES[currentSlide].title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-lg max-w-2xl"
            >
              {PROMO_SLIDES[currentSlide].subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {PROMO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              currentSlide === idx ? "w-8 bg-primary" : "bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['customerDashboardStats'],
    queryFn: async () => {
      const res = await api.get('/customers/dashboard-stats');
      return res.data;
    }
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative overflow-hidden rounded-3xl bg-surface/40 border border-slate-300 p-8 sm:p-12 backdrop-blur-xl shadow-2xl group"
      >
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-primary/20 blur-[120px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 blur-[100px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10 flex flex-col items-start">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Welcome to your Dashboard, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{user?.name ? user.name.split(' ')[0] : 'Guest'}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 text-lg max-w-xl mb-10 leading-relaxed font-medium"
          >
            Manage your event bookings, discover exclusive packages, and track your wishlist all in one place. Let's make your next event unforgettable.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="px-8 bg-primary hover:bg-primary-hover transition-all text-white shadow-lg shadow-primary/30 font-bold" onClick={() => navigate('/customer/event-packages')}>
              Explore Packages
            </Button>
            <Button variant="outline" size="lg" className="px-8 bg-surface border-slate-300 hover:border-slate-400 hover:bg-surface/80 transition-all text-slate-900 shadow-sm font-bold" onClick={() => navigate('/customer/marketplace')}>
              Shop Marketplace
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Promotions Slideshow */}
      <PromoSlideshow />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Calendar className="w-6 h-6 text-primary" />}
          title="Upcoming Events"
          value={isLoading ? '...' : stats?.upcomingEvents || 0}
          label="Confirmed bookings"
          delay={0.1}
        />
        <StatCard 
          icon={<ShoppingBag className="w-6 h-6 text-accent" />}
          title="Active Orders"
          value={isLoading ? '...' : stats?.activeOrders || 0}
          label="Processing/Shipped"
          delay={0.2}
        />
        <StatCard 
          icon={<Clock className="w-6 h-6 text-secondary" />}
          title="Pending Bookings"
          value={isLoading ? '...' : stats?.pendingBookings || 0}
          label="Awaiting vendor approval"
          delay={0.3}
        />
        <StatCard 
          icon={<Heart className="w-6 h-6 text-red-400" />}
          title="Wishlisted"
          value={isLoading ? '...' : stats?.wishlisted || 0}
          label="Items saved for later"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Event Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Event Timeline</CardTitle>
                <CardDescription>
                  {stats?.upcomingBookingsList?.length > 0 
                    ? `Your schedule for upcoming events` 
                    : 'Upcoming event schedules will appear here.'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats?.upcomingBookingsList?.length === 0 ? (
                  <p className="text-slate-500 text-sm py-4">No upcoming events scheduled.</p>
                ) : (
                  stats?.upcomingBookingsList?.map((booking, index) => (
                    <TimelineItem 
                      key={booking.bookingId}
                      time={new Date(booking.eventDate).toLocaleDateString()} 
                      title={booking.service?.serviceName || booking.package?.packageName || 'Event Booking'} 
                      subtitle={`Vendor: ${booking.service?.vendor?.businessName || booking.package?.vendor?.businessName || 'Unknown'}`}
                      status={booking.status === 'ACCEPTED' ? 'confirmed' : 'pending'}
                      isLast={index === stats.upcomingBookingsList.length - 1}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders Table Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Marketplace Orders</CardTitle>
              <CardDescription>Track your purchased supplies and decor.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                      <th className="pb-3 pl-2">Order ID</th>
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {stats?.recentOrders?.length === 0 ? (
                      <tr><td colSpan="4" className="py-8 text-slate-500 text-center">No recent orders found.</td></tr>
                    ) : (
                      stats?.recentOrders?.map((order) => (
                        <tr key={order.orderId} className="border-b border-slate-200 hover:bg-white/[0.03] transition-colors group">
                          <td className="py-4 pl-2 font-medium text-slate-800 group-hover:text-slate-900 transition-colors">#ORD-{order.orderId}</td>
                          <td className="py-4 text-slate-600 group-hover:text-slate-800 transition-colors">
                            {order.orderItems?.[0]?.product?.productName || 'Items'} 
                            {order.orderItems?.length > 1 ? ` (+${order.orderItems.length - 1} more)` : ''}
                          </td>
                          <td className="py-4">
                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border border-current/20", 
                              order.status === 'DELIVERED' ? 'bg-green-400/10 text-green-400' :
                              order.status === 'SHIPPED' ? 'bg-blue-400/10 text-blue-400' :
                              'bg-yellow-400/10 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]'
                            )}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-right pr-2 font-bold text-slate-900">LKR {Number(order.totalAmount).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          
          {/* Action Required */}
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-red-400">Action Required</CardTitle>
              <CardDescription className="text-red-400/70">Tasks needing your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {stats?.actionRequired?.length === 0 ? (
                <div className="p-4 rounded-xl bg-surface/50 border border-slate-300">
                  <p className="text-sm text-slate-600">You're all caught up! No actions required.</p>
                </div>
              ) : (
                stats?.actionRequired?.map(action => (
                  <div key={action.bookingId} className="p-4 rounded-xl bg-surface/50 border border-red-500/20">
                    <h4 className="font-medium text-slate-900 mb-1">Payment Required</h4>
                    <p className="text-sm text-slate-600 mb-3">{action.service?.vendor?.businessName || action.package?.vendor?.businessName} accepted your booking.</p>
                    <Button size="sm" className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30" onClick={() => navigate(`/customer/payment-page?bookingId=${action.bookingId}&amount=${action.service?.price || action.package?.price || 0}&item=Booking`)}>
                      Pay Now
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recommended Vendors */}
          <Card>
            <CardHeader>
              <CardTitle>Suggested for You</CardTitle>
              <CardDescription>Based on your wedding theme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {stats?.recommendedVendors?.length === 0 ? (
                <p className="text-slate-500 text-sm">No suggestions at this time.</p>
              ) : (
                stats?.recommendedVendors?.map((vendor, i) => (
                  <div key={vendor.vendorId} onClick={() => navigate(`/customer/event-packages`)} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-slate-200 hover:border-slate-300 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{vendor.businessName}</p>
                        <p className="text-xs text-slate-500">{vendor.vendorType} â€¢ Recommended</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring" }}
  >
    <Card className="hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] bg-surface/40 backdrop-blur-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-300 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-4xl font-black text-slate-900 mb-1 drop-shadow-sm">{value}</h3>
          <p className="text-sm font-bold text-slate-800 mb-1 tracking-wide">{title}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const TimelineItem = ({ time, title, subtitle, status, isLast }) => (
  <div className="flex gap-4 relative">
    {!isLast && (
      <div className="absolute top-8 left-[11px] bottom-[-24px] w-px bg-slate-200" />
    )}
    <div className="flex flex-col items-center mt-1">
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center border-2",
        status === 'confirmed' ? "border-green-500 bg-green-500/20" :
        status === 'pending' ? "border-yellow-500 bg-yellow-500/20" :
        "border-slate-400 bg-surface"
      )}>
        {status === 'confirmed' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
        {status === 'pending' && <Clock className="w-3.5 h-3.5 text-yellow-500" />}
      </div>
    </div>
    <div className="pb-6">
      <div className="text-xs font-semibold text-primary mb-1">{time}</div>
      <h4 className="text-base font-medium text-slate-900 mb-0.5">{title}</h4>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </div>
  </div>
);
