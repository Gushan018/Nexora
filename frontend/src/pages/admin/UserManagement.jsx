import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, MoreVertical, UserCheck, UserX, Shield, Mail } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const USERS = [
  { id: 'USR-001', name: 'Alice Freeman', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: 'Jan 10, 2024' },
  { id: 'USR-002', name: 'Lumiere Photo', email: 'hello@lumiere.com', role: 'Vendor', status: 'Active', joined: 'Feb 15, 2025' },
  { id: 'USR-003', name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Suspended', joined: 'Mar 20, 2026' },
  { id: 'USR-004', name: 'Grand Azure Resort', email: 'events@grandazure.com', role: 'Vendor', status: 'Pending', joined: 'Oct 12, 2026' },
  { id: 'USR-005', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Customer', status: 'Active', joined: 'Oct 14, 2026' },
];

export const UserManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Global User Management
          </h1>
          <p className="text-white/60">View, modify, and enforce policies across all platform accounts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Mail className="w-4 h-4"/>}>Broadcast Email</Button>
          <Button leftIcon={<Shield className="w-4 h-4"/>}>Add Admin</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Total Users</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">47,152</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Customers</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">45,300</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Vendors</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">1,842</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Suspended</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-red-400">104</span>
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
              placeholder="Search by name, email, or ID..." 
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Vendor</option>
              <option>Customer</option>
            </select>
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filters</Button>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
                <th className="p-4 pl-6">User / Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {USERS.map((user, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{user.name}</span>
                        <span className="text-xs text-white/50">{user.email} • {user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      user.role === 'Admin' ? "bg-accent/20 text-accent border border-accent/20" :
                      user.role === 'Vendor' ? "bg-primary/20 text-primary border border-primary/20" :
                      "bg-white/10 text-white/70 border border-white/10"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-medium w-fit",
                      user.status === 'Active' ? "text-green-400" :
                      user.status === 'Pending' ? "text-yellow-500" :
                      "text-red-400"
                    )}>
                      {user.status === 'Active' && <UserCheck className="w-3.5 h-3.5" />}
                      {user.status === 'Pending' && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />}
                      {user.status === 'Suspended' && <UserX className="w-3.5 h-3.5" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/80">{user.joined}</td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Manage
                    </Button>
                    <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Actions">
                      <MoreVertical className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex justify-center">
          <Button variant="ghost" className="text-white/60 hover:text-white">Load More Users</Button>
        </div>
      </Card>
    </div>
  );
};
