import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Download, Calendar, Activity, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const RevenueDashboard = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-green-400" />
            Revenue Dashboard
          </h1>
          <p className="text-slate-600">Analyze your earnings, taxes, and financial health.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-surface/50 border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
            <option>2026 (YTD)</option>
            <option>2025</option>
          </select>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4"/>}>Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        
        {/* Gross Revenue */}
        <Card className="border-green-500/20 bg-green-500/5 md:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Gross Revenue (YTD)</h3>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-5xl font-bold text-slate-900">LKR 142,500</span>
                <p className="text-sm text-green-400 flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4" /> +24% vs last year
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Fees */}
        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Platform Fees</h3>
            <div className="flex flex-col justify-end h-full">
              <span className="text-3xl font-bold text-slate-800">-LKR 7,125</span>
              <p className="text-xs text-slate-500 mt-1">Flat 5% Event Nest Fee</p>
            </div>
          </CardContent>
        </Card>

        {/* Net Earnings */}
        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Net Earnings</h3>
            <div className="flex flex-col justify-end h-full">
              <span className="text-3xl font-bold text-slate-900">LKR 135,375</span>
              <p className="text-xs text-slate-500 mt-1">Available to withdraw</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-slate-200 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Income over time</CardTitle>
            <CardDescription>Monthly breakdown of your earnings</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-slate-200 relative">
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-slate-300" />
              ))}
            </div>
            <div className="text-center z-10">
              <Activity className="w-16 h-16 text-green-400/20 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Recharts Line Graph</p>
              <p className="text-xs text-slate-400">Visualizing monthly MRR / ARR</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payouts */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
            <CardDescription>Transfers to your bank</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {[
                { date: 'Oct 01, 2026', amount: 'LKR 4,200.00', status: 'Cleared' },
                { date: 'Sep 15, 2026', amount: 'LKR 1,850.00', status: 'Cleared' },
                { date: 'Aug 30, 2026', amount: 'LKR 3,100.00', status: 'Cleared' },
                { date: 'Aug 15, 2026', amount: 'LKR 2,400.00', status: 'Cleared' },
                { date: 'Jul 30, 2026', amount: 'LKR 5,100.00', status: 'Cleared' },
              ].map((payout, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{payout.date}</p>
                      <p className="text-xs text-green-400">{payout.status}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">{payout.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
