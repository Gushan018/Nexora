import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const SalesDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Dashboard</h1>
          <p className="text-white/60">Overview of your recent activity and metrics.</p>
        </div>
        <Button>Generate Report</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[ {title: 'Total Users', val: '12,345', icon: <Users/>}, {title: 'Revenue', val: '$34,500', icon: <DollarSign/>}, {title: 'Active Sessions', val: '1,234', icon: <Activity/>} ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white">{stat.val}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="h-96">
        <CardHeader>
          <CardTitle>Activity Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex items-center justify-center border-t border-white/5">
          <p className="text-white/40">Interactive Chart Visualization goes here</p>
        </CardContent>
      </Card>
    </div>
  );
};
