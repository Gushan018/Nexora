import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';

export const Checkout = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-white/60">Complete your purchase securely.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Shipping */}
            <Card className={cn("transition-all duration-300", step !== 1 && "opacity-60")}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  step === 1 ? "bg-primary text-white" : step > 1 ? "bg-green-500 text-white" : "bg-white/10 text-white/50"
                )}>
                  {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                </div>
                <CardTitle className="text-xl">Shipping Details</CardTitle>
              </CardHeader>
              {step === 1 && (
                <CardContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="Jane" />
                    <Input label="Last Name" placeholder="Doe" />
                  </div>
                  <Input label="Street Address" placeholder="123 Main St" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" placeholder="Colombo" />
                    <Input label="Postal Code" placeholder="00300" />
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full mt-4">Continue to Payment</Button>
                </CardContent>
              )}
            </Card>

            {/* Step 2: Payment */}
            <Card className={cn("transition-all duration-300", step !== 2 && "opacity-60")}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  step === 2 ? "bg-primary text-white" : step > 2 ? "bg-green-500 text-white" : "bg-white/10 text-white/50"
                )}>
                  {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                </div>
                <CardTitle className="text-xl">Payment Method</CardTitle>
              </CardHeader>
              {step === 2 && (
                <CardContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={cn(
                        "p-4 rounded-xl border flex flex-col items-center gap-2 transition-colors",
                        paymentMethod === 'card' ? "bg-primary/20 border-primary text-white" : "bg-surface border-white/10 text-white/60 hover:bg-white/5"
                      )}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="font-medium text-sm">Credit Card</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('paypal')}
                      className={cn(
                        "p-4 rounded-xl border flex flex-col items-center gap-2 transition-colors",
                        paymentMethod === 'paypal' ? "bg-primary/20 border-primary text-white" : "bg-surface border-white/10 text-white/60 hover:bg-white/5"
                      )}
                    >
                      <ShieldCheck className="w-6 h-6" />
                      <span className="font-medium text-sm">PayPal</span>
                    </button>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <Input label="Card Number" placeholder="0000 0000 0000 0000" leftIcon={<CreditCard className="w-4 h-4"/>} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiry Date" placeholder="MM/YY" />
                        <Input label="CVC" placeholder="123" />
                      </div>
                      <Input label="Name on Card" placeholder="JANE DOE" />
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={() => setStep(3)} className="flex-1">Review Order</Button>
                  </div>
                </CardContent>
              )}
            </Card>

          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 pb-4 border-b border-white/10">
                  <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=100&q=80" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm line-clamp-2">Premium Gold Cutlery Set (100 Pieces)</p>
                    <p className="text-white/60 text-xs mt-1">Qty: 2</p>
                    <p className="text-white font-bold mt-1">$240.00</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm border-b border-white/10 pb-6">
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal</span>
                    <span>$240.00</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Shipping</span>
                    <span>$15.00</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Tax (VAT)</span>
                    <span>$24.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-white">
                  <span>Total</span>
                  <span>$279.00</span>
                </div>

                <Button className="w-full h-12 text-lg mt-4" disabled={step !== 3}>
                  Place Order
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-white/40 mt-4">
                  <ShieldCheck className="w-4 h-4 text-green-400" /> Secure encrypted checkout
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
