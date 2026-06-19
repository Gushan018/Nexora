import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ShoppingBag, Clock, Heart, ChevronRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { useQuery } from '@tanstack/react-query';

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
        className="relative overflow-hidden rounded-3xl bg-surface/40 border border-white/10 p-8 sm:p-12 backdrop-blur-xl shadow-2xl group"
      >
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-primary/20 blur-[120px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 blur-[100px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight"
          >
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{user?.name ? user.name.split(' ')[0] : 'Guest'}</span> 👋
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-lg max-w-2xl mb-8 leading-relaxed"
          >
            {stats?.upcomingBookingsList?.length > 0 ? `Your next upcoming event is in ${Math.ceil((new Date(stats.upcomingBookingsList[0].eventDate) - new Date()) / (1000 * 60 * 60 * 24))} days! ` : 'You have no upcoming events. '}
            You have <span className="text-white font-bold">{stats?.actionRequired?.length || 0}</span> pending action{stats?.actionRequired?.length === 1 ? '' : 's'} and <span className="text-white font-bold">{stats?.wishlisted || 0}</span> wishlisted item{stats?.wishlisted === 1 ? '' : 's'}.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="px-8 shadow-[0_0_20px_rgba(124,58,237,0.3)] bg-primary hover:bg-primary-hover transition-all" onClick={() => navigate('/customer/booking-history')}>
              View Event Plan
            </Button>
            <Button variant="outline" size="lg" className="px-8 bg-surface/50 border-white/10 hover:bg-white/10 transition-all text-white" onClick={() => navigate('/customer/vendor-directory')}>
              Browse Vendors
            </Button>
          </motion.div>
        </div>
      </motion.div>

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
                <CardDescription>Your schedule for "Sarah's Dream Wedding"</CardDescription>
              </div>
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats?.upcomingBookingsList?.length === 0 ? (
                  <p className="text-white/50 text-sm py-4">No upcoming events scheduled.</p>
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
                    <tr className="border-b border-white/5 text-sm font-medium text-white/50">
                      <th className="pb-3 pl-2">Order ID</th>
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {stats?.recentOrders?.length === 0 ? (
                      <tr><td colSpan="4" className="py-8 text-white/50 text-center">No recent orders found.</td></tr>
                    ) : (
                      stats?.recentOrders?.map((order) => (
                        <tr key={order.orderId} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                          <td className="py-4 pl-2 font-medium text-white/80 group-hover:text-white transition-colors">#ORD-{order.orderId}</td>
                          <td className="py-4 text-white/60 group-hover:text-white/80 transition-colors">
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
                          <td className="py-4 text-right pr-2 font-bold text-white">LKR {Number(order.totalAmount).toFixed(2)}</td>
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
                <div className="p-4 rounded-xl bg-surface/50 border border-white/10">
                  <p className="text-sm text-white/60">You're all caught up! No actions required.</p>
                </div>
              ) : (
                stats?.actionRequired?.map(action => (
                  <div key={action.bookingId} className="p-4 rounded-xl bg-surface/50 border border-red-500/20">
                    <h4 className="font-medium text-white mb-1">Payment Required</h4>
                    <p className="text-sm text-white/60 mb-3">{action.service?.vendor?.businessName || action.package?.vendor?.businessName} accepted your booking.</p>
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
                <p className="text-white/50 text-sm">No suggestions at this time.</p>
              ) : (
                stats?.recommendedVendors?.map((vendor, i) => (
                  <div key={vendor.vendorId} onClick={() => navigate(`/customer/vendor-directory`)} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <p className="text-sm font-medium text-white">{vendor.businessName}</p>
                        <p className="text-xs text-white/50">{vendor.vendorType} • Recommended</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
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
    <Card className="hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)] bg-surface/40 backdrop-blur-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-4xl font-black text-white mb-1 drop-shadow-sm">{value}</h3>
          <p className="text-sm font-bold text-white/80 mb-1 tracking-wide">{title}</p>
          <p className="text-xs text-white/40">{label}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const TimelineItem = ({ time, title, subtitle, status, isLast }) => (
  <div className="flex gap-4 relative">
    {!isLast && (
      <div className="absolute top-8 left-[11px] bottom-[-24px] w-px bg-white/10" />
    )}
    <div className="flex flex-col items-center mt-1">
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center border-2",
        status === 'confirmed' ? "border-green-500 bg-green-500/20" :
        status === 'pending' ? "border-yellow-500 bg-yellow-500/20" :
        "border-white/20 bg-surface"
      )}>
        {status === 'confirmed' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
        {status === 'pending' && <Clock className="w-3.5 h-3.5 text-yellow-500" />}
      </div>
    </div>
    <div className="pb-6">
      <div className="text-xs font-semibold text-primary mb-1">{time}</div>
      <h4 className="text-base font-medium text-white mb-0.5">{title}</h4>
      <p className="text-sm text-white/60">{subtitle}</p>
    </div>
  </div>
);
