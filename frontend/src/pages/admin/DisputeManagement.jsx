import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Search, Filter, AlertTriangle, MessageSquare, Clock, ArrowRight, Gavel } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const DISPUTES = [
  { id: 'DSP-8812', bookingId: 'BKG-9922', customer: 'Emma Watson', vendor: 'Elite Catering Co.', amount: '$4,100', reason: 'Service not rendered as described', status: 'Open', created: '2 days ago', urgency: 'High' },
  { id: 'DSP-8811', bookingId: 'BKG-8910', customer: 'Michael Chen', vendor: 'Lumiere Photography', amount: '$500', reason: 'Late delivery of gallery', status: 'In Review', created: '5 days ago', urgency: 'Medium' },
  { id: 'DSP-8810', bookingId: 'BKG-8802', customer: 'Sarah Jenkins', vendor: 'DJ Velocity', amount: '$150', reason: 'Requested refund for unused overtime', status: 'Resolved', created: '2 weeks ago', urgency: 'Low' },
];

export const DisputeManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gavel className="w-7 h-7 text-red-400" />
            Dispute Resolution Center
          </h1>
          <p className="text-white/60">Mediate conflicts, review evidence, and issue refunds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Active Disputes</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-red-400">12</span>
            </div>
            <p className="text-xs text-red-400/60 mt-2">Requires mediation</p>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Value at Risk</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">$14,250</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Avg. Resolution Time</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">4.2 days</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-2">Resolved (YTD)</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-white">184</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by Dispute ID, Booking ID, or parties..." 
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Status: All Active</option>
              <option>Status: Open</option>
              <option>Status: In Review</option>
              <option>Status: Resolved</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
                <th className="p-4 pl-6">Dispute Info</th>
                <th className="p-4">Customer vs Vendor</th>
                <th className="p-4">Disputed Amount</th>
                <th className="p-4">Status & Urgency</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {DISPUTES.map((dispute, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{dispute.id}</span>
                      <span className="text-xs text-white/50 mt-0.5">Booking: {dispute.bookingId}</span>
                      <p className="text-xs text-white/80 mt-1 truncate max-w-[200px]" title={dispute.reason}>"{dispute.reason}"</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{dispute.customer}</span>
                      <ArrowRight className="w-3 h-3 text-white/40" />
                      <span className="text-white/80">{dispute.vendor}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white">{dispute.amount}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold w-fit",
                        dispute.status === 'Open' ? "bg-red-500/10 text-red-400 border border-red-500/20" : 
                        dispute.status === 'Resolved' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                      )}>
                        {dispute.status}
                      </span>
                      {dispute.status !== 'Resolved' && (
                        <span className="text-[10px] text-white/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Opened {dispute.created}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Button variant={dispute.status === 'Open' ? 'default' : 'outline'} size="sm" leftIcon={<MessageSquare className="w-4 h-4"/>}>
                      Mediate
                    </Button>
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
