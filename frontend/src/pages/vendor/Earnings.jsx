import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Download, 
  Activity, FileText, Building2, CheckCircle2, ShieldCheck, Wallet, RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export const Earnings = () => {
  const { showToast } = useToast();
  const [bankAccount, setBankAccount] = useState({
    bankName: 'Commercial Bank PLC',
    accountNumber: '**** **** 4592',
    accountHolder: 'Registered Business',
    branch: 'Colombo Main Branch'
  });

  const { data: bookingsData = [], isLoading, refetch } = useQuery({
    queryKey: ['vendorEarningsBookings'],
    queryFn: async () => {
      try {
        const res = await api.get('/bookings/vendor');
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        return [];
      }
    }
  });

  const completedBookings = bookingsData.filter(b => b.status === 'COMPLETED');
  const pendingBookings = bookingsData.filter(b => b.status === 'ACCEPTED');

  const totalGrossEarnings = completedBookings.reduce((sum, b) => {
    return sum + Number(b.service?.price || b.package?.price || 0);
  }, 0);

  const PLATFORM_FEE_PERCENT = 10;
  const platformFee = (totalGrossEarnings * PLATFORM_FEE_PERCENT) / 100;
  const availableBalance = totalGrossEarnings - platformFee;

  const pendingClearance = pendingBookings.reduce((sum, b) => {
    const val = Number(b.service?.price || b.package?.price || 0);
    return sum + (val * 0.9); // Net 90%
  }, 0);

  const transactions = completedBookings.length > 0 ? completedBookings.map((b, i) => ({
    id: `TRX-${b.bookingId || (1000 + i)}`,
    date: b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
    desc: `Payout - ${b.customer?.name || 'Customer'} (${b.service?.serviceName || b.package?.packageName || 'Service'})`,
    amount: `+LKR ${(Number(b.service?.price || b.package?.price || 0) * 0.9).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    status: 'Completed',
    type: 'Credit'
  })) : [
    { id: 'TRX-1092', date: 'Oct 24, 2026', desc: 'Booking Payout - Sarah Jenkins', amount: '+LKR 1,275.00', status: 'Completed', type: 'Credit' },
    { id: 'TRX-1091', date: 'Oct 23, 2026', desc: 'Platform Commission Fee (10%)', amount: '-LKR 141.60', status: 'Completed', type: 'Debit' },
    { id: 'TRX-1090', date: 'Oct 20, 2026', desc: 'Withdrawal to Commercial Bank', amount: '-LKR 3,500.00', status: 'Completed', type: 'Debit' },
  ];

  const handleWithdraw = () => {
    if (availableBalance <= 0) {
      showToast('Insufficient funds for withdrawal', 'warning');
      return;
    }
    showToast(`Withdrawal request of LKR ${availableBalance.toLocaleString()} submitted successfully!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-primary" />
            Earnings & Payment Wallet
          </h1>
          <p className="text-slate-600 dark:text-slate-300">Track your revenue, platform fee deduction, and manage payout cards.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button leftIcon={<CreditCard className="w-4 h-4"/>} onClick={handleWithdraw}>
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <Card className="border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Available Net Balance</h3>
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                LKR {availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full font-semibold">
                <ArrowUpRight className="w-3 h-3" /> Ready
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Available for direct bank payout.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">Pending Clearance</h3>
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                LKR {pendingClearance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Clears automatically upon event completion.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">Platform Fee Rate</h3>
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">10%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Deducted: LKR {platformFee.toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Includes escrow protection & payment processing.</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment & Bank Payout Card Details */}
      <Card className="border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Payout Bank Card</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Primary receiving bank details for payout processing</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Account Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Bank Name</span>
              <strong className="text-slate-900 dark:text-white">{bankAccount.bankName}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Account Number</span>
              <strong className="text-slate-900 dark:text-white font-mono">{bankAccount.accountNumber}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Branch</span>
              <strong className="text-slate-900 dark:text-white">{bankAccount.branch}</strong>
            </div>
            <div className="flex items-center justify-end">
              <Button variant="outline" size="sm" onClick={() => showToast('Bank details saved.', 'success')}>
                Update Card
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table Card */}
      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white">Recent Payout Transactions</h3>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4"/>}>Export CSV</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-sm font-medium text-slate-500 bg-slate-50 dark:bg-slate-800">
                <th className="p-4 pl-6">Transaction Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.map((trx, i) => (
                <tr key={i} className="border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-white">{trx.date}</span>
                      <span className="text-xs text-slate-500 font-mono">{trx.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-800 dark:text-slate-200">{trx.desc}</td>
                  <td className="p-4">
                    <span className={cn(
                      "font-bold",
                      trx.type === 'Credit' ? "text-emerald-500 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                    )}>
                      {trx.amount}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 bg-emerald-500/10">
                      {trx.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Download Receipt">
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
