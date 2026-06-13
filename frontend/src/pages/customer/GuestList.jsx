import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Mail, Upload, Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const GUESTS = [
  { id: 1, name: 'Michael Jenkins', group: 'Family', status: 'Attending', diet: 'None', email: 'mike@example.com' },
  { id: 2, name: 'Sarah Connor', group: 'Friends', status: 'Pending', diet: 'Vegetarian', email: 'sarah@example.com' },
  { id: 3, name: 'David Wright', group: 'Colleagues', status: 'Declined', diet: 'None', email: 'david@example.com' },
  { id: 4, name: 'Emily Chen', group: 'Family', status: 'Attending', diet: 'Vegan', email: 'emily@example.com' },
  { id: 5, name: 'Robert Fox', group: 'Friends', status: 'Attending', diet: 'Gluten-Free', email: 'robert@example.com' },
];

export const GuestList = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Guest List Manager
          </h1>
          <p className="text-white/60">Manage invitations, track RSVPs, and organize dietary requirements.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Upload className="w-4 h-4"/>}>Import CSV</Button>
          <Button leftIcon={<UserPlus className="w-4 h-4"/>}>Add Guest</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Total Invited</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">145</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Attending</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">82</span>
              <span className="text-sm text-green-400/60 mb-1">56%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Awaiting RSVP</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-400">51</span>
              <span className="text-sm text-yellow-400/60 mb-1">35%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Declined</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-red-400">12</span>
              <span className="text-sm text-red-400/60 mb-1">8%</span>
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
              placeholder="Search guests by name or email..." 
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Mail className="w-4 h-4"/>}>Send Reminders</Button>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
                <th className="p-4 pl-6">Guest Details</th>
                <th className="p-4">Group</th>
                <th className="p-4">RSVP Status</th>
                <th className="p-4">Dietary Req.</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {GUESTS.map((guest, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {guest.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{guest.name}</span>
                        <span className="text-xs text-white/50">{guest.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white/80">{guest.group}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {guest.status === 'Attending' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      {guest.status === 'Pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                      {guest.status === 'Declined' && <XCircle className="w-4 h-4 text-red-400" />}
                      <span className={cn(
                        guest.status === 'Attending' ? "text-green-400" : 
                        guest.status === 'Pending' ? "text-yellow-400" : 
                        "text-red-400"
                      )}>
                        {guest.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      guest.diet === 'None' ? "text-white/40 bg-white/5" : "text-accent bg-accent/10 border border-accent/20"
                    )}>
                      {guest.diet}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
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
