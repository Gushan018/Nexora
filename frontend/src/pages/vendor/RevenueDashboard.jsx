import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Download, Calendar, Activity, ArrowUpRight, Clock, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';

export const RevenueDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['vendor-revenue'],
    queryFn: async () => {
      const res = await api.get('/vendors/payments');
      return res.data;
    }
  });

  const transactions = data?.recentTransactions || [];
  const rawRevenue = transactions.reduce((sum, t) => {
    const val = parseFloat((t.amount || '0').replace(/[^0-9.]/g, ''));
    return sum + val;
  }, 0);

  const grossRevenue = rawRevenue;
  const platformFees = Math.round(grossRevenue * 0.05);
  const netEarnings = grossRevenue - platformFees;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-green-400" />
            Revenue Dashboard
          </h1>
          <p className="text-slate-600">Analyze your earnings, platform fees, and financial health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        {/* Gross Revenue */}
        <Card className="border-green-500/20 bg-green-500/5 md:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Gross Revenue (YTD)</h3>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-5xl font-bold text-slate-900">
                  {isLoading ? '...' : `LKR ${grossRevenue.toLocaleString()}`}
                </span>
                <p className="text-sm text-green-400 flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4" /> Live from bookings & orders
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
              <span className="text-3xl font-bold text-slate-800">
                {isLoading ? '...' : `-LKR ${platformFees.toLocaleString()}`}
              </span>
              <p className="text-xs text-slate-500 mt-1">Flat 5% Event Nest Fee</p>
            </div>
          </CardContent>
        </Card>

        {/* Net Earnings */}
        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Net Earnings</h3>
            <div className="flex flex-col justify-end h-full">
              <span className="text-3xl font-bold text-slate-900">
                {isLoading ? '...' : `LKR ${netEarnings.toLocaleString()}`}
              </span>
              <p className="text-xs text-slate-500 mt-1">Available to withdraw</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payouts / Transactions */}
        <Card className="lg:col-span-3 border-slate-200">
          <CardHeader>
            <CardTitle>Recent Transactions & Escrow Ledger</CardTitle>
            <CardDescription>Direct client bookings & payouts from DB</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No payment transactions recorded yet.</div>
            ) : (
              <div className="divide-y divide-slate-200">
                {transactions.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{t.package} ({t.customer})</p>
                        <p className="text-xs text-slate-500">{t.date} • {t.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{t.amount}</p>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        t.status === 'Completed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
