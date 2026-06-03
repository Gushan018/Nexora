import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Map, Briefcase, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const VendorBookingAnalytics = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-primary" />
            Booking Analytics
          </h1>
          <p className="text-white/60">Deep dive into your event volume, seasonality, and client demographics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Advanced Filters</Button>
          <Button>Download PDF Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        <Card className="border-white/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/50 mb-1">Total Bookings YTD</p>
                <h3 className="text-3xl font-bold text-white">84</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-white/40"><span className="text-green-400 font-bold">+12%</span> vs last year</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/50 mb-1">Busiest Month</p>
                <h3 className="text-3xl font-bold text-white">October</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-white/40">18 bookings scheduled</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/50 mb-1">Avg. Booking Lead Time</p>
                <h3 className="text-3xl font-bold text-white">4.2 <span className="text-lg text-white/50 font-normal">months</span></h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-white/40">Clients book you well in advance</p>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Seasonality Chart */}
        <Card className="border-white/5 h-[350px] flex flex-col">
          <CardHeader>
            <CardTitle>Booking Seasonality</CardTitle>
            <CardDescription>Number of events per month</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-end gap-2 p-6 pt-0 border-t border-white/5 mt-4">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => {
              const height = [20, 25, 40, 60, 80, 95, 85, 90, 75, 100, 60, 40][i];
              return (
                <div key={month} className="flex-1 flex flex-col justify-end items-center group relative">
                  <div className="absolute -top-8 bg-white text-background text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}%
                  </div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="w-full bg-primary/20 group-hover:bg-primary rounded-t-sm transition-colors"
                  />
                  <span className="text-[10px] text-white/40 mt-2">{month}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Location Heatmap / Top Areas */}
        <Card className="border-white/5 h-[350px] flex flex-col">
          <CardHeader>
            <CardTitle>Top Event Locations</CardTitle>
            <CardDescription>Where your services are most requested</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex">
            <div className="w-1/2 p-6 border-r border-white/5 space-y-4">
              {[
                { city: 'Colombo, Sri Lanka', count: 42, pct: 50 },
                { city: 'Santa Monica, CA', count: 21, pct: 25 },
                { city: 'Kandy, Sri Lanka', count: 12, pct: 14 },
                { city: 'Other', count: 9, pct: 11 },
              ].map((loc, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/80">{loc.city}</span>
                    <span className="text-white font-bold">{loc.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${loc.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/2 flex items-center justify-center bg-surface/30 opacity-50 relative overflow-hidden">
              <Map className="w-32 h-32 text-white/10 absolute" />
              <p className="text-xs text-white/40 z-10 text-center px-4">Interactive Map visualization goes here</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
