import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowRight, Building, CheckCircle2, Clock, History, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';

const HISTORY = [
  { id: 'WD-1029', date: 'Oct 01, 2026', amount: 'LKR 4,200.00', status: 'Completed', account: 'Chase ****4242' },
  { id: 'WD-1028', date: 'Sep 15, 2026', amount: 'LKR 1,850.00', status: 'Completed', account: 'Chase ****4242' },
  { id: 'WD-1027', date: 'Aug 30, 2026', amount: 'LKR 3,100.00', status: 'Completed', account: 'Chase ****4242' },
];

export const Withdrawals = () => {
  const [amount, setAmount] = useState('');
  const [isRequested, setIsRequested] = useState(false);

  const availableBalance = 12450.00;

  if (isRequested) {
    return (
      <div className="pt-24 pb-20 min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="container mx-auto px-6 max-w-lg text-center"
        >
          <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Withdrawal Initiated</h1>
          <p className="text-white/60 mb-8">
            Your request for <strong className="text-white">LKR {amount}</strong> is being processed. Funds typically arrive in your connected bank account within 1-3 business days.
          </p>
          <Button variant="outline" onClick={() => setIsRequested(false)}>Return to Wallet</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-primary" />
            Wallet & Withdrawals
          </h1>
          <p className="text-white/60">Manage your earnings and transfer funds to your bank.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        
        {/* Left Col: Balances & Withdrawal Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-primary/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] pointer-events-none rounded-full" />
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-white/80 mb-2">Available for Withdrawal</h3>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-white">LKR {availableBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-white/60 mb-2">Pending Clearance</h3>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-white/50">LKR 3,200.00</span>
                </div>
                <p className="text-xs text-white/40 mt-2">Funds held in escrow for upcoming events</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-surface/50">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Building className="w-6 h-6 text-white/60" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">Chase Checking</h4>
                  <p className="text-xs text-white/50">**** **** **** 4242</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">Change</Button>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">Amount to Withdraw</label>
                <div className="relative">
                  <DollarSign className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-4 text-2xl font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                    onClick={() => setAmount(availableBalance)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-primary font-bold hover:text-primary-light transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              <Button 
                className="w-full h-12 text-lg" 
                disabled={!amount || Number(amount) <= 0 || Number(amount) > availableBalance}
                onClick={() => setIsRequested(true)}
              >
                Withdraw to Bank
              </Button>

            </CardContent>
          </Card>

        </div>

        {/* Right Col: History */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center border-b border-white/5 pb-4">
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {HISTORY.map((item, i) => (
                  <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white">{item.amount}</span>
                      <span className={cn(
                        "text-xs font-bold flex items-center gap-1",
                        item.status === 'Completed' ? "text-green-400" : "text-primary"
                      )}>
                        {item.status === 'Completed' && <CheckCircle2 className="w-3 h-3"/>}
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-white/50">
                      <span>{item.date}</span>
                      <span>{item.account}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/5">
                <Button variant="outline" className="w-full">View All Transactions</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-white/40" />
            <p>Withdrawals are processed via standard ACH and may take 1-3 business days to appear on your bank statement.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
