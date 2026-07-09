import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, DollarSign, ShoppingCart, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';

export const SellerRevenueAnalytics = () => {
  const { data: orderItems, isLoading, error } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/seller-orders');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-textPrimary/60">Analyzing your revenue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-red-400">
        <AlertTriangle className="w-12 h-12 opacity-50" />
        <p>Failed to load analytics data.</p>
      </div>
    );
  }

  // Calculate Stats
  const totalRevenue = orderItems?.reduce((acc, item) => acc + (parseFloat(item.unitPrice) * item.quantity), 0) || 0;
  const platformFees = totalRevenue * 0.05;
  const netEarnings = totalRevenue - platformFees;

  // Process Chart Data
  const revenueByDate = orderItems?.reduce((acc, item) => {
    const date = new Date(item.order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const amount = parseFloat(item.unitPrice) * item.quantity;
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.amount += amount;
    } else {
      acc.push({ date, amount });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date)) || [];

  // Revenue by Product (Top 5)
  const revenueByProduct = orderItems?.reduce((acc, item) => {
    const name = item.product.productName;
    const amount = parseFloat(item.unitPrice) * item.quantity;
    const existing = acc.find(d => d.name === name);
    if (existing) {
      existing.amount += amount;
    } else {
      acc.push({ name, amount });
    }
    return acc;
  }, []).sort((a, b) => b.amount - a.amount).slice(0, 5) || [];

  const COLORS = ['#D4AF37', '#9C7B16', '#F5E6BE', '#B8860B', '#E5C100'];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Revenue Analytics</h1>
          <p className="text-textPrimary/60">Detailed breakdown of your storefront earnings.</p>
        </div>
        <Button variant="outline" leftIcon={<TrendingUp className="w-4 h-4"/>}>Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-textPrimary/60 mb-2">Total Gross Revenue</p>
            <h3 className="text-3xl font-bold text-textPrimary">LKR {totalRevenue.toLocaleString()}</h3>
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-textPrimary/60 mb-2">Platform Fees (5%)</p>
            <h3 className="text-3xl font-bold text-red-400">LKR {platformFees.toLocaleString()}</h3>
            <p className="text-xs text-textPrimary/40 mt-2">Deducted at source</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <p className="text-sm text-primary mb-2">Net Earnings</p>
            <h3 className="text-3xl font-bold text-textPrimary">LKR {netEarnings.toLocaleString()}</h3>
            <p className="text-xs text-primary/60 mt-2 italic">Available for withdrawal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-[450px]">
          <CardHeader>
            <CardTitle>Daily Revenue Growth</CardTitle>
            <CardDescription>Visualizing your sales trend over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-full pt-4 pb-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByDate}>
                <defs>
                  <linearGradient id="colorAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `LKR ${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="amount" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorAnalytics)" />  
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[450px]">
          <CardHeader>
            <CardTitle>Top Revenue Contributors</CardTitle>
            <CardDescription>Products generating the most value for your store.</CardDescription>
          </CardHeader>
          <CardContent className="h-full pt-4 pb-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByProduct} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.6)" fontSize={11} width={120} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {revenueByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
