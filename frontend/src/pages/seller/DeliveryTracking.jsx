import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const DeliveryTracking = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Delivery Tracking</h1>
          <p className="text-white/60">Manage and view all records.</p>
        </div>
        <Button>Add New</Button>
      </div>
      <Card>
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input type="text" placeholder="Search records..." className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary" />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-sm text-white/50">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white">#00${i}</td>
                  <td className="p-4 text-white">Sample Record ${i}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">Active</span></td>
                  <td className="p-4 text-white/60">Oct 24, 2026</td>
                  <td className="p-4 text-right"><button className="text-white/40 hover:text-white"><MoreVertical className="w-5 h-5"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
