import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ShoppingBag, Clock, Heart, ChevronRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const CustomerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl glass-card border border-primary/20 p-8 sm:p-10"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Welcome back, <span className="text-gradient">Sarah</span> 👋
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mb-8">
            Your upcoming wedding is only 45 days away! You have 2 pending vendor tasks and 1 item remaining in your checklist.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="px-8 shadow-lg shadow-primary/20">
              View Event Plan
            </Button>
            <Button variant="outline" size="lg" className="px-8 bg-surface/50">
              Browse Vendors
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Calendar className="w-6 h-6 text-primary" />}
          title="Upcoming Events"
          value="2"
          label="Next: Oct 24, 2026"
          delay={0.1}
        />
        <StatCard 
          icon={<ShoppingBag className="w-6 h-6 text-accent" />}
          title="Active Orders"
          value="4"
          label="2 arriving this week"
          delay={0.2}
        />
        <StatCard 
          icon={<Clock className="w-6 h-6 text-secondary" />}
          title="Pending Bookings"
          value="1"
          label="Awaiting vendor approval"
          delay={0.3}
        />
        <StatCard 
          icon={<Heart className="w-6 h-6 text-red-400" />}
          title="Wishlisted"
          value="12"
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
                <TimelineItem 
                  time="10:00 AM" 
                  title="Venue Decoration Starts" 
                  subtitle="Vendor: Bloom Designs"
                  status="confirmed"
                />
                <TimelineItem 
                  time="12:30 PM" 
                  title="Catering Delivery" 
                  subtitle="Vendor: Luxe Dining"
                  status="pending"
                />
                <TimelineItem 
                  time="03:00 PM" 
                  title="DJ Setup" 
                  subtitle="Vendor: SoundWave"
                  status="upcoming"
                  isLast
                />
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
                    {[
                      { id: '#ORD-092', item: 'Gold Cutlery Set x 100', status: 'Shipped', amount: '$1,200.00', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                      { id: '#ORD-087', item: 'Table Linens', status: 'Delivered', amount: '$345.50', color: 'text-green-400', bg: 'bg-green-400/10' },
                      { id: '#ORD-084', item: 'LED Uplights', status: 'Processing', amount: '$450.00', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                    ].map((order, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-2 font-medium text-white">{order.id}</td>
                        <td className="py-4 text-white/70">{order.item}</td>
                        <td className="py-4">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border border-current/20", order.bg, order.color)}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2 font-medium text-white">{order.amount}</td>
                      </tr>
                    ))}
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
              <div className="p-4 rounded-xl bg-surface/50 border border-red-500/20">
                <h4 className="font-medium text-white mb-1">Confirm Catering Menu</h4>
                <p className="text-sm text-white/60 mb-3">Luxe Dining needs menu confirmation by Oct 15.</p>
                <Button size="sm" className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30">Review Menu</Button>
              </div>
              <div className="p-4 rounded-xl bg-surface/50 border border-red-500/20">
                <h4 className="font-medium text-white mb-1">Finalize Guest List</h4>
                <p className="text-sm text-white/60 mb-3">You have 12 unassigned seats.</p>
                <Button size="sm" className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30">Manage Guests</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Vendors */}
          <Card>
            <CardHeader>
              <CardTitle>Suggested for You</CardTitle>
              <CardDescription>Based on your wedding theme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {[
                { name: 'Elite Photography', type: 'Photographer', rating: 4.9 },
                { name: 'Harmony Strings', type: 'Live Music', rating: 5.0 },
              ].map((vendor, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <p className="text-sm font-medium text-white">{vendor.name}</p>
                      <p className="text-xs text-white/50">{vendor.type} • ⭐ {vendor.rating}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                </div>
              ))}
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
    transition={{ delay }}
  >
    <Card className="hover:border-primary/30 transition-colors duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
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
