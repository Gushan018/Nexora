import React from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, ChevronRight, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';

// Mock data removed

const StatusIcon = ({ status }) => {
  switch(status) {
    case 'DELIVERED': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    case 'IN_TRANSIT': return <MapPin className="w-5 h-5 text-blue-400" />;
    case 'PROCESSING': 
    case 'PENDING': return <Clock className="w-5 h-5 text-yellow-400" />;
    default: return <Package className="w-5 h-5 text-slate-500" />;
  }
};

export const OrderHistory = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get('/orders/my');
      return res.data;
    }
  });

  const handleDownloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td>
          <strong>${item.product.productName}</strong><br/>
          <span style="color:#666; font-size:14px;">Qty: ${item.quantity}</span>
        </td>
        <td style="text-align: right;">LKR ${Number(item.unitPrice * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - #${order.orderId}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            h1 { margin: 0; color: #6366f1; }
            .total { font-size: 24px; font-weight: bold; margin-top: 40px; border-top: 2px solid #eee; padding-top: 20px; text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            th { color: #666; font-weight: 600; text-transform: uppercase; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <img src="${window.location.origin}/logo.png" alt="Nexora Logo" style="height: 48px; object-fit: contain; margin-bottom: 8px;" />
              <p style="color: #666; margin-top: 4px;">Premium Marketplace</p>
            </div>
            <div style="text-align: right;">
              <p><strong>INVOICE</strong></p>
              <p>#${order.orderId}</p>
              <p>${new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="total">
            Total Paid: LKR ${Number(order.totalAmount).toFixed(2)}
          </div>
          
          <p style="margin-top: 50px; color: #666; font-size: 12px; text-align: center;">
            Thank you for shopping with Nexora. This is a computer-generated document.
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (isLoading) return <PageLoader text="Loading order history..." />;
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
          <p className="text-slate-600">Track, return, or repurchase items from past orders.</p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by order ID or product name..." 
              className="w-full bg-surface/50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter Orders</Button>
        </div>
      </Card>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.orderId} className="overflow-hidden hover:border-slate-400 transition-colors">
            {/* Order Header */}
            <div className="bg-surface/50 p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="text-sm text-slate-800">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm text-slate-800">LKR {Number(order.totalAmount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Order #</p>
                  <p className="text-sm font-medium text-primary">#{order.orderId}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order)}>View Invoice</Button>
            </div>
            
            {/* Order Body */}
            <CardContent className="p-4 sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <StatusIcon status={order.status} />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{order.status}</h4>
                  <p className="text-sm text-slate-600">Shipped to: {order.shippingAddress}</p>
                </div>
              </div>

              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.orderItemId} className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-surface/30">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-surface shrink-0">
                      <img src={item.product.imageUrl || 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=100&q=80'} alt={item.product.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="font-medium text-slate-900 text-sm sm:text-base line-clamp-1">{item.product.productName}</h5>
                        <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex gap-3 mt-2 sm:mt-0 items-center">
                        <span className="text-xs font-medium text-slate-600">LKR {Number(item.unitPrice).toFixed(2)} each</span>
                        {order.status === 'DELIVERED' && (
                          <Link 
                            to={`/customer/review-submission?productId=${item.productId}`} 
                            className="text-xs font-medium text-primary hover:underline ml-2 bg-primary/10 px-2 py-1 rounded-md"
                          >
                            Write Review
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-20 border border-slate-300 rounded-2xl bg-surface/50">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
            <p className="text-slate-600">You haven't placed any orders.</p>
          </div>
        )}
      </div>
    </div>
  );
};
