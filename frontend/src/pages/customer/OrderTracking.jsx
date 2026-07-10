import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, Clock, CheckCircle2, Truck, Phone, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const TRACKING_STEPS = [
  { id: 1, title: 'Order Placed', time: 'Oct 14, 09:30 AM', status: 'completed', desc: 'We have received your order.' },
  { id: 2, title: 'Confirmed by Vendor', time: 'Oct 14, 11:15 AM', status: 'completed', desc: 'Vendor has confirmed the details.' },
  { id: 3, title: 'Preparing Logistics', time: 'Oct 15, 08:00 AM', status: 'current', desc: 'Vendor is preparing the items for delivery/execution.' },
  { id: 4, title: 'On the Way', time: 'Pending', status: 'upcoming', desc: 'Driver is out for delivery.' },
  { id: 5, title: 'Delivered / Completed', time: 'Pending', status: 'upcoming', desc: 'Service has been fully rendered.' },
];

export const OrderTracking = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <MapPin className="w-7 h-7 text-primary" />
            Track Order #NXR-8492
          </h1>
          <p className="text-textPrimary/60">Estimated Completion: Oct 18, 2026</p>
        </div>
        <Button variant="outline" leftIcon={<MessageSquare className="w-4 h-4"/>}>Contact Vendor</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tracking Timeline */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/10" />
                
                <div className="space-y-8 relative">
                  {TRACKING_STEPS.map((step, i) => (
                    <div key={step.id} className="flex gap-6 relative">
                      <div className="shrink-0 relative z-10">
                        {step.status === 'completed' && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ring-4 ring-background">
                            <CheckCircle2 className="w-5 h-5 text-textPrimary" />
                          </div>
                        )}
                        {step.status === 'current' && (
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center ring-4 ring-background animate-pulse">
                            <Truck className="w-4 h-4 text-textPrimary" />
                          </div>
                        )}
                        {step.status === 'upcoming' && (
                          <div className="w-8 h-8 rounded-full bg-surface border-2 border-white/20 flex items-center justify-center ring-4 ring-background">
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                          </div>
                        )}
                      </div>
                      
                      <div className={cn(
                        "flex-1 pb-4",
                        step.status === 'upcoming' && "opacity-50"
                      )}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                          <h4 className={cn(
                            "font-bold text-lg",
                            step.status === 'current' ? "text-accent" : "text-textPrimary"
                          )}>{step.title}</h4>
                          <span className="text-xs font-mono text-textPrimary/40 bg-white/5 px-2 py-1 rounded">{step.time}</span>
                        </div>
                        <p className="text-sm text-textPrimary/60">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vendor Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  BC
                </div>
                <div>
                  <h4 className="font-bold text-textPrimary">Bloom Catering</h4>
                  <div className="flex items-center gap-1 text-xs text-yellow-400 mt-1">
                    ★ 4.9 <span className="text-textPrimary/40">(128 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm" leftIcon={<Phone className="w-4 h-4"/>}>Call</Button>
                <Button className="flex-1" size="sm" leftIcon={<MessageSquare className="w-4 h-4"/>}>Chat</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-textPrimary/40" />
                </div>
                <div>
                  <h5 className="font-medium text-sm text-textPrimary line-clamp-2">Premium 3-Course Wedding Menu</h5>
                  <span className="text-xs text-textPrimary/50">Qty: 150 pax</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5 space-y-2 text-sm">
                <div className="flex justify-between text-textPrimary/60">
                  <span>Subtotal</span>
                  <span className="text-textPrimary">LKR 12,500</span>
                </div>
                <div className="flex justify-between text-textPrimary/60">
                  <span>Logistics</span>
                  <span className="text-textPrimary">LKR 350</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-white/5 text-textPrimary">
                  <span>Total</span>
                  <span className="text-primary">LKR 12,850</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
