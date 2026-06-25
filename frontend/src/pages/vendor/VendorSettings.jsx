import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, CreditCard, Users, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';

export const VendorSettings = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary" />
            Vendor Settings
          </h1>
          <p className="text-slate-600">Configure your operational preferences and account security.</p>
        </div>
        <Button leftIcon={<Save className="w-4 h-4"/>}>Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6">
        
        {/* Settings Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { id: 'general', label: 'General', icon: Settings, active: true },
            { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
            { id: 'security', label: 'Security & Login', icon: Shield, active: false },
            { id: 'billing', label: 'Billing & Taxes', icon: CreditCard, active: false },
            { id: 'team', label: 'Team Access', icon: Users, active: false },
          ].map((tab) => (
            <button 
              key={tab.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                tab.active 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Settings Content */}
        <div className="md:col-span-3 space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Business Preferences</CardTitle>
              <CardDescription>Global rules for how you operate on Nexora.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Default Currency</label>
                  <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                    <option value="USD">LKR (Rs)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Timezone</label>
                  <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                    <option value="PST">Pacific Time (PT)</option>
                    <option value="EST">Eastern Time (ET)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Booking Lead Time</label>
                <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                  <option value="48h">Minimum 48 hours notice</option>
                  <option value="1w">Minimum 1 week notice</option>
                  <option value="1m">Minimum 1 month notice</option>
                </select>
                <p className="text-xs text-slate-500">Prevents last-minute bookings from customers.</p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-surface/30 cursor-pointer">
                  <div>
                    <h4 className="text-slate-900 font-medium text-sm">Instant Book</h4>
                    <p className="text-xs text-slate-500">Automatically approve bookings if your calendar is free.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white/40 rounded-full absolute left-0.5 top-0.5" />
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-surface/30 cursor-pointer">
                  <div>
                    <h4 className="text-slate-900 font-medium text-sm">Require Deposits</h4>
                    <p className="text-xs text-slate-500">Force customers to pay 20% upfront to confirm a date.</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                  </div>
                </label>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cancellation Policy</CardTitle>
              <CardDescription>Set the terms for when a customer cancels an event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Flexible', desc: 'Full refund up to 7 days before.', selected: false },
                  { title: 'Moderate', desc: 'Full refund up to 30 days before.', selected: true },
                  { title: 'Strict', desc: 'Non-refundable deposit.', selected: false },
                ].map((policy, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all",
                      policy.selected 
                        ? "border-primary bg-primary/10" 
                        : "border-slate-300 bg-surface/30 hover:border-slate-400"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={cn("font-bold text-sm", policy.selected ? "text-primary" : "text-slate-900")}>{policy.title}</h4>
                      {policy.selected && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{policy.desc}</p>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-slate-600">If you want to temporarily hide your business or permanently delete your account, you can do so here.</p>
              <div className="flex gap-4">
                <Button variant="outline">Pause Account</Button>
                <Button variant="outline" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20">Deactivate Business</Button>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};
