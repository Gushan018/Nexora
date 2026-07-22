import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../../components/common/PageLoader';

export const Checkout = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [shippingAddress, setShippingAddress] = useState('');
  
  const validateCard = () => true; // No longer needed here
  const handleReviewOrder = () => setStep(2);

  const handleNumberChange = (e) => {};
  const handleExpiryChange = (e) => {};
  const handleCvcChange = (e) => {};

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const res = await api.get('/cart');
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return { cartItems: [] };
        throw err;
      }
    }
  });

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/orders/checkout', {
        shippingAddress: shippingAddress || 'Default Address',
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['orders']);
      
      const orderAmount = total.toFixed(2);
      navigate(`/customer/payment-page?orderId=${data.order.orderId}&amount=${orderAmount}&item=Marketplace%20Order`);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to place order.');
    }
  });

  const items = cart?.cartItems || [];
  const subtotal = items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  const tax = subtotal * 0.10; 
  const shipping = items.length > 0 ? 15.00 : 0;
  const total = subtotal + tax + shipping;

  if (isLoading) return <PageLoader text="Loading checkout..." />;
  if (items.length === 0) return <div className="pt-32 pb-20 text-center text-slate-900 dark:text-white font-medium">Your cart is empty. Please add items to checkout.</div>;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        <div className="mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">Checkout</h1>
          <p className="text-slate-600 dark:text-slate-300">Complete your purchase securely.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Shipping */}
            <Card className={cn("transition-all duration-300 border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C2333]", step !== 1 && "opacity-60")}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  step === 1 ? "bg-primary text-slate-950 font-bold" : step > 1 ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                )}>
                  {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Shipping Details</CardTitle>
              </CardHeader>
              {step === 1 && (
                <CardContent className="pt-4 space-y-6">
                  <Input 
                    label="Full Shipping Address" 
                    placeholder="123 Main St, City, Postal Code" 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <Button onClick={() => setStep(2)} className="w-full mt-4 bg-primary text-slate-950 font-bold hover:bg-primary/90" disabled={shippingAddress.trim().length < 10}>Review Order (Requires Full Address)</Button>
                </CardContent>
              )}
            </Card>

          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C2333]">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
                       <img src={item.product.imageUrl || 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=100&q=80'} alt={item.product.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white font-semibold text-sm line-clamp-2">{item.product.productName}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Qty: {item.quantity}</p>
                      <p className="text-slate-900 dark:text-white font-bold mt-1">LKR {(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <div className="space-y-3 text-sm border-b border-slate-200 dark:border-white/10 pb-6">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">LKR {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-900 dark:text-white">LKR {shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                    <span>Tax (VAT)</span>
                    <span className="font-bold text-slate-900 dark:text-white">LKR {tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-primary font-extrabold text-xl">LKR {total.toFixed(2)}</span>
                </div>

                <Button 
                  className="w-full h-12 text-lg font-bold mt-4 bg-primary text-slate-950 hover:bg-primary/90" 
                  disabled={step !== 2 || placeOrderMutation.isPending}
                  onClick={() => placeOrderMutation.mutate()}
                >
                  {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure encrypted checkout
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

