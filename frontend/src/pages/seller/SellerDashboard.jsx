import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, Loader2, Briefcase, CheckCircle2, Receipt, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { api, getImageUrl } from '../../utils/api';
import { Link } from 'react-router-dom';
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

  const groupedOrders = useMemo(() => {
    if (!Array.isArray(orderItems)) return [];

    const groupMap = new Map();
    orderItems.forEach((item) => {
      const order = item.order;
      if (!order) return;

      const orderId = order.orderId;
      if (!groupMap.has(orderId)) {
        groupMap.set(orderId, {
          orderId,
          orderDate: order.orderDate,
          status: order.status,
          customer: order.customer,
          sellerTotal: 0,
          items: [],
        });
      }

      const itemTotal = parseFloat(item.unitPrice || item.product?.price || 0) * item.quantity;
      const group = groupMap.get(orderId);
      group.sellerTotal += itemTotal;
      group.items.push({
        orderItemId: item.orderItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        product: item.product,
      });
    });

    return Array.from(groupMap.values()).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }, [orderItems]);

  const lowStockProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => p.quantity <= 10).sort((a, b) => a.quantity - b.quantity);
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-600 dark:text-slate-400">Loading your store data...</p>
      </div>
    );
  }

  // Calculate Stats
  const totalSales = groupedOrders.reduce((acc, o) => acc + o.sellerTotal, 0);
  const platformFee = Math.round(totalSales * 0.10);
  const netEarnings = Math.round(totalSales * 0.90);
  const pendingOrders = groupedOrders.filter(o => o.status === 'PENDING').length;
  const lowOrOutCount = lowStockProducts.length;
  const totalProducts = products?.length || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Seller Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your products, track orders, and monitor sales performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/seller/store-management">
            <Button variant="outline" leftIcon={<ArrowUpRight className="w-4 h-4"/>}>View Store Settings</Button>
          </Link>
          <Link to="/seller/inventory-management">
            <Button variant="outline" leftIcon={<Package className="w-4 h-4"/>}>Manage Inventory</Button>
          </Link>
          <Link to="/seller/add-product">
            <Button leftIcon={<ShoppingCart className="w-4 h-4"/>}>Add Product</Button>
          </Link>
        </div>
      </div>

      {/* 5 KPI Cards Grid for Product Seller */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <SellerStatCard 
          title="Total Revenue" 
          value={`LKR ${totalSales.toLocaleString()}`} 
          icon={<DollarSign className="w-5 h-5 text-green-500" />} 
        />
        <SellerStatCard 
          title="Platform Fee (10%)" 
          value={`-LKR ${platformFee.toLocaleString()}`} 
          isWarning={true}
          icon={<Percent className="w-5 h-5 text-amber-500" />} 
        />
        <SellerStatCard 
          title="Net Earnings" 
          value={`LKR ${netEarnings.toLocaleString()}`} 
          icon={<Receipt className="w-5 h-5 text-primary" />} 
        />
        <SellerStatCard 
          title="Pending Orders" 
          value={pendingOrders.toString()} 
          isWarning={pendingOrders > 0} 
          icon={<ShoppingCart className="w-5 h-5 text-yellow-500" />} 
        />
        <SellerStatCard 
          title="Total Products" 
          value={totalProducts.toString()} 
          icon={<Package className="w-5 h-5 text-primary" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real Sales Performance Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Latest orders placed for your products.</CardDescription>
            </div>
            <Link to="/seller/order-management">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4"/>}>All Orders</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {groupedOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50 text-slate-400" />
                <p className="font-medium text-sm text-slate-800 dark:text-white">No sales orders recorded yet</p>
                <p className="text-xs mt-1">Orders placed for your storefront items will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/80">
                      <th className="py-3 pl-3">Order ID</th>
                      <th className="py-3">Customer</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-right pr-3">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {groupedOrders.slice(0, 5).map((order) => (
                      <tr key={order.orderId} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pl-3 font-semibold text-slate-900 dark:text-white">#ORD-{order.orderId}</td>
                        <td className="py-4 text-slate-800 dark:text-slate-200 font-medium">{order.customer?.name || 'Customer'}</td>
                        <td className="py-4 text-xs text-slate-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold border",
                            order.status === 'DELIVERED' ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400" : 
                            order.status === 'PENDING' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400" : 
                            order.status === 'PROCESSING' ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400" :
                            order.status === 'SHIPPED' ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400" :
                            "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-3 font-bold text-slate-900 dark:text-white">LKR {order.sellerTotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real Inventory Alerts */}
        <div className="space-y-8">
          <Card className={cn(lowStockProducts.length > 0 && "border-yellow-500/30 bg-yellow-500/5")}>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2 text-slate-900 dark:text-white", lowStockProducts.length > 0 && "text-yellow-600 dark:text-yellow-400")}>
                <AlertTriangle className="w-5 h-5" />
                Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {lowStockProducts.length === 0 ? (
                <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-green-500" />
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400">All Healthy</p>
                  <p className="text-[11px] text-slate-500">All products have sufficient stock levels.</p>
                </div>
              ) : (
                lowStockProducts.slice(0, 4).map((prod) => (
                  <div key={prod.productId} className="flex items-center justify-between p-3 rounded-xl bg-light-surface dark:bg-surface/50 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(prod.imageUrl)}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-white/10 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-xs truncate max-w-[120px]">{prod.productName}</p>
                        <p className={cn("text-[11px] font-semibold", prod.quantity === 0 ? "text-red-500" : "text-yellow-500")}>
                          {prod.quantity === 0 ? 'Out of Stock (0)' : `Only ${prod.quantity} remaining`}
                        </p>
                      </div>
                    </div>
                    <Link to={`/seller/edit-product/${prod.productId}`}>
                      <span className="text-xs text-primary hover:underline font-medium">Restock</span>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Full Width Order Item Breakdown */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ordered Item Breakdown</CardTitle>
              <CardDescription>Individual product items ordered by customers.</CardDescription>
            </div>
            <Link to="/seller/order-management">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4"/>}>View Order Manager</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/80">
                    <th className="py-3 pl-3">Order ID</th>
                    <th className="py-3">Product Name</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-right pr-3">Item Subtotal</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {!orderItems || orderItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500 dark:text-slate-400 italic">No order items recorded yet.</td>
                    </tr>
                  ) : (
                    orderItems.slice(0, 6).map((item) => (
                      <tr key={item.orderItemId} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pl-3 font-semibold text-slate-900 dark:text-white">#ORD-{item.orderId}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={getImageUrl(item.product?.imageUrl)}
                              alt=""
                              className="w-7 h-7 rounded object-cover border border-slate-200 dark:border-white/10 shrink-0"
                            />
                            <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[160px]">{item.product?.productName}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-600 dark:text-slate-300">{item.order?.customer?.name || 'Customer'}</td>
                        <td className="py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold border",
                            item.order?.status === 'PENDING' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400" : 
                            item.order?.status === 'DELIVERED' ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400" : 
                            "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                          )}>
                            {item.order?.status}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-3 font-bold text-slate-900 dark:text-white">
                          LKR {(parseFloat(item.unitPrice || item.product?.price || 0) * item.quantity).toLocaleString()}
                        </td>
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

const SellerStatCard = ({ title, value, isWarning, icon }) => (
  <Card className={cn("hover:-translate-y-1 transition-transform duration-300", isWarning && "border-amber-500/30 bg-amber-500/5")}>
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-slate-600 dark:text-slate-400">{title}</h3>
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3 mt-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
      </div>
    </CardContent>
  </Card>
);
