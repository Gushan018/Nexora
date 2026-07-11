import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Package, Truck, CheckCircle2, Clock, MapPin, MoreVertical, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getImageUrl } from '../../utils/api';

export const OrderManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data: orderItems, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/seller-orders');
      return res.data;
    }
  });

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
          shippingAddress: order.shippingAddress,
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

  const filteredOrders = useMemo(() => {
    let filtered = groupedOrders;
    
    // Status Filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search Filter
    const query = searchTerm.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(order => {
        return (
          order.orderId.toString().includes(query) ||
          order.customer?.name?.toLowerCase().includes(query) ||
          order.status?.toLowerCase().includes(query) ||
          order.items.some(item => item.product?.productName?.toLowerCase().includes(query))
        );
      });
    }

    return filtered;
  }, [groupedOrders, searchTerm, statusFilter]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      await api.put(`/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['seller-orders']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const stats = {
    pending: groupedOrders.filter(order => order.status === 'PENDING').length,
    inTransit: groupedOrders.filter(order => order.status === 'PROCESSING' || order.status === 'SHIPPED').length,
    delivered: groupedOrders.filter(order => order.status === 'DELIVERED').length,
    totalOrders: groupedOrders.length,
    totalRevenue: groupedOrders.reduce((sum, order) => sum + order.sellerTotal, 0),
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Order Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Process physical orders, print labels, and track shipments.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-yellow-500 dark:text-yellow-400 mb-2">Pending Orders</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-blue-500 dark:text-blue-400 mb-2">In Transit</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.inTransit}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-green-500 dark:text-green-400 mb-2">Delivered (30d)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.delivered}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Orders</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalOrders}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, customer name, or product..." 
              className="w-full bg-light-surface dark:bg-surface/50 border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-light-surface dark:bg-surface/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="ALL" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>All Statuses</option>
              <option value="PENDING" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Pending</option>
              <option value="PROCESSING" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Processing</option>
              <option value="SHIPPED" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Shipped</option>
              <option value="DELIVERED" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Delivered</option>
              <option value="CANCELLED" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Cancelled</option>
            </select>
          </div>
        </div>
        
        {/* Data Table */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" /> Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-slate-600 opacity-60" />
            <p className="font-medium text-base text-slate-800 dark:text-white">No orders found</p>
            <p className="text-sm">Orders placed for your store products will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/80">
                  <th className="p-4 pl-6">Order ID / Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total Value</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 pr-6"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900 dark:text-white">#ORD-{order.orderId}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(order.orderDate).toLocaleDateString()}</span>
                        <span className="text-xs text-slate-400 line-clamp-1 max-w-[180px]">{order.shippingAddress || 'No address provided'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white font-medium">{order.customer?.name || 'Customer'}</span>
                        <span className="text-xs text-slate-500">{order.customer?.email || 'No email'}</span>
                        <span className="text-xs text-slate-400">{order.customer?.contactNumber}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.orderItemId} className="flex items-center gap-3">
                            <img
                              src={getImageUrl(item.product?.imageUrl)}
                              alt={item.product?.productName || 'Product'}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-white/10 shrink-0"
                            />
                            <div className="flex flex-col">
                              <span className="text-slate-900 dark:text-white font-medium truncate max-w-[140px] text-xs">{item.product?.productName}</span>
                              <span className="text-[11px] text-slate-500">LKR {parseFloat(item.unitPrice || item.product?.price || 0).toLocaleString()} × {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">LKR {order.sellerTotal.toLocaleString()}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                        className={cn(
                          "border rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none transition-colors cursor-pointer",
                          order.status === 'DELIVERED' ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400" : 
                          order.status === 'PENDING' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400" : 
                          order.status === 'PROCESSING' ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400" :
                          order.status === 'SHIPPED' ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400" :
                          "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                        )}
                      >
                        <option value="PENDING" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>PENDING</option>
                        <option value="PROCESSING" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>PROCESSING</option>
                        <option value="SHIPPED" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>SHIPPED</option>
                        <option value="DELIVERED" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>DELIVERED</option>
                        <option value="CANCELLED" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4 text-slate-500" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
