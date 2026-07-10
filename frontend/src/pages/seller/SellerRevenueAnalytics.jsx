import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, DollarSign, ShoppingCart, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';

export const SellerRevenueAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller Revenue Analytics</h1>
          <p className="text-slate-600">Deep dive into your metrics.</p>
        </div>
        <Button variant="outline">Export Data</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-80">
          <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
          <CardContent className="h-full flex items-center justify-center border-t border-slate-200">
            <BarChart3 className="w-16 h-16 text-primary/40" />
          </CardContent>
        </Card>
        <Card className="h-80">
          <CardHeader><CardTitle>Distribution</CardTitle></CardHeader>
          <CardContent className="h-full flex items-center justify-center border-t border-slate-200">
            <PieChart className="w-16 h-16 text-accent/40" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
