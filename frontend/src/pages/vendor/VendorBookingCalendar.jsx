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
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-primary" />
            Booking Calendar
          </h1>
          <p className="text-slate-600">Manage your schedule and availability for upcoming events.</p>
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
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">October 2026</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-surface border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-surface border border-slate-300 rounded-lg text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors">
                  Today
                </button>
                <button className="p-2 bg-surface border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-slate-200">
              {DAYS.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-slate-500 border-r border-slate-200 last:border-0">
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
                    "min-h-[100px] p-2 border-r border-b border-slate-200 last:border-r-0 transition-colors hover:bg-slate-50",
                    !isCurrentMonth && "opacity-30 bg-black/20"
                  )}>
                    {isCurrentMonth && (
                      <>
                        <span className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1",
                          dayNumber === 24 ? "bg-primary text-white" : "text-slate-800"
                        )}>
                          {dayNumber}
                        </span>
                        
                        {hasEvent && hasEvent.map((evt, idx) => (
                          <div key={idx} className="bg-primary/20 border border-primary/30 rounded p-1 mb-1 truncate cursor-pointer hover:bg-primary/30 transition-colors">
                            <span className="text-[10px] text-primary font-bold block">{evt.time}</span>
                            <span className="text-[11px] text-slate-900 truncate">{evt.title}</span>
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
          <h3 className="font-bold text-slate-900 mb-2">Upcoming this week</h3>
          
          <Card className="border-primary/50 relative overflow-hidden group hover:border-primary transition-colors cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <CardContent className="p-4 pl-5">
              <h4 className="text-slate-900 font-bold mb-3 group-hover:text-primary transition-colors">TechNova Corporate Gala</h4>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500"/> Oct 14, 18:00 - 23:00</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500"/> Grand Hyatt Ballroom</div>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-500"/> Contact: Michael Chen</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-300 hover:border-slate-400 transition-colors cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300" />
            <CardContent className="p-4 pl-5">
              <h4 className="text-slate-900 font-bold mb-3">Sarah & John Wedding</h4>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500"/> Oct 18, 14:00 - 22:00</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500"/> Beachfront Resort</div>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-500"/> Contact: Sarah Jenkins</div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
