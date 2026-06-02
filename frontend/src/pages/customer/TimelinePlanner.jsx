import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Share2, Printer, MapPin, AlignLeft, Users, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const TIMELINE_EVENTS = [
  { id: 1, time: '08:00 AM', title: 'Hair & Makeup Begins', location: 'Bridal Suite', owner: 'Bridal Party', notes: 'Photographer arrives at 9:00 AM' },
  { id: 2, time: '11:00 AM', title: 'Vendor Setup', location: 'Grand Ballroom', owner: 'Luxe Dining, Bloom Floral', notes: 'Must be completed by 1:00 PM' },
  { id: 3, time: '01:30 PM', title: 'First Look Photos', location: 'Botanical Gardens', owner: 'Couple & Photographer', notes: 'Transport leaves hotel at 1:15 PM' },
  { id: 4, time: '03:30 PM', title: 'Guest Arrival', location: 'Ceremony Hall', owner: 'Ushers', notes: 'String quartet begins playing' },
  { id: 5, time: '04:00 PM', title: 'Ceremony Commences', location: 'Ceremony Hall', owner: 'All Guests', notes: '' },
  { id: 6, time: '05:00 PM', title: 'Cocktail Hour', location: 'Terrace', owner: 'Guests', notes: 'Couple takes family portraits' },
];

export const TimelinePlanner = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-7 h-7 text-primary" />
            Day-Of Timeline
          </h1>
          <p className="text-white/60">The minute-by-minute itinerary for the big day.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Printer className="w-4 h-4"/>}>Export PDF</Button>
          <Button variant="outline" leftIcon={<Share2 className="w-4 h-4"/>}>Share</Button>
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Add Event</Button>
        </div>
      </div>

      <Card className="relative overflow-hidden">
        {/* Background Decorative Line */}
        <div className="absolute left-10 md:left-24 top-0 bottom-0 w-px bg-white/10" />
        
        <CardContent className="p-6 md:p-10 space-y-8 relative">
          
          {TIMELINE_EVENTS.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col md:flex-row gap-6 relative group"
            >
              {/* Time Column (Left Side on Desktop) */}
              <div className="md:w-32 shrink-0 flex items-center md:items-start md:justify-end md:pr-8 relative">
                
                {/* Timeline Dot */}
                <div className="hidden md:flex absolute right-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background z-10 transition-transform group-hover:scale-150" />
                
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20 md:bg-transparent md:border-none md:p-0">
                  <Clock className="w-4 h-4 md:hidden" />
                  <span className="font-bold text-sm">{event.time}</span>
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1">
                <Card className="border-white/5 bg-surface/30 hover:border-primary/30 hover:bg-surface/50 transition-all cursor-pointer">
                  <CardContent className="p-5 flex justify-between items-start">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{event.title}</h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-white/40" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-white/40" />
                          {event.owner}
                        </div>
                      </div>

                      {event.notes && (
                        <div className="flex items-start gap-2 text-sm text-white/50 bg-white/5 p-3 rounded-lg border border-white/5">
                          <AlignLeft className="w-4 h-4 mt-0.5 shrink-0" />
                          <p>{event.notes}</p>
                        </div>
                      )}
                    </div>

                    <button className="text-white/20 hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-2">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
          
          <div className="flex justify-center pt-8 border-t border-white/5">
            <Button variant="outline" className="border-dashed" leftIcon={<Plus className="w-4 h-4"/>}>Add to Timeline</Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};
