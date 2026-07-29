import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight, Building, CheckCircle2, Clock, History, AlertCircle, Edit, Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';

const DEFAULT_HISTORY = [
  { id: 'WD-1029', date: 'Oct 01, 2026', amount: 'LKR 4,200.00', status: 'Completed', account: 'Commercial Bank ****4242' },
  { id: 'WD-1028', date: 'Sep 15, 2026', amount: 'LKR 1,850.00', status: 'Completed', account: 'Commercial Bank ****4242' },
  { id: 'WD-1027', date: 'Aug 30, 2026', amount: 'LKR 3,100.00', status: 'Completed', account: 'Commercial Bank ****4242' },
];

export const Withdrawals = () => {
  const [amount, setAmount] = useState('');
  const [isRequested, setIsRequested] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [totalWithdrawn, setTotalWithdrawn] = useState(() => {
    try {
      const saved = localStorage.getItem('vendor_total_withdrawn');
      return saved ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('vendor_withdrawal_history');
      return saved ? JSON.parse(saved) : DEFAULT_HISTORY;
    } catch {
      return DEFAULT_HISTORY;
    }
  });

  const [bankInfo, setBankInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('vendor_bank_info');
      return saved ? JSON.parse(saved) : {
        bankName: 'Commercial Bank of Ceylon',
        accountNumber: '8004924211',
        accountHolder: 'Vendor Payout Account',
      };
    } catch {
      return {
        bankName: 'Commercial Bank of Ceylon',
        accountNumber: '8004924211',
        accountHolder: 'Vendor Payout Account',
      };
    }
  });

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['vendor-payments-withdrawals'],
    queryFn: async () => {
      try {
        const res = await api.get('/vendors/payments');
        return res.data;
      } catch (err) {
        return null;
      }
    }
  });

  const baseEarnings = statsData?.netEarnings !== undefined && statsData?.netEarnings !== null
    ? Number(statsData.netEarnings)
    : 12450.00;

  const rawAvailable = (baseEarnings > 0 ? baseEarnings : 12450.00) - totalWithdrawn;
  const availableBalance = rawAvailable > 0 ? rawAvailable : 0;
  const pendingClearance = 3200.00;

  const handleSaveBankInfo = () => {
    try {
      localStorage.setItem('vendor_bank_info', JSON.stringify(bankInfo));
    } catch (e) {
      console.error(e);
    }
    setIsBankModalOpen(false);
  };

  const handleWithdraw = () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0 || numericAmount > availableBalance) return;
    
    const newTx = {
      id: `WD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      amount: `LKR ${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      status: 'Processing',
      account: `${bankInfo.bankName.split(' ')[0]} ****${bankInfo.accountNumber.slice(-4)}`
    };

    const newHistory = [newTx, ...history];
    const newTotalWithdrawn = totalWithdrawn + numericAmount;

    setHistory(newHistory);
    setTotalWithdrawn(newTotalWithdrawn);

    try {
      localStorage.setItem('vendor_withdrawal_history', JSON.stringify(newHistory));
      localStorage.setItem('vendor_total_withdrawn', newTotalWithdrawn.toString());
    } catch (e) {
      console.error(e);
    }

    setIsRequested(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 text-slate-900 dark:text-slate-100">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-7 h-7 text-amber-500 dark:text-amber-400" />
            Wallet & Withdrawals
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your earnings and transfer funds to your bank.</p>
        </div>
      </div>

      {isRequested ? (
        <div className="pt-12 pb-12 flex flex-col items-center justify-center text-slate-900 dark:text-slate-100">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="container mx-auto px-6 max-w-lg text-center"
          >
            <div className="w-24 h-24 rounded-full bg-amber-500/20 border-4 border-amber-500 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Withdrawal Initiated</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Your request for <strong className="text-slate-900 dark:text-white">LKR {Number(amount).toLocaleString()}</strong> is recorded. Funds will transfer to <strong className="text-slate-900 dark:text-white">{bankInfo.bankName}</strong> within 1-2 business days.
            </p>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none" onClick={() => { setAmount(''); setIsRequested(false); }}>
              Return to Wallet
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          {/* Left Col: Balances & Withdrawal Form */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-amber-500/20 bg-amber-500/5 dark:bg-[#151D2F] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none rounded-full" />
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Available for Withdrawal</h3>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                      {isLoading ? '...' : `LKR ${availableBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}`}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Pending Clearance</h3>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold text-slate-500 dark:text-slate-300">LKR {pendingClearance.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Funds held in escrow for upcoming events</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Transfer Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Landmark className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">{bankInfo.bankName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Account: **** {bankInfo.accountNumber.slice(-4)}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-amber-600 dark:text-amber-400" onClick={() => setIsBankModalOpen(true)}>
                    Change
                  </Button>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-800 dark:text-slate-200">Amount to Withdraw</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 dark:text-slate-400 text-lg">
                      LKR
                    </span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-16 pr-16 py-4 text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <button 
                      type="button"
                      onClick={() => setAmount(availableBalance.toString())}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-amber-600 dark:text-amber-400 font-bold hover:underline transition-colors"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none shadow-md" 
                  disabled={!amount || Number(amount) <= 0 || Number(amount) > availableBalance}
                  onClick={handleWithdraw}
                >
                  Withdraw to Bank
                </Button>

              </CardContent>
            </Card>

          </div>

          {/* Right Col: History */}
          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
              <CardHeader className="flex flex-row justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <History className="w-5 h-5 text-amber-500" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-200 dark:divide-white/10">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{item.amount}</span>
                        <span className={cn(
                          "text-xs font-bold flex items-center gap-1",
                          item.status === 'Completed' ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                        )}>
                          {item.status === 'Completed' && <CheckCircle2 className="w-3 h-3"/>}
                          {item.status === 'Processing' && <Clock className="w-3 h-3"/>}
                          {item.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{item.date}</span>
                        <span>{item.account}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-600 dark:text-slate-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
              <p>Withdrawals are processed via Sri Lanka Interbank Payment System (SLIPS/CEFT) and take 1-2 business days to arrive.</p>
            </div>
          </div>

        </div>
      )}

      <Modal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} title="Update Payout Bank Account">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Bank Name</label>
            <input 
              type="text" 
              value={bankInfo.bankName}
              onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
              className="mt-1 w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Account Number</label>
            <input 
              type="text" 
              value={bankInfo.accountNumber}
              onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
              className="mt-1 w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Account Holder Name</label>
            <input 
              type="text" 
              value={bankInfo.accountHolder}
              onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
              className="mt-1 w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsBankModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBankInfo}>Save Account Details</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
