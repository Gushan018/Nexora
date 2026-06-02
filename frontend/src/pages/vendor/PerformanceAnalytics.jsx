import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const KEY_METRICS = [
  { label: 'Profile Views', value: '12.4K', change: '+14.2%', up: true, icon: Eye },
  { label: 'Unique Visitors', value: '8.2K', change: '+5.4%', up: true, icon: Users },
  { label: 'Inquiry Clicks', value: '452', change: '-2.1%', up: false, icon: MousePointerClick },
  { label: 'Conversion Rate', value: '3.6%', change: '+0.8%', up: true, icon: TrendingUp },
];

export const PerformanceAnalytics = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            Performance Analytics
          </h1>
          <p className="text-white/60">Track your visibility and conversion metrics on Nexora.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {KEY_METRICS.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <Card key={i} className="border-white/5">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white/60" />
                  </div>
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                    metric.up ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                  )}>
                    {metric.up ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                    {metric.change}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{metric.value}</h3>
                  <p className="text-sm text-white/50 mt-1">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Placeholder */}
        <Card className="lg:col-span-2 border-white/5 flex flex-col h-[400px]">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Views vs Inquiries over the selected period</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-white/5 relative">
            
            {/* Mock Chart Grid */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-white/20" />
              ))}
            </div>

            <div className="text-center z-10">
              <BarChart3 className="w-16 h-16 text-primary/20 mx-auto mb-4" />
              <p className="text-white/40 font-medium">Recharts / Chart.js Canvas</p>
              <p className="text-xs text-white/30">Traffic visualization would render here</p>
            </div>
            
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-white/5 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your views come from</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pt-0">
            <div className="space-y-6">
              {[
                { source: 'Nexora Search', percent: 65, color: 'bg-primary' },
                { source: 'Direct Link', percent: 20, color: 'bg-accent' },
                { source: 'External Referrals', percent: 10, color: 'bg-yellow-500' },
                { source: 'Other', percent: 5, color: 'bg-white/20' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{item.source}</span>
                    <span className="text-white font-medium">{item.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full", item.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
