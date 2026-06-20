import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, MoreVertical, CreditCard, Calendar, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const CUSTOMERS = [
  { id: 'CUST-8492', name: 'Sarah Jenkins', email: 'sarah.j@example.com', totalSpent: 'LKR 12,450', bookings: 4, lastActive: '2 hours ago', riskScore: 'Low' },
  { id: 'CUST-8491', name: 'Michael Chen', email: 'michael.chen@domain.com', totalSpent: 'LKR 1,500', bookings: 1, lastActive: '1 day ago', riskScore: 'Low' },
  { id: 'CUST-8490', name: 'Emily Davis', email: 'emily.d@example.com', totalSpent: 'LKR 45,000', bookings: 12, lastActive: '5 mins ago', riskScore: 'Low' },
  { id: 'CUST-8489', name: 'Unknown User', email: 'test12345@scam.net', totalSpent: 'LKR 0', bookings: 0, lastActive: '1 week ago', riskScore: 'High' },
];

export const AdminCustomerManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Customer Accounts
          </h1>
          <p className="text-white/60">Monitor buyer behavior, LTV (Lifetime Value), and risk factors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Active Customers (30d)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">12,400</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Avg. Lifetime Value</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">LKR 2,150</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-2">High Risk Accounts</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-white">14</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-red-400 border-red-400/20 hover:bg-red-400/10 hover:text-red-300">
              Review
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Sort: Highest LTV</option>
              <option>Sort: Newest</option>
              <option>Sort: Most Bookings</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Financials</th>
                <th className="p-4">Activity</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {CUSTOMERS.map((customer, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{customer.name}</span>
                      <span className="text-xs text-white/50">{customer.email} • {customer.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-white/40"/> {customer.totalSpent}</span>
                      <span className="text-xs text-white/50">{customer.bookings} total bookings</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">{customer.lastActive}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full",
                      customer.riskScore === 'Low' ? "bg-green-500/10 text-green-400" :
                      customer.riskScore === 'High' ? "bg-red-500/20 text-red-400 border border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {customer.riskScore === 'High' && <ShieldAlert className="w-3.5 h-3.5" />}
                      {customer.riskScore} Risk
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile
                    </Button>
                    <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Actions">
                      <MoreVertical className="w-5 h-5"/>
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
