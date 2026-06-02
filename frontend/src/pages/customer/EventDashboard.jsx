import React from 'react';
import { motion } from 'framer-motion';
import { Plus, CalendarDays, MapPin, Users, Activity, Clock, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';

const EVENTS = [
  {
    id: 'EVT-01',
    name: "Sarah & John's Wedding",
    type: 'Wedding',
    date: 'Oct 24, 2026',
    location: 'Galle Face Hotel, Colombo',
    guests: 150,
    status: 'Planning',
    progress: 75,
    vendors: 4,
    budgetSpent: 12500,
    budgetTotal: 15000,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80'
  },
  {
    id: 'EVT-02',
    name: "TechNova Annual Gala",
    type: 'Corporate',
    date: 'Dec 15, 2026',
    location: 'BMICH, Colombo',
    guests: 500,
    status: 'Draft',
    progress: 10,
    vendors: 0,
    budgetSpent: 0,
    budgetTotal: 25000,
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&q=80'
  }
];

export const EventDashboard = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Events</h1>
          <p className="text-white/60">Manage all your upcoming and past events.</p>
        </div>
        <Link to="/customer/create-event">
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Create New Event</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {EVENTS.map((evt, i) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden hover:border-primary/30 transition-colors group">
              <div className="h-40 w-full relative overflow-hidden">
                <img src={evt.image} alt={evt.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                    {evt.type}
                  </span>
                  <span className="px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                    {evt.status}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{evt.name}</h2>
                    <div className="space-y-1.5 text-sm text-white/60">
                      <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/> {evt.date}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {evt.location}</p>
                      <p className="flex items-center gap-2"><Users className="w-4 h-4"/> {evt.guests} Guests Expected</p>
                    </div>
                  </div>
                  <Link to="/customer/manage-event">
                    <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 hover:bg-primary/20 hover:text-primary">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/80 font-medium">Planning Progress</span>
                    <span className="text-primary font-bold">{evt.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface border border-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${evt.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-premium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-surface/30 border border-white/5">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Vendors Booked</p>
                    <p className="text-lg font-bold text-white">{evt.vendors}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Budget Spent</p>
                    <p className="text-lg font-bold text-white">${evt.budgetSpent.toLocaleString()} / <span className="text-sm font-normal text-white/50">${evt.budgetTotal.toLocaleString()}</span></p>
                  </div>
                </div>

                <Link to="/customer/manage-event">
                  <Button className="w-full" variant="outline" rightIcon={<ArrowRight className="w-4 h-4"/>}>
                    Open Event Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
