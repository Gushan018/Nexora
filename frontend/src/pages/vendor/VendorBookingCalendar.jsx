import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

// Simple mock data for calendar visualization
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MOCK_EVENTS = {
  14: [{ title: 'TechNova Gala', time: '18:00', type: 'Corporate' }],
  18: [{ title: 'Sarah & John Wedding', time: '14:00', type: 'Wedding' }],
  22: [{ title: 'Elena Birthday', time: '19:30', type: 'Private' }],
};

export const VendorBookingCalendar = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-primary" />
            Booking Calendar
          </h1>
          <p className="text-white/60">Manage your schedule and availability for upcoming events.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Sync with Google Calendar</Button>
          <Button>Add Manual Block</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Calendar View */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            {/* Calendar Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">October 2026</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-surface border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-surface border border-white/10 rounded-lg text-white text-sm font-medium hover:bg-white/5 transition-colors">
                  Today
                </button>
                <button className="p-2 bg-surface border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-white/5">
              {DAYS.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-white/50 border-r border-white/5 last:border-0">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 grid-rows-5 bg-surface/30">
              {[...Array(35)].map((_, i) => {
                const dayNumber = i - 3; // Offset to simulate month starting on Thu
                const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
                const hasEvent = MOCK_EVENTS[dayNumber];
                
                return (
                  <div key={i} className={cn(
                    "min-h-[100px] p-2 border-r border-b border-white/5 last:border-r-0 transition-colors hover:bg-white/[0.02]",
                    !isCurrentMonth && "opacity-30 bg-black/20"
                  )}>
                    {isCurrentMonth && (
                      <>
                        <span className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1",
                          dayNumber === 24 ? "bg-primary text-white" : "text-white/80"
                        )}>
                          {dayNumber}
                        </span>
                        
                        {hasEvent && hasEvent.map((evt, idx) => (
                          <div key={idx} className="bg-primary/20 border border-primary/30 rounded p-1 mb-1 truncate cursor-pointer hover:bg-primary/30 transition-colors">
                            <span className="text-[10px] text-primary font-bold block">{evt.time}</span>
                            <span className="text-[11px] text-white truncate">{evt.title}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-4">
          <h3 className="font-bold text-white mb-2">Upcoming this week</h3>
          
          <Card className="border-primary/50 relative overflow-hidden group hover:border-primary transition-colors cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <CardContent className="p-4 pl-5">
              <h4 className="text-white font-bold mb-3 group-hover:text-primary transition-colors">TechNova Corporate Gala</h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-white/40"/> Oct 14, 18:00 - 23:00</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/40"/> Grand Hyatt Ballroom</div>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-white/40"/> Contact: Michael Chen</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 hover:border-white/30 transition-colors cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
            <CardContent className="p-4 pl-5">
              <h4 className="text-white font-bold mb-3">Sarah & John Wedding</h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-white/40"/> Oct 18, 14:00 - 22:00</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/40"/> Beachfront Resort</div>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-white/40"/> Contact: Sarah Jenkins</div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
