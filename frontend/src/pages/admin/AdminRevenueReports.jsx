import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Download, PieChart, Activity, BarChart3, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const AdminRevenueReports = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-green-400" />
            Platform Revenue Reports
          </h1>
          <p className="text-white/60">Analyze Nexora's top-line revenue, commission splits, and payment processing fees.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
            <option>Year to Date</option>
            <option>Last Quarter</option>
            <option>Last 12 Months</option>
          </select>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4"/>}>Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        <Card className="md:col-span-2 border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Net Platform Revenue</h3>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-5xl font-bold text-white">LKR 1.24M</span>
                <p className="text-sm text-green-400 flex items-center gap-1 mt-2 font-bold">
                  <TrendingUp className="w-4 h-4" /> +18.2% vs last period
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Commission Revenue</h3>
            <div className="flex flex-col justify-end h-full">
              <span className="text-3xl font-bold text-white">LKR 842.5K</span>
              <p className="text-xs text-white/40 mt-1">From 5% transaction fees</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Subscription Revenue</h3>
            <div className="flex flex-col justify-end h-full">
              <span className="text-3xl font-bold text-white">LKR 397.5K</span>
              <p className="text-xs text-white/40 mt-1">From Pro Vendor Tiers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2 border-white/5 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Revenue Breakdown Over Time</CardTitle>
            <CardDescription>Commissions vs Subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-white/5 relative">
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-white/20" />
              ))}
            </div>
            <div className="text-center z-10">
              <Activity className="w-16 h-16 text-green-400/20 mx-auto mb-4" />
              <p className="text-white/40 font-medium">Recharts Stacked Bar Chart</p>
              <p className="text-xs text-white/30">Visualizing monthly revenue sources</p>
            </div>
          </CardContent>
        </Card>

        {/* Expenses / Processing Fees */}
        <Card className="border-white/5 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Operating Costs</CardTitle>
            <CardDescription>Major deductions from Gross GMV</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pt-0">
            <div className="space-y-6">
              {[
                { source: 'Stripe Processing Fees', amount: 'LKR 420,000', percent: 65, color: 'bg-red-400' },
                { source: 'Refunds Issued', amount: 'LKR 125,000', percent: 20, color: 'bg-yellow-500' },
                { source: 'Dispute Chargebacks', amount: 'LKR 45,000', percent: 10, color: 'bg-orange-500' },
                { source: 'Other Overheads', amount: 'LKR 15,000', percent: 5, color: 'bg-white/20' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{item.source}</span>
                    <span className="text-white font-medium">{item.amount}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
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
