import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const SellerDirectory = () => {
  return (
    <div className="pt-40 pb-20 min-h-screen bg-background space-y-6 container mx-auto px-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary">Seller Directory</h1>
          <p className="text-textPrimary/60">Manage and view all records.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900">Seller Directory</h1>
          <p className="text-slate-600">Manage and view all records.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <Button>Add New</Button>
      </div>
      <Card>
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1">
<<<<<<< HEAD
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input type="text" placeholder="Search records..." className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary" />
=======
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search records..." className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary" />
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
<<<<<<< HEAD
              <tr className="border-b border-white/5 text-sm text-textPrimary/50">
=======
              <tr className="border-b border-slate-200 text-sm text-slate-500">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
<<<<<<< HEAD
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-textPrimary">#00${i}</td>
                  <td className="p-4 text-textPrimary">Sample Record ${i}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">Active</span></td>
                  <td className="p-4 text-textPrimary/60">Oct 24, 2026</td>
                  <td className="p-4 text-right"><button className="text-textPrimary/40 hover:text-textPrimary"><MoreVertical className="w-5 h-5"/></button></td>
=======
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-100 transition-colors">
                  <td className="p-4 text-slate-900">#00${i}</td>
                  <td className="p-4 text-slate-900">Sample Record ${i}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">Active</span></td>
                  <td className="p-4 text-slate-600">Oct 24, 2026</td>
                  <td className="p-4 text-right"><button className="text-slate-500 hover:text-slate-900"><MoreVertical className="w-5 h-5"/></button></td>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
