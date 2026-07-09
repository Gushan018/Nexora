import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Receipt, ArrowRight, Download } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, resolveAssetUrl } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const OrderSuccess = () => {
  const { user } = useAuth();
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
  const brandingLogo = resolveAssetUrl('/logo.png');
  
  const handleDownloadInvoice = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${referenceId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 40px; margin: 0; background: #f8fafc; }
            .invoice-box { max-width: 800px; margin: 0 auto; background: #fff; padding: 50px; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; }
            .brand { display: flex; align-items: center; gap: 16px; }
            .brand img { height: 80px; object-fit: contain; }
            .invoice-meta { text-align: right; }
            .invoice-meta h2 { margin: 0 0 16px; font-size: 36px; color: #d4af37; letter-spacing: -1px; text-transform: uppercase; }
            .meta-row { display: flex; justify-content: flex-end; gap: 24px; font-size: 14px; margin-bottom: 8px; }
            .meta-label { color: #64748b; font-weight: 500; }
            .meta-val { color: #0f172a; font-weight: 600; }
            .customer-info { margin-bottom: 40px; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
            .customer-info h3 { margin: 0 0 8px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
            .customer-info p { margin: 0; color: #0f172a; font-weight: 500; font-size: 16px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 16px; background: #f8fafc; color: #64748b; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-y: 1px solid #e2e8f0; }
            th:first-child { border-radius: 8px 0 0 8px; border-left: 1px solid #e2e8f0; }
            th:last-child { border-radius: 0 8px 8px 0; border-right: 1px solid #e2e8f0; }
            .amount-col { text-align: right; }
            td { padding: 24px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
            .item-name { font-weight: 600; color: #0f172a; font-size: 15px; display: block; margin-bottom: 4px; }
            .item-qty { color: #64748b; font-size: 13px; }
            .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding: 32px; background: #0f172a !important; color: #fff !important; border-radius: 16px; box-shadow: 0 10px 25px rgba(15,23,42,0.15); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .total-label { font-size: 14px; color: #94a3b8 !important; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .total-amount { font-size: 36px; font-weight: 700; color: #d4af37 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .footer { text-align: center; margin-top: 60px; color: #94a3b8; font-size: 13px; }
            @media print { 
              body { background: #fff; padding: 0; } 
              .invoice-box { box-shadow: none; border: none; padding: 20px; } 
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div class="brand">
                <img src="${brandingLogo}" alt="Logo" onerror="this.style.display='none'" />
              </div>
              <div class="invoice-meta">
                <h2>INVOICE</h2>
                <div class="meta-row">
                  <span class="meta-label">Reference No:</span>
                  <span class="meta-val">${referenceId}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Date Issued:</span>
                  <span class="meta-val">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
            
            <div class="customer-info">
              <h3>Billed To</h3>
              <p>${user?.name || 'Valued Customer'}</p>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">${orderData?.shippingAddress || (isOrder ? 'Physical Delivery' : 'Event Booking')}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="amount-col">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span class="item-name">${itemName}</span>
                    <span class="item-qty">${isOrder ? 'Marketplace Products' : 'Vendor Booking'}</span>
                  </td>
                  <td class="amount-col" style="font-weight: 600; color: #0f172a;">LKR ${Number(amount).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="total-row">
              <div class="total-label">Total Amount Paid</div>
              <div class="total-amount">LKR ${Number(amount).toFixed(2)}</div>
            </div>
            
            <div class="footer">
              <p>Thank you for your business. For any inquiries, please contact support@eventnest.com.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{isOrder ? 'Order Confirmed!' : 'Booking Confirmed!'}</h1>
          <p className="text-lg text-slate-600 max-w-md">
            Thank you for your payment. Your {isOrder ? 'order' : 'booking'} has been successfully processed and the vendor has been notified.
          </p>
        </motion.div>

        <Card className="mb-8 border-primary/20 bg-surface/50 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="flex justify-between items-center pb-6 border-b border-slate-300 mb-6">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">{isOrder ? 'Order Reference' : 'Booking Reference'}</span>
                <span className="font-mono text-lg font-bold text-slate-900">{referenceId}</span>
              </div>
              <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4"/>} onClick={handleDownloadInvoice}>Invoice</Button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{itemName}</h3>
                  <p className="text-sm text-slate-600">{isOrder ? 'Marketplace Order' : 'Full Day Access • Standard Package'}</p>
                </div>
              </div>

              {!isOrder && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                      <Calendar className="w-3.5 h-3.5" /> Date & Time
                    </div>
                    <p className="text-sm font-medium text-slate-900">Oct 14, 2026</p>
                    <p className="text-sm text-slate-600">10:00 AM - 11:00 PM</p>
                  </div>
                  <div className="bg-slate-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                      <MapPin className="w-3.5 h-3.5" /> Location
                    </div>
                    <p className="text-sm font-medium text-slate-900">Kandy, Sri Lanka</p>
                    <p className="text-sm text-primary hover:underline cursor-pointer">Get Directions</p>
                  </div>
                </div>
              )}
              {isOrder && (
                <div className="bg-slate-100 rounded-xl p-4 mt-2">
                   <p className="text-sm text-slate-600">Your order will be shipped soon. You can track your order in your dashboard.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={isOrder ? "/customer/order-history" : "/customer/event-dashboard"} className="w-full sm:w-auto">
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
