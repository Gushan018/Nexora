import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, Loader2, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { useAuth } from '../../context/AuthContext';

export const SellerDashboard = () => {
  const { user } = useAuth();
  // Fetch Products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const res = await api.get('/products/my-products');
      return res.data;
    }
  });

  // Fetch Orders
  const { data: orderItems, isLoading: ordersLoading } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/seller-orders');
      return res.data;
    }
  });

  const isLoading = productsLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-textPrimary/60">Loading your store data...</p>
      </div>
    );
  }

  // Calculate Stats
  const totalSales = orderItems?.reduce((acc, item) => acc + (parseFloat(item.unitPrice) * item.quantity), 0) || 0;
  const pendingOrders = orderItems?.filter(item => item.order.status === 'PENDING').length || 0;
  const lowStockItems = products?.filter(p => p.quantity < 5 && p.quantity > 0).length || 0;
  const outOfStockItems = products?.filter(p => p.quantity === 0).length || 0;
  const totalProducts = products?.length || 0;

  // Prepare Chart Data (Aggregate by Date)
  const chartData = orderItems?.reduce((acc, item) => {
    const date = new Date(item.order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const amount = parseFloat(item.unitPrice) * item.quantity;
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.amount += amount;
    } else {
      acc.push({ date, amount });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7) || [];

  // Recent Orders (Top 5)
  const recentOrders = orderItems?.slice(0, 5) || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Storefront Overview</h1>
          <p className="text-textPrimary/60">Manage your products, track orders, and monitor sales.</p>
=======
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Storefront Overview</h1>
          <p className="text-slate-600">Manage your products, track orders, and monitor sales.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/seller/store-profile/${user?.id}`}>
            <Button variant="ghost" leftIcon={<ArrowUpRight className="w-4 h-4"/>}>View My Store</Button>
          </Link>
          <Link to="/seller/seller-product-management">
            <Button variant="outline" leftIcon={<Package className="w-4 h-4"/>}>Manage Inventory</Button>
          </Link>
          <Link to="/seller/add-product">
            <Button leftIcon={<ShoppingCart className="w-4 h-4"/>}>Add Product</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SellerStatCard title="Total Revenue" value={`LKR ${totalSales.toLocaleString()}`} icon={<DollarSign className="w-5 h-5 text-green-400" />} />
        <SellerStatCard title="Pending Orders" value={pendingOrders.toString()} isWarning={pendingOrders > 0} icon={<ShoppingCart className="w-5 h-5 text-green-400" />} />
        <SellerStatCard title="Low/Out of Stock" value={(lowStockItems + outOfStockItems).toString()} isWarning={lowStockItems > 0 || outOfStockItems > 0} icon={<Briefcase className="w-5 h-5 text-green-400" />} />
        <SellerStatCard title="Total Products" value={totalProducts.toString()} icon={<Package className="w-5 h-5 text-green-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Revenue trends for your latest orders.</CardDescription>
            </div>
            <Link to="/seller/seller-revenue-analytics">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4"/>}>Detailed Analytics</Button>
            </Link>
          </CardHeader>
<<<<<<< HEAD
          <CardContent className="h-80 pt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `LKR ${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="amount" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-textPrimary/20 italic">
                Insufficient data to generate sales chart.
              </div>
            )}
=======
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                    <th className="pb-3 pl-2">Order ID</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { id: '#SL-0992', product: 'Gold Cutlery Set', date: 'Today, 2:30 PM', status: 'Pending', total: 'LKR 120.00', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                    { id: '#SL-0991', product: 'LED Uplights (x4)', date: 'Today, 11:15 AM', status: 'Processing', total: 'LKR 450.00', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { id: '#SL-0990', product: 'Table Linens (x20)', date: 'Yesterday', status: 'Shipped', total: 'LKR 340.00', color: 'text-green-400', bg: 'bg-green-400/10' },
                  ].map((order, i) => (
                    <tr key={i} className="border-b border-slate-200 hover:bg-slate-100 transition-colors">
                      <td className="py-4 pl-2 font-medium text-slate-900">{order.id}</td>
                      <td className="py-4 text-slate-800">{order.product}</td>
                      <td className="py-4 text-slate-500">{order.date}</td>
                      <td className="py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border border-current/20", order.bg, order.color)}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2 font-medium text-slate-900">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <div className="space-y-8">
          <Card className={cn("border-white/10", lowStockItems > 0 && "border-yellow-500/20 bg-yellow-500/5")}>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", lowStockItems > 0 && "text-yellow-400")}>
                <AlertTriangle className="w-5 h-5" />
                Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
<<<<<<< HEAD
              {products?.filter(p => p.quantity < 5).length === 0 ? (
                <p className="text-sm text-textPrimary/40 italic">All products are well stocked.</p>
              ) : (
                products?.filter(p => p.quantity < 5).slice(0, 4).map((item) => (
                  <div key={item.productId} className="flex justify-between items-center p-3 rounded-xl bg-surface/50 border border-white/5">
                    <div>
                      <p className="font-medium text-textPrimary text-sm line-clamp-1">{item.productName}</p>
                      <p className={cn("text-xs", item.quantity === 0 ? "text-red-400" : "text-yellow-400/70")}>
                        {item.quantity === 0 ? 'Out of Stock' : `Only ${item.quantity} remaining`}
                      </p>
                    </div>
                    <Link to={`/seller/edit-product/${item.productId}`}>
                      <Button size="sm" variant="outline" className="text-xs h-8">Restock</Button>
                    </Link>
=======
              {[
                { name: 'Crystal Wine Glasses', left: 12 },
                { name: 'Silk Chair Covers', left: 5 },
                { name: 'Rustic Wooden Arch', left: 1 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-surface/50 border border-yellow-500/10">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                    <p className="text-xs text-yellow-400/70">Only {item.left} remaining</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders List (Now full width below) */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest purchases requiring fulfillment.</CardDescription>
            </div>
            <Link to="/seller/order-management">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4"/>}>View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50">
                    <th className="pb-3 pl-2">Order ID</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-textPrimary/20 italic">No orders yet.</td>
                    </tr>
                  ) : (
                    recentOrders.map((item, i) => (
                      <tr key={item.orderItemId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-2 font-medium text-textPrimary">#ORD-{item.orderId}</td>
                        <td className="py-4 text-textPrimary/80 line-clamp-1">{item.product.productName}</td>
                        <td className="py-4 text-textPrimary/50">{item.order.customer.name}</td>
                        <td className="py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium border border-current/20",
                            item.order.status === 'PENDING' ? "text-yellow-400 bg-yellow-400/10" : 
                            item.order.status === 'DELIVERED' ? "text-green-400 bg-green-400/10" : 
                            "text-blue-400 bg-blue-400/10"
                          )}>
                            {item.order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2 font-medium text-textPrimary">LKR {(parseFloat(item.unitPrice) * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SellerStatCard = ({ title, value, trend, isWarning, icon }) => (
  <Card className={cn("hover:-translate-y-1 transition-transform duration-300", isWarning && "border-yellow-500/30")}>
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-2">
<<<<<<< HEAD
        <p className="text-sm font-medium text-textPrimary/60">{title}</p>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
=======
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-300">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3 mt-2">
<<<<<<< HEAD
        <h3 className="text-3xl font-bold text-textPrimary">{value}</h3>
=======
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        {trend && (
          <span className="text-sm font-medium mb-1 flex items-center text-green-400 bg-green-400/10 px-2 py-0.5 rounded-md">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);
