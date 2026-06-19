import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../utils/api';

export const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [cardErrors, setCardErrors] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const validateCard = () => {
    const errors = {};
    if (paymentMethod === 'ONLINE') {
      const num = cardDetails.number.replace(/\s+/g, '');
      if (!/^\d{16}$/.test(num)) errors.number = '16-digit card number required';
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        errors.expiry = 'Format: MM/YY';
      } else {
        const [month, year] = cardDetails.expiry.split('/');
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);
        const currentYear = parseInt(new Date().getFullYear().toString().slice(2), 10);
        const currentMonth = new Date().getMonth() + 1;
        
        if (m < 1 || m > 12) {
          errors.expiry = 'Invalid month';
        } else if (y < currentYear || (y === currentYear && m < currentMonth)) {
          errors.expiry = 'Card expired';
        }
      }
      if (!/^\d{3,4}$/.test(cardDetails.cvc)) errors.cvc = '3-4 digits required';
      if (!cardDetails.name.trim()) errors.name = 'Name on card is required';
    }
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
    if (formatted.length > 19) formatted = formatted.slice(0, 19);
    setCardDetails({ ...cardDetails, number: formatted });
    if (cardErrors.number) setCardErrors({ ...cardErrors, number: null });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    let formatted = val;
    if (val.length >= 2) formatted = `${val.slice(0, 2)}${val.length > 2 ? '/' + val.slice(2) : ''}`;
    setCardDetails({ ...cardDetails, expiry: formatted });
    if (cardErrors.expiry) setCardErrors({ ...cardErrors, expiry: null });
  };

  const handleCvcChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    setCardDetails({ ...cardDetails, cvc: val });
    if (cardErrors.cvc) setCardErrors({ ...cardErrors, cvc: null });
  };

  const amount = searchParams.get('amount') || '0.00';
  const orderId = searchParams.get('orderId');
  const bookingId = searchParams.get('bookingId');
  const itemName = searchParams.get('item') || 'Order Payment';

  const paymentMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/payments/pay', {
        amount,
        paymentMethod,
        orderId,
        bookingId,
        transactionId: paymentMethod === 'ONLINE' ? 'txn_' + Math.floor(Math.random() * 1000000) : null
      });
      return res.data;
    },
    onSuccess: () => {
      navigate('/customer/order-success');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Payment failed.');
    }
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Secure Checkout</h1>
          <p className="text-white/60">Complete your payment to confirm your booking.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={cn(
                      "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                      paymentMethod === 'ONLINE' ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-surface text-white/50 hover:bg-surface/80"
                    )}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-bold">Pay Online</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('BANK_SLIP')}
                    className={cn(
                      "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                      paymentMethod === 'BANK_SLIP' ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-surface text-white/50 hover:bg-surface/80"
                    )}
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 6.007 0h7.36c3.273 0 5.39 1.403 5.39 4.356 0 3.45-2.204 5.301-4.887 5.301h-2.14a.64.64 0 0 0-.632.535l-.76 4.79-.148.917a.641.641 0 0 1-.632.538H7.076z"/></svg>
                    <span className="font-bold">Bank Slip</span>
                  </button>
                </div>

                {paymentMethod === 'ONLINE' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Cardholder Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className={cn("w-full bg-surface border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors", cardErrors.name ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-primary")}
                        value={cardDetails.name}
                        onChange={(e) => {
                          setCardDetails({...cardDetails, name: e.target.value});
                          if (cardErrors.name) setCardErrors({...cardErrors, name: null});
                        }}
                      />
                      {cardErrors.name && <p className="text-red-400 text-xs mt-1">{cardErrors.name}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Card Number</label>
                      <div className="relative">
                        <CreditCard className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000" 
                          className={cn("w-full bg-surface border rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none transition-colors font-mono", cardErrors.number ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-primary")}
                          value={cardDetails.number}
                          onChange={handleNumberChange}
                        />
                      </div>
                      {cardErrors.number && <p className="text-red-400 text-xs mt-1">{cardErrors.number}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          className={cn("w-full bg-surface border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors font-mono", cardErrors.expiry ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-primary")}
                          value={cardDetails.expiry}
                          onChange={handleExpiryChange}
                        />
                        {cardErrors.expiry && <p className="text-red-400 text-xs mt-1">{cardErrors.expiry}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">CVV</label>
                        <input 
                          type="password" 
                          placeholder="123" 
                          className={cn("w-full bg-surface border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors font-mono", cardErrors.cvc ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-primary")}
                          value={cardDetails.cvc}
                          onChange={handleCvcChange}
                        />
                        {cardErrors.cvc && <p className="text-red-400 text-xs mt-1">{cardErrors.cvc}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'BANK_SLIP' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4">
                    <div className="space-y-4 p-4 rounded-xl bg-surface border border-white/10">
                      <div className="flex items-start gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium text-sm">Upload Payment Slip</p>
                          <p className="text-white/60 text-xs mt-1">Please transfer the total amount to our bank account and upload the receipt here.</p>
                        </div>
                      </div>
                      <div className="bg-background rounded-lg p-3 text-sm text-white/80 border border-white/5 mb-4">
                        <p><strong>Bank:</strong> Commercial Bank</p>
                        <p><strong>Account Name:</strong> Nexora Marketplace</p>
                        <p><strong>Account No:</strong> 1234567890</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Payment Slip Image (Optional in Demo)</label>
                        <input type="file" accept="image/*,.pdf" className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 mt-6">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <p>Your payment information is encrypted and securely processed by Stripe. We never store your full card details.</p>
                </div>
                
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-primary/20 bg-surface/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-white/5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{itemName}</h4>
                      <p className="text-xs text-white/50 mt-1">Total Payment</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="font-bold text-white">Total Due</span>
                  <span className="text-2xl font-bold text-primary">LKR {Number(amount).toFixed(2)}</span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  leftIcon={!paymentMutation.isPending && <Lock className="w-4 h-4"/>}
                  onClick={() => {
                    if (paymentMethod === 'ONLINE' && !validateCard()) return;
                    paymentMutation.mutate();
                  }}
                  disabled={paymentMutation.isPending || (!orderId && !bookingId)}
                >
                  {paymentMutation.isPending ? 'Processing...' : `Pay LKR ${Number(amount).toFixed(2)}`}
                </Button>

                <p className="text-center text-xs text-white/40">
                  By confirming, you agree to our Terms of Service and Cancellation Policy.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
