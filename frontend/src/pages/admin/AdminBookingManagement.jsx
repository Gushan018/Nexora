import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, CheckCircle2, Clock, MapPin, MoreVertical, ShieldAlert, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const BOOKINGS = [
  { id: 'BKG-9920', customer: 'Sarah Jenkins', vendor: 'Lumiere Photography', date: 'Oct 14, 2026', value: 'LKR 3,200', status: 'Confirmed', issue: false },
  { id: 'BKG-9921', customer: 'David Osei', vendor: 'Grand Azure Resort', date: 'Oct 22, 2026', value: 'LKR 12,500', status: 'Pending Deposit', issue: false },
  { id: 'BKG-9922', customer: 'Emma Watson', vendor: 'Elite Catering Co.', date: 'Sep 20, 2026', value: 'LKR 4,100', status: 'Disputed', issue: true },
  { id: 'BKG-9923', customer: 'Liam Hemsworth', vendor: 'DJ Velocity', date: 'Aug 15, 2026', value: 'LKR 800', status: 'Cancelled', issue: false },
];

export const AdminBookingManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            Global Booking Registry
          </h1>
          <p className="text-textPrimary/60">Monitor all cross-platform bookings, mediate issues, and track deposits.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            Global Booking Registry
          </h1>
          <p className="text-slate-600">Monitor all cross-platform bookings, mediate issues, and track deposits.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-300">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Active Bookings</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">4,250</span>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">Total Active Bookings</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">4,250</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Value in Escrow</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">LKR 1.2M</span>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">Value in Escrow</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">LKR 1.2M</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
<<<<<<< HEAD
              <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Flagged / Disputed</h3>
=======
              <h3 className="text-sm font-medium text-slate-800 mb-2">Flagged / Disputed</h3>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-red-400">12</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-red-400 border-red-400/20 hover:bg-red-400/10 hover:text-red-300">
              Resolve
            </Button>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
<<<<<<< HEAD
              <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Cancellation Rate</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-textPrimary">4.2%</span>
=======
              <h3 className="text-sm font-medium text-slate-600 mb-2">Cancellation Rate</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900">4.2%</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
<<<<<<< HEAD
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input 
              type="text" 
              placeholder="Search by Booking ID, Customer, or Vendor..." 
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary/50 cursor-pointer">
=======
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by Booking ID, Customer, or Vendor..." 
              className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              <option>All Statuses</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Disputed</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
<<<<<<< HEAD
              <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
=======
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                <th className="p-4 pl-6">Booking Info</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Value</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {BOOKINGS.map((booking, i) => (
                <tr key={i} className={cn(
                  "border-b border-slate-200 transition-colors group",
                  booking.issue ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-slate-50"
                )}>
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
<<<<<<< HEAD
                      <span className="font-bold text-textPrimary">{booking.id}</span>
                      <span className="text-xs text-textPrimary/50 flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3"/> {booking.date}</span>
                    </div>
                  </td>
                  <td className="p-4 text-textPrimary/80">{booking.customer}</td>
                  <td className="p-4 text-textPrimary/80 flex items-center gap-2">
                    {booking.vendor}
                    {booking.issue && <AlertTriangle className="w-4 h-4 text-red-400" title="Flagged by Vendor" />}
                  </td>
                  <td className="p-4 font-bold text-textPrimary">{booking.value}</td>
=======
                      <span className="font-bold text-slate-900">{booking.id}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3"/> {booking.date}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-800">{booking.customer}</td>
                  <td className="p-4 text-slate-800 flex items-center gap-2">
                    {booking.vendor}
                    {booking.issue && <AlertTriangle className="w-4 h-4 text-red-400" title="Flagged by Vendor" />}
                  </td>
                  <td className="p-4 font-bold text-slate-900">{booking.value}</td>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit",
                      booking.status === 'Confirmed' ? "text-green-400 bg-green-400/10 border-green-400/20" : 
                      booking.status === 'Disputed' ? "text-red-400 bg-red-400/10 border-red-400/20" :
                      "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
                    )}>
                      {booking.status === 'Confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {booking.status === 'Disputed' && <ShieldAlert className="w-3.5 h-3.5" />}
                      {booking.status === 'Pending Deposit' && <Clock className="w-3.5 h-3.5" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Inspect
                    </Button>
<<<<<<< HEAD
                    <button className="p-2 text-textPrimary/40 hover:text-textPrimary hover:bg-white/10 rounded-lg transition-colors" title="Actions">
=======
                    <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors" title="Actions">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
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
