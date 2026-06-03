import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, Star, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const VendorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-white/60">Welcome back, here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Download Report</Button>
          <Button>Create Service</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="LKR 12,450" 
          trend="+15%" 
          trendUp={true}
          icon={<DollarSign className="w-5 h-5 text-primary" />} 
        />
        <StatCard 
          title="Active Bookings" 
          value="24" 
          trend="+5%" 
          trendUp={true}
          icon={<Calendar className="w-5 h-5 text-accent" />} 
        />
        <StatCard 
          title="Profile Views" 
          value="1,245" 
          trend="-2%" 
          trendUp={false}
          icon={<Users className="w-5 h-5 text-secondary" />} 
        />
        <StatCard 
          title="Average Rating" 
          value="4.9" 
          trend="+0.1" 
          trendUp={true}
          icon={<Star className="w-5 h-5 text-yellow-500" />} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts/Main Data */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Your earnings over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-full flex items-center justify-center border-t border-white/5">
              <span className="text-white/40">Chart visualization goes here (Recharts)</span>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar/Secondary Data */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>You have 3 pending booking requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">JD</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">John Doe</p>
                      <p className="text-xs text-white/50">Wedding Photography</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Review</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendUp, icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/60">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className={cn(
          "text-sm font-medium mb-1 flex items-center gap-1",
          trendUp ? "text-green-400" : "text-red-400"
        )}>
          {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
          {trend}
        </div>
      </div>
    </CardContent>
  </Card>
);
