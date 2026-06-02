import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Package, Truck, CheckCircle2, Clock, MapPin, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const ORDERS = [
  { id: '#ORD-901', customer: 'Sarah Jenkins', date: 'Oct 24, 2026', items: 3, total: '$450.00', status: 'Pending Fulfillment' },
  { id: '#ORD-902', customer: 'TechNova Corp', date: 'Oct 23, 2026', items: 10, total: '$1,200.00', status: 'In Transit' },
  { id: '#ORD-903', customer: 'Michael Chen', date: 'Oct 20, 2026', items: 1, total: '$85.00', status: 'Delivered' },
  { id: '#ORD-904', customer: 'Elena Rossi', date: 'Oct 19, 2026', items: 5, total: '$225.00', status: 'Delivered' },
];

export const OrderManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Order Management
          </h1>
          <p className="text-white/60">Process physical orders, print labels, and track shipments.</p>
        </div>
        <Button leftIcon={<Truck className="w-4 h-4"/>}>Print Pending Labels (1)</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-yellow-400/80 mb-2">To Fulfill</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-400">1</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">In Transit</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">1</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Delivered (30d)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">42</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Return Requests</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer name..." 
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Date</Button>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Status</Button>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
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
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{order.id}</span>
                      <span className="text-xs text-white/50">{order.date}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/80">{order.customer}</td>
                  <td className="p-4 text-white/80">{order.items} items</td>
                  <td className="p-4 font-bold text-white">{order.total}</td>
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
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors border border-primary/20">
                          Ship Order
                        </button>
                      )}
                      <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
