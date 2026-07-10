import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Search, Plus, MoreVertical, Edit2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const ROLES = [
  { id: 'ROL-1', name: 'Super Admin', description: 'Full access to all platform settings, financials, and system configurations.', users: 3, type: 'System', permissions: ['All Permissions'] },
  { id: 'ROL-2', name: 'Support Agent', description: 'Can view customer profiles, manage bookings, and mediate disputes.', users: 14, type: 'Custom', permissions: ['View Users', 'Manage Bookings', 'Dispute Resolution'] },
  { id: 'ROL-3', name: 'Moderator', description: 'Responsible for reviewing flagged products.', users: 8, type: 'Custom', permissions: ['View Users', 'Moderate Products'] },
  { id: 'ROL-4', name: 'Financial Analyst', description: 'Read-only access to revenue reports, sales data, and analytics.', users: 2, type: 'Custom', permissions: ['View Analytics', 'Export Data'] },
];

export const RolesPermissions = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            Roles & Permissions (RBAC)
          </h1>
          <p className="text-textPrimary/60">Configure access levels and permissions for internal team members.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            Roles & Permissions (RBAC)
          </h1>
          <p className="text-slate-600">Configure access levels and permissions for internal team members.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Create Custom Role</Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
<<<<<<< HEAD
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input 
              type="text" 
              placeholder="Search roles..." 
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors" 
=======
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search roles..." 
              className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            />
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
                <th className="p-4 pl-6">Role Name & Info</th>
                <th className="p-4">Assigned Users</th>
                <th className="p-4">Key Permissions</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ROLES.map((role, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
<<<<<<< HEAD
                        <span className="font-bold text-textPrimary text-base">{role.name}</span>
=======
                        <span className="font-bold text-slate-900 text-base">{role.name}</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                        {role.type === 'System' && (
                          <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] uppercase font-bold tracking-wider rounded border border-accent/20">
                            System
                          </span>
                        )}
                      </div>
<<<<<<< HEAD
                      <span className="text-xs text-textPrimary/50 mt-1 max-w-sm">{role.description}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-textPrimary/80">
                      <Users className="w-4 h-4 text-textPrimary/40" />
=======
                      <span className="text-xs text-slate-500 mt-1 max-w-sm">{role.description}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-800">
                      <Users className="w-4 h-4 text-slate-500" />
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                      <span className="font-medium">{role.users} Members</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                      {role.permissions.map((perm, idx) => (
<<<<<<< HEAD
                        <span key={idx} className="px-2 py-1 bg-surface border border-white/10 rounded-md text-[10px] font-medium text-textPrimary/70">
=======
                        <span key={idx} className="px-2 py-1 bg-surface border border-slate-300 rounded-md text-[10px] font-medium text-slate-700">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                          {perm}
                        </span>
                      ))}
                      {role.permissions.length > 2 && role.type !== 'System' && (
<<<<<<< HEAD
                        <span className="px-2 py-1 bg-surface border border-white/10 rounded-md text-[10px] font-medium text-textPrimary/40">
=======
                        <span className="px-2 py-1 bg-surface border border-slate-300 rounded-md text-[10px] font-medium text-slate-500">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                          + More
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" leftIcon={<Edit2 className="w-3.5 h-3.5"/>}>
                      Edit Role
                    </Button>
<<<<<<< HEAD
                    <button className="p-2 text-textPrimary/40 hover:text-textPrimary hover:bg-white/10 rounded-lg transition-colors" title="Actions" disabled={role.type === 'System'}>
=======
                    <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors" title="Actions" disabled={role.type === 'System'}>
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
      
      {/* Information Banner */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex gap-4 items-start">
        <Key className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-primary text-sm">Security Best Practice</h4>
<<<<<<< HEAD
          <p className="text-xs text-textPrimary/60 mt-1">Always follow the Principle of Least Privilege (PoLP). Only assign the minimum permissions necessary for a team member to perform their job. System roles cannot be deleted.</p>
=======
          <p className="text-xs text-slate-600 mt-1">Always follow the Principle of Least Privilege (PoLP). Only assign the minimum permissions necessary for a team member to perform their job. System roles cannot be deleted.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
      </div>

    </div>
  );
};
