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
          <h1 className="text-2xl font-bold text-slate-900">Sales Dashboard</h1>
          <p className="text-slate-600">Overview of your recent activity and metrics.</p>
        </div>
        <Button>Generate Report</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[ {title: 'Total Users', val: '12,345', icon: <Users/>}, {title: 'Revenue', val: 'LKR 34,500', icon: <DollarSign/>}, {title: 'Active Sessions', val: '1,234', icon: <Activity/>} ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{stat.val}</h3>
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
        <CardContent className="h-full flex items-center justify-center border-t border-slate-200">
          <p className="text-slate-500">Interactive Chart Visualization goes here</p>
        </CardContent>
      </Card>
    </div>
  );
};
