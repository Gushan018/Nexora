import React from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, ChevronRight, CheckCircle2, Clock, MapPin, ListOrdered, Truck, Archive } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { api, resolveAssetUrl } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';

// Mock data removed

const StatusIcon = ({ status }) => {
  switch(status) {
    case 'DELIVERED': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    case 'IN_TRANSIT': return <MapPin className="w-5 h-5 text-blue-400" />;
    case 'PROCESSING': 
    case 'PENDING': return <Clock className="w-5 h-5 text-yellow-400" />;
<<<<<<< HEAD
    default: return <Package className="w-5 h-5 text-textPrimary/40" />;
=======
    default: return <Package className="w-5 h-5 text-slate-500" />;
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
  }
};

export const OrderHistory = () => {
  const [activeTab, setActiveTab] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get('/orders/my');
      return res.data;
    }
  });

  const filteredOrders = React.useMemo(() => {
    let result = orders;
    
    // Tab filtering
    if (activeTab === 'PENDING') result = result.filter(o => ['PENDING', 'PROCESSING'].includes(o.status));
    else if (activeTab === 'SHIPPING') result = result.filter(o => o.status === 'IN_TRANSIT');
    else if (activeTab === 'COMPLETED') result = result.filter(o => o.status === 'DELIVERED');

    // Search filtering
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => {
        const matchesId = String(o.orderId).toLowerCase().includes(q);
        const matchesProduct = o.orderItems?.some(item => 
          item.product?.productName?.toLowerCase().includes(q)
        );
        return matchesId || matchesProduct;
      });
    }
    return result;
  }, [orders, activeTab, searchQuery]);

  const tabs = [
    { id: 'ALL', label: 'All Orders', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'PENDING', label: 'Pending & Processing', icon: <Clock className="w-4 h-4" /> },
    { id: 'SHIPPING', label: 'On Shipping', icon: <Truck className="w-4 h-4" /> },
    { id: 'COMPLETED', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const brandingLogo = resolveAssetUrl('/logo.png');

  const handleDownloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td>
          <span class="item-name">${item.product.productName}</span>
          <span class="item-qty">Quantity: ${item.quantity}</span>
        </td>
        <td class="amount-col" style="color: #64748b;">LKR ${Number(item.unitPrice).toFixed(2)}</td>
        <td class="amount-col" style="font-weight: 600; color: #0f172a;">LKR ${Number(item.unitPrice * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - #${order.orderId}</title>
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
                  <span class="meta-label">Invoice No:</span>
                  <span class="meta-val">#${order.orderId}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Date Issued:</span>
                  <span class="meta-val">${new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
            
            <div class="customer-info">
              <h3>Billed To</h3>
              <p>${order.customer?.name || 'Valued Customer'}</p>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">${order.shippingAddress || 'Digital Delivery'}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="amount-col">Unit Price</th>
                  <th class="amount-col">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="total-row">
              <div class="total-label">Total Amount Paid</div>
              <div class="total-amount">LKR ${Number(order.totalAmount).toFixed(2)}</div>
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

  if (isLoading) return <PageLoader text="Loading order history..." />;
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary">Order History</h1>
          <p className="text-textPrimary/60">Track, return, or repurchase items from past orders.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
          <p className="text-slate-600">Track, return, or repurchase items from past orders.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2",
              activeTab === tab.id 
                ? "bg-primary text-slate-900 shadow-sm border border-primary/20" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
<<<<<<< HEAD
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input 
              type="text" 
              placeholder="Search by order ID or product name..." 
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors" 
=======
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by order ID or product name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-primary transition-colors"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            />
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-slate-600 py-12">No orders found for this status.</div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.orderId} className="overflow-hidden hover:border-slate-400 transition-colors">
            {/* Order Header */}
            <div className="bg-surface/50 p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <div>
<<<<<<< HEAD
                  <p className="text-xs text-textPrimary/40 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="text-sm text-textPrimary/90">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-textPrimary/40 font-medium uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm text-textPrimary/90">LKR {Number(order.totalAmount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-textPrimary/40 font-medium uppercase tracking-wider mb-1">Order #</p>
=======
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="text-sm text-slate-800">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm text-slate-800">LKR {Number(order.totalAmount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Order #</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
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
<<<<<<< HEAD
                  <h4 className="font-bold text-textPrimary text-lg">{order.status}</h4>
                  <p className="text-sm text-textPrimary/60">Shipped to: {order.shippingAddress}</p>
=======
                  <h4 className="font-bold text-slate-900 text-lg">{order.status}</h4>
                  <p className="text-sm text-slate-600">Shipped to: {order.shippingAddress}</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
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
<<<<<<< HEAD
                        <h5 className="font-medium text-textPrimary text-sm sm:text-base line-clamp-1">{item.product.productName}</h5>
                        <p className="text-sm text-textPrimary/50 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex gap-3 mt-2 sm:mt-0">
                        <span className="text-xs font-medium text-textPrimary/60">LKR {Number(item.unitPrice).toFixed(2)} each</span>
=======
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
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
<<<<<<< HEAD
        ))}
        {orders.length === 0 && (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-surface/50">
            <h2 className="text-2xl font-bold text-textPrimary mb-2">No orders yet</h2>
            <p className="text-textPrimary/60">You haven't placed any orders.</p>
          </div>
        )}
=======
        )))}
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
      </div>
    </div>
  );
};
