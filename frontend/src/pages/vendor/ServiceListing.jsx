import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Search, Filter, Plus, Edit2, Trash2, Tag, CheckCircle2, MoreVertical, EyeOff } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const SERVICES = [
  { id: 'SVC-001', name: 'Premium Wedding Photography', category: 'Photography', price: 'from LKR 1,500', bookings: 24, status: 'Active' },
  { id: 'SVC-002', name: 'Pre-Shoot Engagement Session', category: 'Photography', price: 'from LKR 450', bookings: 12, status: 'Active' },
  { id: 'SVC-003', name: 'Drone Videography Add-on', category: 'Videography', price: 'from LKR 300', bookings: 8, status: 'Active' },
  { id: 'SVC-004', name: 'Destination Wedding Package', category: 'Photography', price: 'from LKR 3,500', bookings: 2, status: 'Hidden' },
];

export const ServiceListing = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary" />
            My Services
          </h1>
          <p className="text-white/60">Manage the services and packages you offer to clients.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4"/>}>Create New Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Active Services</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">3</span>
              <span className="text-sm text-green-400 mb-1">Visible to clients</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Total Bookings (All Time)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">46</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Drafts / Hidden</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">1</span>
              <span className="text-sm text-white/40 mb-1">Not visible</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Category</Button>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
                <th className="p-4 pl-6">Service Name</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Bookings</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {SERVICES.map((service, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center shrink-0">
                        <Tag className="w-5 h-5 text-white/40" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{service.name}</span>
                        <span className="text-xs text-white/50">{service.category} • {service.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-white/80">{service.price}</td>
                  <td className="p-4 text-white/60">{service.bookings} completed</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {service.status === 'Active' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-white/40" />
                          <span className="text-white/40">Hidden</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-white/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit Service">
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      <button className="p-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
