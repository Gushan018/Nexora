import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Download, Activity, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const TRANSACTIONS = [
  { id: 'TRX-1092', date: 'Oct 24, 2026', desc: 'Booking Payout - Sarah Jenkins', amount: '+LKR 1,275.00', status: 'Completed', type: 'Credit' },
  { id: 'TRX-1091', date: 'Oct 23, 2026', desc: 'Platform Commission Fee (15%)', amount: '-LKR 225.00', status: 'Completed', type: 'Debit' },
  { id: 'TRX-1090', date: 'Oct 20, 2026', desc: 'Withdrawal to Bank ****4592', amount: '-LKR 3,500.00', status: 'Processing', type: 'Debit' },
  { id: 'TRX-1089', date: 'Oct 15, 2026', desc: 'Booking Payout - TechNova', amount: '+LKR 4,250.00', status: 'Completed', type: 'Credit' },
];

export const Earnings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-primary" />
            Earnings & Payouts
          </h1>
          <p className="text-textPrimary/60">Track your revenue, platform fees, and withdraw funds to your bank.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-primary" />
            Earnings & Payouts
          </h1>
          <p className="text-slate-600">Track your revenue, platform fees, and withdraw funds to your bank.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <Button leftIcon={<CreditCard className="w-4 h-4"/>}>Withdraw Funds</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Available Balance</h3>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-textPrimary">LKR 1,275.00</span>
=======
            <h3 className="text-sm font-medium text-slate-800 mb-2">Available Balance</h3>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-slate-900">LKR 1,275.00</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              <div className="flex items-center gap-1 text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> 12%
              </div>
            </div>
<<<<<<< HEAD
            <p className="text-xs text-textPrimary/50 mt-4">Available for immediate withdrawal.</p>
=======
            <p className="text-xs text-slate-500 mt-4">Available for immediate withdrawal.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          </CardContent>
        </Card>

        <Card className="border-slate-300">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Pending Clearance</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-textPrimary">LKR 450.00</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <Activity className="w-4 h-4 text-textPrimary/40" />
              </div>
            </div>
            <p className="text-xs text-textPrimary/50 mt-4">Clears in approx. 3 days.</p>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">Pending Clearance</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">LKR 450.00</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-slate-500" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Clears in approx. 3 days.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          </CardContent>
        </Card>

        <Card className="border-slate-300">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Earnings (YTD)</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-textPrimary">LKR 34,250.00</span>
            </div>
            <p className="text-xs text-textPrimary/50 mt-4">After platform fees.</p>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">Total Earnings (YTD)</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">LKR 34,250.00</span>
            </div>
            <p className="text-xs text-slate-500 mt-4">After platform fees.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          </CardContent>
        </Card>
      </div>

      <Card>
<<<<<<< HEAD
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold text-textPrimary">Recent Transactions</h3>
=======
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Recent Transactions</h3>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4"/>}>Export CSV</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
<<<<<<< HEAD
              <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
=======
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                <th className="p-4 pl-6">Transaction Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {TRANSACTIONS.map((trx, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
<<<<<<< HEAD
                      <span className="font-medium text-textPrimary">{trx.date}</span>
                      <span className="text-xs text-textPrimary/50">{trx.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-textPrimary/80">{trx.desc}</td>
                  <td className="p-4">
                    <span className={cn(
                      "font-bold",
                      trx.type === 'Credit' ? "text-green-400" : "text-textPrimary"
=======
                      <span className="font-medium text-slate-900">{trx.date}</span>
                      <span className="text-xs text-slate-500">{trx.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-800">{trx.desc}</td>
                  <td className="p-4">
                    <span className={cn(
                      "font-bold",
                      trx.type === 'Credit' ? "text-green-400" : "text-slate-900"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                    )}>
                      {trx.amount}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border border-current/20",
                      trx.status === 'Completed' ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"
                    )}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
<<<<<<< HEAD
                    <button className="p-2 text-textPrimary/40 hover:text-textPrimary hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Download Receipt">
=======
                    <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Download Receipt">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                      <FileText className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
