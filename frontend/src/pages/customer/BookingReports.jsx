import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, Activity, Building, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const BookingReports = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            Booking Analytics
          </h1>
          <p className="text-white/60">Track your event service spending and vendor distribution.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4"/>}>2026</Button>
          <Button leftIcon={<Download className="w-4 h-4"/>}>Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Total Service Spend</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">$10,600</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Active Vendors</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">4</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Events Hosted</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">2</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Cancellation Rate</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">20%</span>
              <span className="text-sm text-white/40 mb-1">1 Booking</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Simple Bar Chart Mock */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending Over Time (2026)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] flex items-end justify-between gap-2 border-b border-white/10 pb-2 relative">
              
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none">
                {[4000, 3000, 2000, 1000, 0].map(val => (
                  <div key={val} className="w-full border-t border-white/5 flex items-start">
                    <span className="text-[10px] text-white/30 -mt-2.5 bg-card pr-2">${val}</span>
                  </div>
                ))}
              </div>

              {/* Bars */}
              {[
                { month: 'Jan', val: 0 },
                { month: 'Feb', val: 0 },
                { month: 'Mar', val: 0 },
                { month: 'Apr', val: 0 },
                { month: 'May', val: 0 },
                { month: 'Jun', val: 0 },
                { month: 'Jul', val: 1200 },
                { month: 'Aug', val: 800 },
                { month: 'Sep', val: 2100 },
                { month: 'Oct', val: 7700 }, // Peak
                { month: 'Nov', val: 0 },
                { month: 'Dec', val: 0 },
              ].map((data, i) => {
                const heightPercent = (data.val / 8000) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 group">
                    <div 
                      className="w-full max-w-[40px] bg-primary/40 rounded-t-sm group-hover:bg-primary transition-colors relative"
                      style={{ height: `${Math.max(heightPercent, 1)}%` }}
                    >
                      {data.val > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-white/10 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
                          ${data.val}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2 px-1 text-xs text-white/50">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m} className="flex-1 text-center">{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                { name: 'Venues', icon: Building, spent: 4500, percent: 42, color: 'text-primary' },
                { name: 'Photography & Video', icon: Activity, spent: 3200, percent: 30, color: 'text-accent' },
                { name: 'Catering', icon: Users, spent: 2100, percent: 20, color: 'text-green-500' },
                { name: 'Entertainment', icon: Clock, spent: 800, percent: 8, color: 'text-yellow-500' },
              ].map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-white">
                      <cat.icon className={cn("w-4 h-4", cat.color)} /> {cat.name}
                    </span>
                    <span className="font-bold text-white">${cat.spent}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", cat.color.replace('text-', 'bg-'))}
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Nexora Insights</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <p className="text-sm text-white/80 leading-relaxed">
              Based on your booking history, you allocate <strong className="text-white">42%</strong> of your budget to Venues. This is well within the platform average of 40-50% for similar event sizes.
            </p>
            <p className="text-sm text-white/80 leading-relaxed">
              You cancelled 1 booking (DJ Velocity) resulting in a loss of a non-refundable deposit. Consider finalizing your timeline before securing entertainment vendors to avoid overlapping schedules.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
