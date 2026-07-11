import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Filter, Check, X, FileText, Building, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const APPROVALS = [
  { id: 'APP-1042', business: 'Apex Catering LLC', owner: 'James Wilson', type: 'Catering', date: 'Oct 24, 2026', risk: 'Low', documents: 3 },
  { id: 'APP-1043', business: 'Skyline Drone Photography', owner: 'Amanda Chen', type: 'Photography', date: 'Oct 23, 2026', risk: 'Medium', documents: 2 },
  { id: 'APP-1044', business: 'Party Bus Rentals VIP', owner: 'Unknown', type: 'Transportation', date: 'Oct 23, 2026', risk: 'High', documents: 1 },
];

export const BusinessApprovals = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-primary" />
            Identity & Business Verification
          </h1>
          <p className="text-gray-600 dark:text-white/60">Review KYC/KYB documents to approve new vendors on the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Pending Review</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">42</span>
            </div>
            <p className="text-xs text-yellow-600/60 dark:text-yellow-500/60 mt-2">Requires manual approval</p>
          </CardContent>
        </Card>
        <Card className="border-gray-300 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-white/60 mb-2">Auto-Approved Today</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">128</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-white/40 mt-2">Passed algorithmic checks</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-white/60 mb-2">Rejected Today</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">7</span>
            </div>
            <p className="text-xs text-red-600/60 dark:text-red-400/60 mt-2">Failed identity verification</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/40" />
            <input 
              type="text" 
              placeholder="Search by business name or ID..." 
              className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/40 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Sort: Highest Risk First</option>
              <option>Sort: Oldest First</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/5 text-sm font-medium text-gray-600 dark:text-white/50 bg-gray-50 dark:bg-white/[0.02]">
                <th className="p-4 pl-6">Business Details</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Submitted</th>
                <th className="p-4">System Risk</th>
                <th className="p-4 pr-6 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {APPROVALS.map((approval, i) => (
                <tr key={i} className={cn(
                  "border-b border-gray-200 dark:border-white/5 transition-colors group",
                  approval.risk === 'High' ? "bg-red-50 dark:bg-red-500/5" : "hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                )}>
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-gray-400 dark:text-white/40"/> {approval.business}</span>
                      <span className="text-xs text-gray-600 dark:text-white/50">{approval.type} • {approval.id}</span>
                      <span className="text-[10px] text-primary mt-1 font-bold tracking-wider uppercase flex items-center gap-1">
                        <FileText className="w-3 h-3"/> {approval.documents} Docs attached
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 dark:text-white/80">{approval.owner}</td>
                  <td className="p-4 text-gray-700 dark:text-white/80">{approval.date}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit",
                      approval.risk === 'Low' ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-400/10 border-green-300 dark:border-green-400/20" : 
                      approval.risk === 'High' ? "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-400/10 border-red-300 dark:border-red-400/20" :
                      "text-yellow-700 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-500/20"
                    )}>
                      {approval.risk === 'High' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {approval.risk} Risk
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="text-green-700 dark:text-green-400 border-green-300 dark:border-green-400/20 hover:bg-green-100 dark:hover:bg-green-400/10" leftIcon={<Check className="w-4 h-4"/>}>
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-700 dark:text-red-400 border-red-300 dark:border-red-400/20 hover:bg-red-100 dark:hover:bg-red-400/10" leftIcon={<X className="w-4 h-4"/>}>
                        Reject
                      </Button>
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

