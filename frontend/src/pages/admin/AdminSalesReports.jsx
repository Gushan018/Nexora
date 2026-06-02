import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, BarChart3, Users, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const AdminSalesReports = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-primary" />
            Platform Sales & Conversion
          </h1>
          <p className="text-white/60">Analyze booking volume, average order values, and funnel metrics.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
          </select>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4"/>}>Export Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Total Transactions</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">12,450</span>
            </div>
            <p className="text-xs text-green-400 font-bold mt-2">+5.2% vs last month</p>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Average Order Value (AOV)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">$1,850</span>
            </div>
            <p className="text-xs text-green-400 font-bold mt-2">+2.1% vs last month</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-accent/5 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-white/80 mb-2">Gross Merchandise Value (GMV)</h3>
                <span className="text-5xl font-bold text-white">$23.0M</span>
                <p className="text-sm text-accent font-bold mt-2">Total value of all bookings processed</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <BarChart3 className="w-8 h-8 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Funnel */}
        <Card className="border-white/5 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>From search to completed booking</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center px-8">
            <div className="space-y-4 w-full max-w-xs mx-auto">
              
              <div className="text-center relative">
                <div className="bg-primary/20 border border-primary/30 py-3 rounded-lg w-full relative z-10">
                  <span className="font-bold text-white text-sm">Site Visitors (1.2M)</span>
                </div>
              </div>

              <div className="flex justify-center text-white/20"><TrendingUp className="w-4 h-4 rotate-180"/></div>

              <div className="text-center relative">
                <div className="bg-primary/30 border border-primary/40 py-3 rounded-lg w-[85%] mx-auto relative z-10">
                  <span className="font-bold text-white text-sm">Viewed Vendor (850K)</span>
                </div>
                <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-white/50">71%</span>
              </div>

              <div className="flex justify-center text-white/20"><TrendingUp className="w-4 h-4 rotate-180"/></div>

              <div className="text-center relative">
                <div className="bg-primary/50 border border-primary/50 py-3 rounded-lg w-[40%] mx-auto relative z-10">
                  <span className="font-bold text-white text-sm">Sent Request (42K)</span>
                </div>
                <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-white/50">4.9%</span>
              </div>

              <div className="flex justify-center text-white/20"><TrendingUp className="w-4 h-4 rotate-180"/></div>

              <div className="text-center relative">
                <div className="bg-primary border border-primary py-3 rounded-lg w-[25%] mx-auto relative z-10 shadow-[0_0_20px_rgba(91,124,250,0.4)]">
                  <span className="font-bold text-white text-sm">Booked (12.4K)</span>
                </div>
                <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">29.5%</span>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="lg:col-span-2 border-white/5 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>GMV contribution by service type</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pt-0">
            <div className="space-y-6 mt-4">
              {[
                { category: 'Venues & Spaces', gmv: '$12.5M', percent: 54, color: 'bg-primary' },
                { category: 'Catering & Food', gmv: '$5.2M', percent: 22, color: 'bg-accent' },
                { category: 'Photography & Video', gmv: '$3.1M', percent: 13, color: 'bg-yellow-500' },
                { category: 'Entertainment / DJs', gmv: '$1.5M', percent: 6, color: 'bg-green-400' },
                { category: 'Decor & Rentals', gmv: '$0.7M', percent: 5, color: 'bg-white/20' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-medium text-white">{item.category}</span>
                    <div className="text-right">
                      <span className="text-white font-bold block">{item.gmv}</span>
                      <span className="text-xs text-white/40">{item.percent}% of total</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full", item.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
