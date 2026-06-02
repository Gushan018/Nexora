import React from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, ChevronRight, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const ORDERS = [
  {
    id: '#ORD-8921-X',
    date: 'Oct 24, 2026',
    status: 'Delivered',
    total: '$345.50',
    items: [
      { name: 'Crystal Wine Glasses (Set of 12)', qty: 2, image: 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=100&q=80' }
    ],
    tracking: 'Delivered on Oct 26, 2026 at 2:30 PM'
  },
  {
    id: '#ORD-8890-Y',
    date: 'Oct 18, 2026',
    status: 'In Transit',
    total: '$1,200.00',
    items: [
      { name: 'Premium Gold Cutlery Set (100 Pieces)', qty: 1, image: 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=100&q=80&grayscale' },
      { name: 'Silk Table Linens', qty: 5, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100&q=80' }
    ],
    tracking: 'Arriving by Oct 30, 2026'
  },
  {
    id: '#ORD-8845-Z',
    date: 'Sep 05, 2026',
    status: 'Processing',
    total: '$85.00',
    items: [
      { name: 'LED String Lights (50ft)', qty: 3, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&q=80' }
    ],
    tracking: 'Preparing for shipment'
  }
];

const StatusIcon = ({ status }) => {
  switch(status) {
    case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    case 'In Transit': return <MapPin className="w-5 h-5 text-blue-400" />;
    case 'Processing': return <Clock className="w-5 h-5 text-yellow-400" />;
    default: return <Package className="w-5 h-5 text-white/40" />;
  }
};

export const OrderHistory = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Order History</h1>
          <p className="text-white/60">Track, return, or repurchase items from past orders.</p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by order ID or product name..." 
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter Orders</Button>
        </div>
      </Card>

      <div className="space-y-6">
        {ORDERS.map((order, i) => (
          <Card key={i} className="overflow-hidden hover:border-white/20 transition-colors">
            {/* Order Header */}
            <div className="bg-surface/50 p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <div>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="text-sm text-white/90">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm text-white/90">{order.total}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">Order #</p>
                  <p className="text-sm font-medium text-primary">{order.id}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Invoice</Button>
            </div>
            
            {/* Order Body */}
            <CardContent className="p-4 sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <StatusIcon status={order.status} />
                <div>
                  <h4 className="font-bold text-white text-lg">{order.status}</h4>
                  <p className="text-sm text-white/60">{order.tracking}</p>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item, j) => (
                  <div key={j} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-surface/30">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-surface shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="font-medium text-white text-sm sm:text-base line-clamp-1">{item.name}</h5>
                        <p className="text-sm text-white/50 mt-1">Qty: {item.qty}</p>
                      </div>
                      <div className="flex gap-3 mt-2 sm:mt-0">
                        <button className="text-xs font-medium text-primary hover:underline">Track Package</button>
                        <span className="text-white/20">|</span>
                        <button className="text-xs font-medium text-white/60 hover:text-white transition-colors">Write Review</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
