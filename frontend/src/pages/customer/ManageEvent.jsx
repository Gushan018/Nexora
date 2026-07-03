import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Users, DollarSign, ListTodo, MessageSquare, ChevronRight, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const ManageEvent = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Event Header */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-primary/20 p-8 sm:p-12 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80')] opacity-20 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Wedding</span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Sarah & John's Wedding</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
              <span className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-white/40"/> Oct 24, 2026</span>
              <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-white/40"/> Galle Face Hotel</span>
              <span className="flex items-center gap-2"><Users className="w-5 h-5 text-white/40"/> 150 Guests</span>
            </div>
          </div>
          <Button variant="outline" className="bg-background/50 backdrop-blur-md">Edit Details</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Vendor Roster */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Booked Vendors</CardTitle>
                <CardDescription>Professionals hired for this event.</CardDescription>
              </div>
              <Button size="sm" variant="outline" leftIcon={<Briefcase className="w-4 h-4"/>}>Hire Vendor</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Luxe Dining Catering', category: 'Catering', status: 'Confirmed', fee: 'LKR 5,500' },
                { name: 'Elite Photography Studio', category: 'Photography', status: 'Confirmed', fee: 'LKR 2,500' },
                { name: 'Bloom Floral Designs', category: 'Decor', status: 'Pending Approval', fee: 'LKR 1,200' },
              ].map((vendor, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white group-hover:text-primary transition-colors">{vendor.name}</h4>
                      <p className="text-sm text-white/50">{vendor.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-white">{vendor.fee}</span>
                    <span className={cn("text-xs font-medium", vendor.status === 'Confirmed' ? "text-green-400" : "text-yellow-400")}>{vendor.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Task Checklist */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>To-Do List</CardTitle>
                <CardDescription>Your planning checklist.</CardDescription>
              </div>
              <Button size="sm" variant="ghost" leftIcon={<ListTodo className="w-4 h-4"/>}>Add Task</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { task: 'Send out digital invitations', done: true },
                { task: 'Finalize catering menu tasting', done: true },
                { task: 'Approve floral arrangements quote', done: false, urgent: true },
                { task: 'Book transportation for guests', done: false },
              ].map((task, i) => (
                <label key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface/30 border border-white/5 hover:bg-surface/50 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-5 h-5 mt-0.5 rounded bg-surface border-white/20 text-primary focus:ring-primary/50" defaultChecked={task.done} />
                  <div className={cn("flex-1", task.done && "opacity-50 line-through")}>
                    <p className="text-white font-medium text-sm">{task.task}</p>
                  </div>
                  {task.urgent && !task.done && <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">Urgent</span>}
                </label>
              ))}
            </CardContent>
          </Card>

        </div>

        <div className="space-y-8">
          
          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary"/> Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 text-center">
                <p className="text-sm text-white/60 mb-1">Total Spent</p>
                <h3 className="text-4xl font-extrabold text-white mb-2">LKR 9,200</h3>
                <p className="text-xs text-white/40">out of LKR 15,000 budget</p>
              </div>
              
              <div className="w-full h-3 rounded-full bg-surface border border-white/5 overflow-hidden mb-6">
                <div className="h-full bg-primary" style={{ width: '61%' }} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Vendors</span>
                  <span className="text-white font-medium">LKR 8,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Marketplace</span>
                  <span className="text-white font-medium">LKR 1,200</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                  <span className="text-white/90 font-medium">Remaining</span>
                  <span className="text-green-400 font-bold">LKR 5,800</span>
                </div>
              </div>
              <Button className="w-full mt-6" variant="outline">Manage Budget</Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full flex justify-between items-center p-4 rounded-xl bg-surface/50 border border-white/5 hover:bg-white/5 transition-colors group">
                <span className="font-medium text-white flex items-center gap-3"><Users className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors"/> Guest List</span>
                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white" />
              </button>
              <button className="w-full flex justify-between items-center p-4 rounded-xl bg-surface/50 border border-white/5 hover:bg-white/5 transition-colors group">
                <span className="font-medium text-white flex items-center gap-3"><MessageSquare className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors"/> Vendor Chat</span>
                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white" />
              </button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};
