import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, DollarSign, Activity, TrendingUp, AlertTriangle, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-primary" />
            Platform Overview
          </h1>
          <p className="text-white/60">Global metrics and system health for the Nexora Marketplace.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>System Settings</Button>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        <StatCard 
          title="Total Platform GMV" 
          value="$2.4M" 
          trend="+18%" 
          trendUp={true}
          icon={<DollarSign className="w-5 h-5 text-green-400" />} 
          color="bg-green-400"
        />
        <StatCard 
          title="Active Users" 
          value="45.2K" 
          trend="+5.2%" 
          trendUp={true}
          icon={<Users className="w-5 h-5 text-primary" />} 
          color="bg-primary"
        />
        <StatCard 
          title="Active Vendors" 
          value="1,842" 
          trend="+12%" 
          trendUp={true}
          icon={<UserCheck className="w-5 h-5 text-accent" />} 
          color="bg-accent"
        />
        <StatCard 
          title="Pending Approvals" 
          value="156" 
          trend="-2%" 
          trendUp={false}
          icon={<AlertTriangle className="w-5 h-5 text-yellow-500" />} 
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <Card className="xl:col-span-2 border-white/5 h-[450px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue vs GMV Growth</CardTitle>
              <CardDescription>Platform transaction volume over the last 12 months</CardDescription>
            </div>
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Last 12 Months</option>
              <option>Year to Date</option>
            </select>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-white/5 relative">
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-20">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-px bg-white/20" />
              ))}
            </div>
            <div className="text-center z-10">
              <Activity className="w-16 h-16 text-primary/20 mx-auto mb-4" />
              <p className="text-white/40 font-medium">Recharts Area Chart</p>
              <p className="text-xs text-white/30">Visualizing monthly platform fees vs total GMV</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Items & Alerts */}
        <div className="space-y-6">
          <Card className="border-white/5">
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Requires immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-yellow-400">High Server Load</h4>
                  <p className="text-xs text-white/60 mt-0.5">API latency is currently 250ms above average threshold.</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-400">Failed Payouts</h4>
                  <p className="text-xs text-white/60 mt-0.5">3 vendor Stripe payouts failed in the last hour.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5">
            <CardHeader>
              <CardTitle>Pending Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors">
                  <div>
                    <h4 className="text-sm font-medium text-white">Vendor Approvals</h4>
                    <p className="text-xs text-white/40">Requires identity verification</p>
                  </div>
                  <span className="px-2 py-1 bg-primary/20 text-primary font-bold text-xs rounded-full">42</span>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors">
                  <div>
                    <h4 className="text-sm font-medium text-white">Disputes</h4>
                    <p className="text-xs text-white/40">Active customer/vendor conflicts</p>
                  </div>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 font-bold text-xs rounded-full">12</span>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors">
                  <div>
                    <h4 className="text-sm font-medium text-white">Reported Reviews</h4>
                    <p className="text-xs text-white/40">Flagged by community</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 font-bold text-xs rounded-full">8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendUp, icon, color }) => (
  <Card className="border-white/5 overflow-hidden relative group">
    <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity", color)} />
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/60">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-surface/80 flex items-center justify-center border border-white/10 backdrop-blur-md">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className={cn(
          "text-sm font-medium mb-1 flex items-center gap-1",
          trendUp ? "text-green-400" : "text-red-400"
        )}>
          {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
          {trend}
        </div>
      </div>
    </CardContent>
  </Card>
);
