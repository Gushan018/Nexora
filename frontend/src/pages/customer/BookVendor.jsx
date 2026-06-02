import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, MessageSquare, ShieldCheck, ArrowRight, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const BookVendor = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  const PACKAGES = [
    { id: 1, name: 'Essential Coverage', price: '$1,500', hours: '4 Hours', desc: 'Perfect for intimate ceremonies and essential moments.' },
    { id: 2, name: 'Premium Full Day', price: '$3,200', hours: '8 Hours', desc: 'Full coverage from getting ready to the grand exit.', popular: true },
    { id: 3, name: 'Cinematic Ultimate', price: '$5,500', hours: '12 Hours', desc: 'Multiple shooters, drone coverage, and next-day edits.' },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Book with Lumiere Photography</h1>
          <p className="text-white/60">Configure your booking details and secure your date.</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors relative",
                step >= num ? "bg-primary text-white shadow-[0_0_20px_rgba(91,124,250,0.4)]" : "bg-surface border border-white/10 text-white/40"
              )}>
                {step > num ? <Check className="w-5 h-5"/> : num}
              </div>
              {num < 3 && (
                <div className={cn(
                  "w-24 h-1 transition-colors",
                  step > num ? "bg-primary" : "bg-white/10"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Booking Flow */}
          <div className="lg:col-span-2">
            <Card className="glass-card shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
              
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <CardHeader>
                    <CardTitle>Select a Package</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    {PACKAGES.map(pkg => (
                      <div 
                        key={pkg.id} 
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={cn(
                          "p-5 rounded-xl border cursor-pointer transition-all relative overflow-hidden",
                          selectedPackage === pkg.id 
                            ? "border-primary bg-primary/10" 
                            : "border-white/10 bg-surface/50 hover:bg-surface hover:border-white/30"
                        )}
                      >
                        {pkg.popular && (
                          <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                            Most Popular
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={cn(
                            "font-bold text-lg",
                            selectedPackage === pkg.id ? "text-primary" : "text-white"
                          )}>{pkg.name}</h3>
                          <span className="font-bold text-white">{pkg.price}</span>
                        </div>
                        <p className="text-sm text-white/60 mb-4">{pkg.desc}</p>
                        <div className="flex items-center gap-2 text-xs text-white/40 bg-white/5 w-fit px-2.5 py-1 rounded">
                          <Clock className="w-3.5 h-3.5" /> {pkg.hours} Coverage
                        </div>
                      </div>
                    ))}

                    <div className="pt-6 flex justify-end">
                      <Button 
                        disabled={!selectedPackage} 
                        onClick={() => setStep(2)}
                        rightIcon={<ChevronRight className="w-4 h-4"/>}
                      >
                        Continue to Details
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-6">
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Event Date</label>
                      <div className="relative">
                        <CalendarIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input type="date" className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Start Time</label>
                        <input type="time" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Guest Count</label>
                        <div className="relative">
                          <Users className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                          <input type="number" placeholder="150" className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Message to Vendor (Optional)</label>
                      <textarea 
                        rows="3" 
                        placeholder="Tell them a bit about your vision..." 
                        className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-6 flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button onClick={() => setStep(3)} rightIcon={<ChevronRight className="w-4 h-4"/>}>Review & Pay</Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <CardHeader>
                    <CardTitle>Confirm Booking</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-6">
                    
                    <div className="bg-surface border border-white/10 rounded-xl p-6 text-center space-y-2">
                      <p className="text-white/60">Total Amount Due</p>
                      <h2 className="text-4xl font-bold text-white">$3,200</h2>
                      <p className="text-sm text-primary">Due today: $640 (20% Deposit)</p>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
                      <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>Your deposit is held securely in escrow by Nexora. The vendor does not receive funds until they confirm the booking.</p>
                    </div>

                    <div className="pt-6 flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                      <Button rightIcon={<ArrowRight className="w-4 h-4"/>}>Proceed to Payment</Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-white/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                  <div className="w-16 h-16 rounded-xl bg-surface border border-white/10 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Lumiere Photo</h3>
                    <p className="text-xs text-white/50">Photography & Video</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="block text-white/40 mb-1 text-xs">Selected Package</span>
                    {selectedPackage ? (
                      <span className="font-medium text-white">{PACKAGES.find(p => p.id === selectedPackage)?.name}</span>
                    ) : (
                      <span className="text-white/20 italic">None selected</span>
                    )}
                  </div>
                  <div>
                    <span className="block text-white/40 mb-1 text-xs">Base Price</span>
                    <span className="font-medium text-white">
                      {selectedPackage ? PACKAGES.find(p => p.id === selectedPackage)?.price : '$0'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
