import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

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
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                      paymentMethod === 'card' ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-surface text-white/50 hover:bg-surface/80"
                    )}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-bold">Credit Card</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('paypal')}
                    className={cn(
                      "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                      paymentMethod === 'paypal' ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-surface text-white/50 hover:bg-surface/80"
                    )}
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 6.007 0h7.36c3.273 0 5.39 1.403 5.39 4.356 0 3.45-2.204 5.301-4.887 5.301h-2.14a.64.64 0 0 0-.632.535l-.76 4.79-.148.917a.641.641 0 0 1-.632.538H7.076z"/></svg>
                    <span className="font-bold">PayPal</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Cardholder Name</label>
                      <input type="text" placeholder="John Doe" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Card Number</label>
                      <div className="relative">
                        <CreditCard className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">CVV</label>
                        <input type="text" placeholder="123" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono" />
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
                      <h4 className="font-bold text-white text-sm">Grand Azure Resort Booking</h4>
                      <p className="text-xs text-white/50 mt-1">Oct 14, 2026 • Full Day Access</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span className="text-white">$4,500.00</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Service Fee (5%)</span>
                    <span className="text-white">$225.00</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Taxes</span>
                    <span className="text-white">$315.00</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="font-bold text-white">Total Due</span>
                  <span className="text-2xl font-bold text-primary">$5,040.00</span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  leftIcon={!isProcessing && <Lock className="w-4 h-4"/>}
                  onClick={() => setIsProcessing(true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing Payment...' : `Pay $5,040.00`}
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
