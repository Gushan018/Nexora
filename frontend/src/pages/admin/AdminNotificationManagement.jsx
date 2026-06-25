import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Search, Users, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const AdminNotificationManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-7 h-7 text-primary" />
            Global Push Notifications
          </h1>
          <p className="text-slate-600">Broadcast system alerts, promotions, and updates to user cohorts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Col: Composer */}
        <Card className="border-slate-200 bg-gradient-to-br from-surface to-surface/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Send className="w-5 h-5"/> Compose Broadcast</CardTitle>
            <CardDescription>Send an in-app notification to a specific group.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-800 block">Target Audience</label>
              <select className="w-full bg-surface/50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                <option>All Users (47k+)</option>
                <option>All Vendors (1.8k)</option>
                <option>All Customers (45k)</option>
                <option>Specific Role: Pro Vendors</option>
                <option>Specific Region: California</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-800 block">Notification Type</label>
              <div className="grid grid-cols-3 gap-3">
                <label className="cursor-pointer border border-primary/40 bg-primary/10 rounded-lg p-3 text-center transition-colors">
                  <input type="radio" name="type" className="hidden" defaultChecked />
                  <MessageSquare className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <span className="text-xs font-bold text-primary">Info</span>
                </label>
                <label className="cursor-pointer border border-slate-300 hover:border-slate-400 bg-surface/50 rounded-lg p-3 text-center transition-colors">
                  <input type="radio" name="type" className="hidden" />
                  <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                  <span className="text-xs font-medium text-slate-600">Warning</span>
                </label>
                <label className="cursor-pointer border border-slate-300 hover:border-slate-400 bg-surface/50 rounded-lg p-3 text-center transition-colors">
                  <input type="radio" name="type" className="hidden" />
                  <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-green-400" />
                  <span className="text-xs font-medium text-slate-600">Success</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-medium text-slate-800 block">Message Title</label>
              <input 
                type="text" 
                placeholder="e.g. Holiday Sale is now live!" 
                className="w-full bg-surface border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-800 block">Message Body</label>
              <textarea 
                rows="4" 
                placeholder="Write your message here..."
                className="w-full bg-surface border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button leftIcon={<Send className="w-4 h-4"/>}>Send Broadcast Now</Button>
            </div>

          </CardContent>
        </Card>

        {/* Right Col: History */}
        <Card>
          <CardHeader>
            <CardTitle>Broadcast History</CardTitle>
            <CardDescription>Recently sent global notifications.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {[
                { title: 'Scheduled Maintenance', target: 'All Users', type: 'Warning', date: '2 hours ago', reach: '45,210' },
                { title: 'New Feature: Instant Payouts', target: 'All Vendors', type: 'Success', date: 'Oct 24, 2026', reach: '1,842' },
                { title: 'Update your KYC Documents', target: 'Pro Vendors', type: 'Info', date: 'Oct 15, 2026', reach: '680' },
                { title: 'Welcome to Nexora V2!', target: 'All Users', type: 'Info', date: 'Sep 01, 2026', reach: '42,100' },
              ].map((log, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {log.type === 'Warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      {log.type === 'Success' && <ShieldCheck className="w-4 h-4 text-green-400" />}
                      {log.type === 'Info' && <MessageSquare className="w-4 h-4 text-primary" />}
                      {log.title}
                    </h4>
                    <span className="text-[10px] text-slate-500">{log.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> Target: {log.target}</span>
                    <span>Delivered to {log.reach}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
