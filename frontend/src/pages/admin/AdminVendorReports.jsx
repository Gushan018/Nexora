import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserMinus, Crown, Download, Activity, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const AdminVendorReports = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-7 h-7 text-accent" />
            Vendor Analytics
          </h1>
          <p className="text-slate-600">Analyze vendor acquisition, churn, and subscription tier distribution.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-surface/50 border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
            <option>Year to Date</option>
            <option>Last Quarter</option>
          </select>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4"/>}>Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Total Active Vendors</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-accent">1,842</span>
            </div>
            <p className="text-xs text-accent/60 font-bold mt-2">+12% vs last year</p>
          </CardContent>
        </Card>

        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">New Signups (YTD)</h3>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-slate-900">415</span>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Vendor Churn Rate</h3>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-slate-900">2.4%</span>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <UserMinus className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Pro Subscriptions</h3>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-yellow-500">680</span>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Acquisition Chart */}
        <Card className="border-slate-200 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Vendor Acquisition vs Churn</CardTitle>
            <CardDescription>Monthly net growth</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-slate-200 relative">
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-slate-300" />
              ))}
            </div>
            <div className="text-center z-10">
              <Activity className="w-16 h-16 text-accent/20 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Recharts Composed Chart</p>
              <p className="text-xs text-slate-400">Bar (Signups) vs Line (Churn)</p>
            </div>
          </CardContent>
        </Card>

        {/* Tier Distribution */}
        <Card className="border-slate-200 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Subscription Tier Distribution</CardTitle>
            <CardDescription>Breakdown of free vs paid vendor accounts</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            
            <div className="space-y-6 max-w-md mx-auto w-full">
              
              <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Pro Tier (LKR 99/mo)</h4>
                    <p className="text-xs text-slate-600">Premium features unlocked</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg text-yellow-500 block">680</span>
                  <span className="text-xs text-slate-500">37%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-300 bg-surface flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Store className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Basic Tier (Free)</h4>
                    <p className="text-xs text-slate-600">Standard commission rates</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg text-slate-900 block">1,162</span>
                  <span className="text-xs text-slate-500">63%</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-600">Conversion Rate from Basic to Pro: <span className="font-bold text-slate-900">12.4%</span></p>
              </div>

            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

