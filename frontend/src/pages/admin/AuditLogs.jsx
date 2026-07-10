import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Filter, Server, Terminal, Lock, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const LOGS = [
  { id: 'EVT-001', actor: 'Alice Freeman (Admin)', action: 'Modified System Settings', target: '/config/maintenance-mode', ip: '192.168.1.45', date: '2 mins ago', risk: 'Medium' },
  { id: 'EVT-003', actor: 'David Osei (Admin)', action: 'Issued Refund', target: 'BKG-8812', ip: '10.0.0.12', date: '1 hour ago', risk: 'High' },
  { id: 'EVT-004', actor: 'John Doe (User)', action: 'Failed Login Attempt (x5)', target: 'auth/login', ip: '45.22.11.90', date: '2 hours ago', risk: 'High' },
  { id: 'EVT-005', actor: 'Alice Freeman (Admin)', action: 'Deleted Product', target: 'PRD-1092', ip: '192.168.1.45', date: '3 hours ago', risk: 'Medium' },
];

export const AuditLogs = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-7 h-7 text-primary" />
            Security Audit Logs
          </h1>
          <p className="text-slate-600">Immutable record of all administrative and critical system actions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4"/>}>Export JSON</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Events Logged (24h)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">12,450</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Active Admins</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">8</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 mb-2">High Risk Events</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-red-400">2</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">System Integrity</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-green-400">Secure</span>
              </div>
            </div>
            <Shield className="w-8 h-8 text-green-400/20" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by Actor, Action, or IP..." 
              className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Filter by Risk: All</option>
              <option>Risk: High</option>
              <option>Risk: Medium</option>
              <option>Risk: Low</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>More Filters</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
                <th className="p-4 pl-6">Timestamp & ID</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action Taken</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">IP Address</th>
                <th className="p-4 pr-6 text-right">Risk Level</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono">
              {LOGS.map((log, i) => (
                <tr key={i} className={cn(
                  "border-b border-slate-200 transition-colors",
                  log.risk === 'High' ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-slate-50"
                )}>
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="text-slate-800">{log.date}</span>
                      <span className="text-xs text-slate-500">{log.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-900 font-sans font-medium">{log.actor}</td>
                  <td className="p-4 text-primary">{log.action}</td>
                  <td className="p-4 text-slate-600">{log.target}</td>
                  <td className="p-4 text-slate-600">{log.ip}</td>
                  <td className="p-4 pr-6 text-right">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-bold font-sans px-2.5 py-1 rounded-full border",
                      log.risk === 'High' ? "text-red-400 bg-red-400/10 border-red-400/20" : 
                      log.risk === 'Medium' ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" :
                      "text-green-400 bg-green-400/10 border-green-400/20"
                    )}>
                      {log.risk === 'High' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {log.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-surface/30">
          <p className="text-xs text-slate-500 font-mono text-center flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Logs are cryptographically signed and cannot be tampered with.
          </p>
        </div>
      </Card>
    </div>
  );
};
