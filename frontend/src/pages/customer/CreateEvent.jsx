import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Check, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const CreateEvent = () => {
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState('');

  const EVENT_TYPES = [
    { id: 'wedding', name: 'Wedding', icon: '💍', desc: 'Ceremonies, Receptions, Anniversaries' },
    { id: 'corporate', name: 'Corporate Event', icon: '🏢', desc: 'Conferences, Seminars, Galas' },
    { id: 'party', name: 'Private Party', icon: '🎉', desc: 'Birthdays, Showers, Gatherings' },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-3xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Let's plan something amazing.</h1>
          <p className="text-white/60">Tell us a bit about your event, and we'll setup your custom dashboard.</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                step >= num ? "bg-primary text-white" : "bg-surface border border-white/10 text-white/40"
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

        <Card className="glass-card shadow-2xl overflow-hidden relative">
          {/* Decorative background glow */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">What type of event are you planning?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-8 pt-0">
                {EVENT_TYPES.map(type => (
                  <button 
                    key={type.id}
                    onClick={() => setEventType(type.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                      eventType === type.id 
                        ? "border-primary bg-primary/10" 
                        : "border-white/10 bg-surface/50 hover:bg-surface hover:border-white/30"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl shrink-0">
                      {type.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{type.name}</h3>
                      <p className="text-sm text-white/60">{type.desc}</p>
                    </div>
                  </button>
                ))}

                <div className="pt-8 flex justify-end">
                  <Button 
                    disabled={!eventType} 
                    onClick={() => setStep(2)}
                    rightIcon={<ChevronRight className="w-4 h-4"/>}
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">The Basics</CardTitle>
                <CardDescription>Give your event a name and tell us when it is.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Event Name</label>
                  <input type="text" placeholder="e.g. Sarah & John's Wedding" className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-lg" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Date</label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input type="date" className="w-full bg-surface/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Estimated Guests</label>
                    <div className="relative">
                      <Users className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input type="number" placeholder="150" className="w-full bg-surface/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">City / Location</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input type="text" placeholder="e.g. Colombo, Sri Lanka" className="w-full bg-surface/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <div className="pt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)} rightIcon={<ChevronRight className="w-4 h-4"/>}>Next Step</Button>
                </div>
              </CardContent>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Budget Configuration</CardTitle>
                <CardDescription>We'll help you track your spending automatically.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Total Estimated Budget (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">$</span>
                    <input type="number" placeholder="15000" className="w-full bg-surface/50 border border-white/10 rounded-xl pl-8 pr-4 py-4 text-2xl font-bold text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
                  Based on your event type and guest count, Nexora will automatically generate a recommended budget breakdown for Venues, Catering, Photography, and more.
                </div>

                <div className="pt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button rightIcon={<Check className="w-4 h-4"/>}>Create Event Dashboard</Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
};
