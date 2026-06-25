import React from 'react';
import { motion } from 'framer-motion';
import { Store, Search, Filter, MoreVertical, Star, ShieldCheck, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const VENDORS = [
  { id: 'VND-201', name: 'Lumiere Photography', category: 'Photography', rating: 4.9, location: 'Colombo, Sri Lanka', gmv: 'LKR 142,500', status: 'Verified' },
  { id: 'VND-202', name: 'Grand Azure Resort', category: 'Venues', rating: 4.5, location: 'Kandy, Sri Lanka', gmv: 'LKR 450,000', status: 'Verified' },
  { id: 'VND-203', name: 'DJ Velocity', category: 'Entertainment', rating: 4.2, location: 'Galle, Sri Lanka', gmv: 'LKR 24,000', status: 'Pending Review' },
  { id: 'VND-204', name: 'Elite Catering Co.', category: 'Catering', rating: 2.8, location: 'Negombo, Sri Lanka', gmv: 'LKR 5,200', status: 'Warning' },
];

export const AdminVendorManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            Vendor Ecosystem
          </h1>
          <p className="text-slate-600">Monitor vendor performance, verification status, and quality control.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Total Vendors</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">1,842</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Top Performers (4.8+ <Star className="w-3 h-3 inline"/>)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-accent">425</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Verification Queue</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900">42</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/10">
              Review
            </Button>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">At Risk (Quality)</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-yellow-500">18</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search vendors by name or ID..." 
              className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>All Categories</option>
              <option>Photography</option>
              <option>Venues</option>
              <option>Catering</option>
            </select>
            <select className="bg-surface border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Sort: Highest GMV</option>
              <option>Sort: Lowest Rating</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
                <th className="p-4 pl-6">Business</th>
                <th className="p-4">Location</th>
                <th className="p-4">Performance</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {VENDORS.map((vendor, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{vendor.name}</span>
                      <span className="text-xs text-slate-500">{vendor.category} • {vendor.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-xs">{vendor.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-900 flex items-center gap-1">
                        <Star className={cn("w-3.5 h-3.5", vendor.rating >= 4.5 ? "text-yellow-400 fill-yellow-400" : vendor.rating < 3 ? "text-red-400" : "text-yellow-400")} /> 
                        {vendor.rating}
                      </span>
                      <span className="text-xs text-green-400 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {vendor.gmV} YTD</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full",
                      vendor.status === 'Verified' ? "bg-green-500/10 text-green-400" :
                      vendor.status === 'Warning' ? "bg-red-500/20 text-red-400 border border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {vendor.status === 'Verified' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {vendor.status === 'Warning' && <AlertCircle className="w-3.5 h-3.5" />}
                      {vendor.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Manage
                    </Button>
                    <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors" title="Actions">
                      <MoreVertical className="w-5 h-5"/>
                    </button>
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
