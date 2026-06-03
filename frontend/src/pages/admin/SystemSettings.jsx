import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Server, Globe, Lock, Bell, CreditCard, Mail, Database, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const SystemSettings = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
        
        <nav className="space-y-1">
          {[
            { icon: Globe, label: 'General', active: true },
            { icon: Server, label: 'Platform Settings' },
            { icon: CreditCard, label: 'Payments & Fees' },
            { icon: Mail, label: 'SMTP & Email' },
            { icon: Lock, label: 'Security & Auth' },
            { icon: Smartphone, label: 'Mobile App Config' },
            { icon: Database, label: 'Backups' },
          ].map((item, i) => (
            <button 
              key={i}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                item.active 
                  ? "bg-primary/20 text-primary border border-primary/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        <div>
          <h2 className="text-xl font-bold text-white">General Settings</h2>
          <p className="text-sm text-white/60 mt-1">Manage global platform configurations and branding.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Identity</CardTitle>
            <CardDescription>Public-facing details for the marketplace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 block">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue="Nexora Marketplace" 
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 block">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@nexora.com" 
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-medium text-white/80 block">Platform Logo (Dark Mode)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded bg-surface border border-white/10 flex items-center justify-center">
                  <span className="font-bold text-white tracking-widest text-xs">NEXORA</span>
                </div>
                <Button variant="outline" size="sm">Upload New</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 block">Default Timezone</label>
                <select className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 block">Default Currency</label>
                <select className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                  <option>LKR (Rs)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>Toggle platform availability.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-surface/50">
              <div>
                <h4 className="font-bold text-white text-sm">Maintenance Mode</h4>
                <p className="text-xs text-white/50 mt-1 max-w-md">When enabled, the public marketplace is disabled and shows a "Down for Maintenance" page. Admins can still log in.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancel Changes</Button>
          <Button>Save Configuration</Button>
        </div>

      </div>

    </div>
  );
};
