import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Package, Truck, CheckCircle2, Clock, MapPin, MoreVertical, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';

export const OrderManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data: orderItems, isLoading, error } = useQuery({
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
          sellerTotal: 0, // We calculate this
          items: [],
        });
      }

      const itemTotal = parseFloat(item.unitPrice) * item.quantity;
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
    processing: groupedOrders.filter(order => order.status === 'PROCESSING').length,
    delivered: groupedOrders.filter(order => order.status === 'DELIVERED').length,
    totalOrders: groupedOrders.length,
    totalRevenue: groupedOrders.reduce((sum, order) => sum + order.sellerTotal, 0),
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Order Management
          </h1>
          <p className="text-textPrimary/60">Process physical orders, print labels, and track shipments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {['ALL', 'PENDING', 'PROCESSING', 'DELIVERED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                  statusFilter === status 
                    ? "bg-primary text-textPrimary shadow-lg shadow-primary/20" 
                    : "text-textPrimary/40 hover:text-textPrimary/70"
                )}
              >
                {status}
              </button>
            ))}
          </div>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Order Management
          </h1>
          <p className="text-slate-600">Process physical orders, print labels, and track shipments.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-yellow-400/80 mb-2">Pending Orders</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-400">{stats.pending}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-blue-400/80 mb-2">Processing</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-blue-400">{stats.processing}</span>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">In Transit</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">1</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-green-400/80 mb-2">Delivered</h3>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">Delivered (30d)</h3>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">{stats.delivered}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total My Revenue</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">LKR {stats.totalRevenue.toLocaleString()}</span>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">Return Requests</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">0</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
<<<<<<< HEAD
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input 
              type="text" 
              placeholder="Search by order ID, product or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors" 
=======
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer name..." 
              className="w-full bg-surface/50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Export</Button>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
<<<<<<< HEAD
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-textPrimary/40">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Failed to load orders. Please try again later.</p>
            </div>
          ) : filteredOrders?.length === 0 ? (
            <div className="p-12 text-center text-textPrimary/40">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No orders found matching your filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
                  <th className="p-4 pl-6">Order ID / Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">My Products</th>
                  <th className="p-4">My Share Value</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6"></th>
=======
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
                <th className="p-4 pl-6">Order ID / Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Value</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ORDERS.map((order, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{order.id}</span>
                      <span className="text-xs text-slate-500">{order.date}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-800">{order.customer}</td>
                  <td className="p-4 text-slate-800">{order.items} items</td>
                  <td className="p-4 font-bold text-slate-900">{order.total}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {order.status === 'Delivered' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      {order.status === 'Pending Fulfillment' && <Clock className="w-4 h-4 text-yellow-400" />}
                      {order.status === 'In Transit' && <MapPin className="w-4 h-4 text-blue-400" />}
                      <span className={cn(
                        order.status === 'Delivered' ? "text-green-400" : 
                        order.status === 'Pending Fulfillment' ? "text-yellow-400" : 
                        "text-blue-400"
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'Pending Fulfillment' && (
                        <button className="px-3 py-1.5 text-xs font-medium text-slate-900 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors border border-primary/20">
                          Ship Order
                        </button>
                      )}
                      <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5"/>
                      </button>
                    </div>
                  </td>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-textPrimary">#ORD-{order.orderId}</span>
                        <span className="text-xs text-textPrimary/50">{new Date(order.orderDate).toLocaleDateString()}</span>
                        <span className="text-xs text-textPrimary/40 line-clamp-1 max-w-[150px]">{order.shippingAddress || 'No address provided'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-textPrimary/80 font-medium">{order.customer?.name || 'Customer'}</span>
                        <span className="text-[10px] text-textPrimary/40">{order.customer?.email || 'No email'}</span>
                        <span className="text-[10px] text-textPrimary/40">{order.customer?.contactNumber}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.orderItemId} className="flex items-center gap-3">
                            <img
                              src={item.product?.imageUrl ? `http://localhost:5000${item.product.imageUrl}` : 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=100'}
                              alt={item.product?.productName || 'Product'}
                              className="w-8 h-8 rounded object-cover border border-white/10"
                            />
                            <div className="flex flex-col">
                              <span className="text-textPrimary/80 truncate max-w-[120px] text-xs">{item.product?.productName}</span>
                              <span className="text-[10px] text-textPrimary/40">LKR {parseFloat(item.unitPrice).toLocaleString()} x {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-textPrimary">LKR {order.sellerTotal.toLocaleString()}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                        className={cn(
                          "bg-surface border border-white/10 rounded-lg px-2 py-1 text-[10px] font-medium focus:outline-none transition-colors",
                          order.status === 'DELIVERED' ? "text-green-400 border-green-400/20" : 
                          order.status === 'PENDING' ? "text-yellow-400 border-yellow-400/20" : 
                          order.status === 'PROCESSING' ? "text-blue-400 border-blue-400/20" :
                          order.status === 'SHIPPED' ? "text-purple-400 border-purple-400/20" :
                          "text-red-400 border-red-400/20"
                        )}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};
