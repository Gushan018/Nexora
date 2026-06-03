import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, MessageSquare, ShieldCheck, ArrowRight, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';

export const BookVendor = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [eventDate, setEventDate] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vendorId = searchParams.get('id');

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      const res = await api.get(`/vendors/${vendorId}`);
      return res.data;
    },
    enabled: !!vendorId
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/bookings', {
        packageId: selectedPackage,
        eventDate: eventDate || new Date().toISOString(),
        location: 'Default Location', // In a full implementation we would have an input for this
        notes: message
      });
      return res.data;
    },
    onSuccess: () => {
      alert('Booking request sent successfully!');
      navigate('/customer/booking-history');
    },
    onError: (err) => {
      console.error(err);
      alert(`${err.response?.data?.message || 'Failed to send booking request.'} Details: ${err.response?.data?.error || err.message}`);
    }
  });

  const PACKAGES = vendor?.eventPackages || [];

  if (isLoading) return <PageLoader text="Loading vendor details..." />;
  if (!vendor) return <div className="pt-32 pb-20 text-center text-white">Vendor not found.</div>;

  const selectedPkgData = PACKAGES.find(p => p.packageId === selectedPackage);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-primary/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-accent/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            Book with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{vendor.businessName}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg"
          >
            Configure your booking details and secure your date.
          </motion.p>
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
            <Card className="bg-surface/40 backdrop-blur-xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
              
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <CardHeader>
                    <CardTitle>Select a Package</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    {PACKAGES.length === 0 && (
                      <div className="text-center text-white/60 py-8">This vendor has no packages available.</div>
                    )}
                    {PACKAGES.map(pkg => (
                      <div 
                        key={pkg.packageId} 
                        onClick={() => setSelectedPackage(pkg.packageId)}
                        className={cn(
                          "p-6 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group/item",
                          selectedPackage === pkg.packageId 
                            ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(124,58,237,0.15)] -translate-y-1" 
                            : "border-white/10 bg-black/40 hover:bg-black/60 hover:border-white/30 hover:-translate-y-1"
                        )}
                      >
                        {selectedPackage === pkg.packageId && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none" />
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={cn(
                            "font-bold text-lg",
                            selectedPackage === pkg.packageId ? "text-primary" : "text-white"
                          )}>{pkg.packageName}</h3>
                          <span className="font-bold text-white">LKR {Number(pkg.price).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-white/60 mb-4">{pkg.description || 'No description available.'}</p>
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
                        <input 
                          type="date" 
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Message to Vendor (Optional)</label>
                      <textarea 
                        rows="3" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell them a bit about your vision..." 
                        className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-6 flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button onClick={() => setStep(3)} rightIcon={<ChevronRight className="w-4 h-4"/>} disabled={!eventDate}>Review</Button>
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
                      <h2 className="text-4xl font-bold text-white">LKR {selectedPkgData ? Number(selectedPkgData.price).toFixed(2) : '0.00'}</h2>
                    </div>

                    <div className="pt-6 flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)} disabled={bookMutation.isPending}>Back</Button>
                      <Button rightIcon={<ArrowRight className="w-4 h-4"/>} onClick={() => bookMutation.mutate()} disabled={bookMutation.isPending}>
                        {bookMutation.isPending ? 'Sending Request...' : 'Send Booking Request'}
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24 bg-surface/40 backdrop-blur-xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 shrink-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{vendor.businessName.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{vendor.businessName}</h3>
                    <p className="text-xs text-primary font-medium tracking-wider uppercase">{vendor.vendorType}</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="block text-white/40 mb-1 text-xs">Selected Package</span>
                    {selectedPkgData ? (
                      <span className="font-medium text-white">{selectedPkgData.packageName}</span>
                    ) : (
                      <span className="text-white/20 italic">None selected</span>
                    )}
                  </div>
                  <div>
                    <span className="block text-white/40 mb-1 text-xs">Base Price</span>
                    <span className="font-medium text-white">LKR {selectedPkgData ? Number(selectedPkgData.price).toFixed(2) : '0.00'}
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
