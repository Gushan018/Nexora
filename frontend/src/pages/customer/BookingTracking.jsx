import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, AlertCircle, MapPin, Search, Activity, CheckCircle2, Phone, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const MILESTONES = [
  { id: 1, title: 'Deposit Paid & Contract Signed', date: 'Oct 01, 2026', status: 'completed', desc: 'Your date is officially secured.' },
  { id: 2, title: 'Pre-Event Consultation', date: 'Oct 05, 2026', status: 'completed', desc: 'Discussed shot list and locations with the photographer.' },
  { id: 3, title: 'Final Balance Due', date: 'Oct 10, 2026', status: 'current', desc: 'Remaining LKR 2,560 is due 4 days prior to the event.' },
  { id: 4, title: 'Event Day Execution', date: 'Oct 14, 2026', status: 'upcoming', desc: 'Photographer arrives at 10:00 AM.' },
  { id: 5, title: 'Gallery Delivery', date: 'Nov 01, 2026', status: 'upcoming', desc: 'High-resolution edited photos delivered via Nexora.' },
];

export const BookingTracking = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary" />
            Booking Progress
          </h1>
          <p className="text-slate-600">Track milestones and upcoming requirements for your booking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tracking Timeline */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Milestone Tracker</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-200" />
                
                <div className="space-y-8 relative">
                  {MILESTONES.map((step) => (
                    <div key={step.id} className="flex gap-6 relative">
                      <div className="shrink-0 relative z-10">
                        {step.status === 'completed' && (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-background">
                            <CheckCircle2 className="w-5 h-5 text-slate-900" />
                          </div>
                        )}
                        {step.status === 'current' && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ring-4 ring-background animate-pulse">
                            <AlertCircle className="w-4 h-4 text-slate-900" />
                          </div>
                        )}
                        {step.status === 'upcoming' && (
                          <div className="w-8 h-8 rounded-full bg-surface border-2 border-slate-400 flex items-center justify-center ring-4 ring-background">
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
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
                            step.status === 'current' ? "text-primary" : "text-slate-900"
                          )}>{step.title}</h4>
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{step.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{step.desc}</p>
                        
                        {step.status === 'current' && step.id === 3 && (
                          <Button size="sm">Pay Final Balance</Button>
                        )}
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
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Lumiere Photo</h4>
                  <p className="text-xs text-slate-500">Photography Services</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm" leftIcon={<Phone className="w-4 h-4"/>}>Call</Button>
                <Button className="flex-1" size="sm" leftIcon={<MessageSquare className="w-4 h-4"/>}>Chat</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 text-sm">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-primary" /> Action Required
              </h4>
              <p className="text-slate-800 leading-relaxed">
                Your final balance of <span className="font-bold text-slate-900">LKR 2,560.00</span> is due in 4 days. Please complete the payment to avoid cancellation.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
