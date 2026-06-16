import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const SellerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Storefront Overview</h1>
          <p className="text-white/60">Manage your products, track orders, and monitor sales.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Package className="w-4 h-4"/>}>Manage Inventory</Button>
          <Button leftIcon={<ShoppingCart className="w-4 h-4"/>}>Add Product</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SellerStatCard title="Total Sales" value="$8,450" trend="+15%" icon={<DollarSign className="w-5 h-5 text-green-400" />} />
        <SellerStatCard title="Orders Today" value="12" trend="+3" icon={<ShoppingCart className="w-5 h-5 text-primary" />} />
        <SellerStatCard title="Low Stock Items" value="4" isWarning icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />} />
        <SellerStatCard title="Total Products" value="86" trend="+2" icon={<Package className="w-5 h-5 text-accent" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest purchases requiring fulfillment.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4"/>}>View All</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-sm font-medium text-white/50">
                    <th className="pb-3 pl-2">Order ID</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { id: '#SL-0992', product: 'Gold Cutlery Set', date: 'Today, 2:30 PM', status: 'Pending', total: '$120.00', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                    { id: '#SL-0991', product: 'LED Uplights (x4)', date: 'Today, 11:15 AM', status: 'Processing', total: '$450.00', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { id: '#SL-0990', product: 'Table Linens (x20)', date: 'Yesterday', status: 'Shipped', total: '$340.00', color: 'text-green-400', bg: 'bg-green-400/10' },
                  ].map((order, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 pl-2 font-medium text-white">{order.id}</td>
                      <td className="py-4 text-white/80">{order.product}</td>
                      <td className="py-4 text-white/50">{order.date}</td>
                      <td className="py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border border-current/20", order.bg, order.color)}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2 font-medium text-white">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <div className="space-y-8">
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {[
                { name: 'Crystal Wine Glasses', left: 12 },
                { name: 'Silk Chair Covers', left: 5 },
                { name: 'Rustic Wooden Arch', left: 1 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-surface/50 border border-yellow-500/10">
                  <div>
                    <p className="font-medium text-white text-sm">{item.name}</p>
                    <p className="text-xs text-yellow-400/70">Only {item.left} remaining</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-8">Restock</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SellerStatCard = ({ title, value, trend, isWarning, icon }) => (
  <Card className="hover:-translate-y-1 transition-transform duration-300">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-white/60">{title}</p>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3 mt-2">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {trend && (
          <span className="text-sm font-medium mb-1 flex items-center text-green-400 bg-green-400/10 px-2 py-0.5 rounded-md">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </span>
        )}
        {isWarning && (
          <span className="text-sm font-medium mb-1 text-yellow-400">Needs Attention</span>
        )}
      </div>
    </CardContent>
  </Card>
);
