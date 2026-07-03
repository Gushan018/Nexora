import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Receipt, ArrowRight, Download } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';

export const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'booking';
  const isOrder = type === 'order';
  const id = searchParams.get('id') || 'N/A';
  const amount = searchParams.get('amount') || '0.00';
  let itemName = searchParams.get('item') || (isOrder ? 'Marketplace Items' : 'Grand Azure Resort');
  
  const { data: myOrders } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await api.get('/orders/my');
      return res.data;
    },
    enabled: isOrder && id !== 'N/A'
  });

  const orderData = myOrders?.find(o => o.orderId.toString() === id);
  if (isOrder && orderData && orderData.orderItems?.length > 0) {
    itemName = orderData.orderItems.map(item => item.product.productName).join(', ');
  }
  
  const referenceId = `#NXR-${isOrder ? 'ORD' : 'BKG'}-${id.padStart(4, '0')}`;
  
  const handleDownloadInvoice = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${referenceId}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            h1 { margin: 0; color: #6366f1; }
            .total { font-size: 24px; font-weight: bold; margin-top: 40px; border-top: 2px solid #eee; padding-top: 20px; text-align: right; }
            table { w-full; width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            th { color: #666; font-weight: 600; text-transform: uppercase; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>NEXORA</h1>
              <p style="color: #666; margin-top: 4px;">Premium Marketplace</p>
            </div>
            <div style="text-align: right;">
              <p><strong>INVOICE</strong></p>
              <p>${referenceId}</p>
              <p>${new Date().toLocaleDateString()}</p>
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
              <tr>
                <td>
                  <strong>${itemName}</strong><br/>
                  <span style="color:#666; font-size:14px;">${isOrder ? 'Physical Product Delivery' : 'Full Day Access • Standard Package'}<br/>
                  ${isOrder ? 'Standard Shipping' : 'Oct 14, 2026 | 10:00 AM - 11:00 PM'}</span>
                </td>
                <td style="text-align: right;">LKR ${Number(amount).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total">
            Total Paid: LKR ${Number(amount).toFixed(2)}
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

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="container mx-auto px-6 max-w-2xl">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{isOrder ? 'Order Confirmed!' : 'Booking Confirmed!'}</h1>
          <p className="text-lg text-white/60 max-w-md">
            Thank you for your payment. Your {isOrder ? 'order' : 'booking'} has been successfully processed and the vendor has been notified.
          </p>
        </motion.div>

        <Card className="mb-8 border-primary/20 bg-surface/50 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="flex justify-between items-center pb-6 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs text-white/40 uppercase tracking-wider block mb-1">{isOrder ? 'Order Reference' : 'Booking Reference'}</span>
                <span className="font-mono text-lg font-bold text-white">{referenceId}</span>
              </div>
              <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4"/>} onClick={handleDownloadInvoice}>Invoice</Button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{itemName}</h3>
                  <p className="text-sm text-white/60">{isOrder ? 'Marketplace Order' : 'Full Day Access • Standard Package'}</p>
                </div>
              </div>

              {!isOrder && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                      <Calendar className="w-3.5 h-3.5" /> Date & Time
                    </div>
                    <p className="text-sm font-medium text-white">Oct 14, 2026</p>
                    <p className="text-sm text-white/60">10:00 AM - 11:00 PM</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                      <MapPin className="w-3.5 h-3.5" /> Location
                    </div>
                    <p className="text-sm font-medium text-white">Kandy, Sri Lanka</p>
                    <p className="text-sm text-primary hover:underline cursor-pointer">Get Directions</p>
                  </div>
                </div>
              )}
              {isOrder && (
                <div className="bg-white/5 rounded-xl p-4 mt-2">
                   <p className="text-sm text-white/60">Your order will be shipped soon. You can track your order in your dashboard.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={isOrder ? "/customer/order-history" : "/customer/booking-history"} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">{isOrder ? 'View My Orders' : 'View My Bookings'}</Button>
          </Link>
          <Link to="/customer/dashboard" className="w-full sm:w-auto">
            <Button className="w-full" rightIcon={<ArrowRight className="w-4 h-4"/>}>Return to Dashboard</Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
