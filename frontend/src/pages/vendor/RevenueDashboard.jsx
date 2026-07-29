import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Download, Calendar, Activity, ArrowUpRight, Clock, CreditCard, Percent, Receipt, Wallet } from 'lucide-react';
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
  
  const grossRevenue = data?.totalRevenue !== undefined && data?.totalRevenue !== null
    ? Number(data.totalRevenue)
    : transactions.reduce((sum, t) => {
        const cleaned = String(t.amount || '0').replace(/Rs\.?/gi, '').replace(/LKR/gi, '').replace(/,/g, '').trim();
        const val = parseFloat(cleaned) || 0;
        return sum + val;
      }, 0);

  const platformFees = data?.platformFee !== undefined && data?.platformFee !== null
    ? Number(data.platformFee)
    : Math.round(grossRevenue * 0.10);

  const netEarnings = data?.netEarnings !== undefined && data?.netEarnings !== null
    ? Number(data.netEarnings)
    : Math.round(grossRevenue - platformFees);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-amber-500 dark:text-amber-400" />
            Revenue Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300">Analyze your earnings, platform fees, and financial health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        {/* Gross Revenue */}
        <Card className="border-amber-500/20 bg-amber-500/5 md:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gross Revenue (YTD)</h3>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                  {isLoading ? '...' : `LKR ${grossRevenue.toLocaleString()}`}
                </span>
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4" /> Live from bookings & orders
                </p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Fees */}
        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>Platform Fees</span>
              <Percent className="w-4 h-4 text-amber-500" />
            </h3>
            <div className="flex flex-col justify-end h-full mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400">
                {isLoading ? '...' : `-LKR ${platformFees.toLocaleString()}`}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Standard 10% Platform Fee</p>
            </div>
          </CardContent>
        </Card>

        {/* Net Earnings */}
        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>Net Earnings</span>
              <Receipt className="w-4 h-4 text-emerald-500" />
            </h3>
            <div className="flex flex-col justify-end h-full mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {isLoading ? '...' : `LKR ${netEarnings.toLocaleString()}`}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Available to withdraw</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payouts / Transactions */}
        <Card className="lg:col-span-3 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Recent Transactions & Escrow Ledger</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">Direct client bookings & payouts from DB</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">No payment transactions recorded yet.</div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {transactions.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t.package} ({t.customer})</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.date} • {t.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{String(t.amount || '').replace('Rs.', 'LKR')}</p>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        t.status === 'Completed' ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
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
