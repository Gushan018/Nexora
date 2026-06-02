import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, Clock, AlertCircle, CheckCircle2, MoreVertical, GripVertical } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const TASKS = [
  { id: 1, title: 'Book Wedding Photographer', category: 'Vendors', due: 'Oct 30', priority: 'High', status: 'Pending' },
  { id: 2, name: 'Finalize Guest List', category: 'Planning', due: 'Nov 15', priority: 'High', status: 'In Progress' },
  { id: 3, name: 'Order Invitations', category: 'Planning', due: 'Nov 20', priority: 'Medium', status: 'Pending' },
  { id: 4, name: 'Pay Venue Deposit', category: 'Finance', due: 'Oct 25', priority: 'High', status: 'Completed' },
  { id: 5, name: 'Schedule Cake Tasting', category: 'Vendors', due: 'Dec 05', priority: 'Low', status: 'Pending' },
];

export const TaskManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-primary" />
            Task Management
          </h1>
          <p className="text-white/60">Keep your event planning on track with our intelligent checklist.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4"/>}>Add Task</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Total Tasks</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">42</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Completed</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">18</span>
              <span className="text-sm text-green-400/60 mb-1">42%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Due Soon</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-400">5</span>
              <span className="text-sm text-yellow-400/60 mb-1">Next 7 days</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Overdue</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-red-400">0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kanban / Task List Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-white">High Priority</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            {TASKS.slice(0, 3).map((task) => (
              <Card key={task.id} className="hover:border-primary/30 transition-colors group">
                <CardContent className="p-4 flex items-center gap-4">
                  <button className="text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </button>
                  
                  <button className={cn(
                    "w-6 h-6 rounded border flex items-center justify-center transition-colors shrink-0",
                    task.status === 'Completed' ? "bg-primary border-primary text-white" : "border-white/20 hover:border-primary text-transparent"
                  )}>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="flex-1">
                    <h4 className={cn(
                      "font-medium transition-colors",
                      task.status === 'Completed' ? "text-white/40 line-through" : "text-white group-hover:text-primary"
                    )}>
                      {task.title || task.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs mt-1">
                      <span className="text-white/40 bg-white/5 px-2 py-0.5 rounded">{task.category}</span>
                      <span className={cn(
                        "flex items-center gap-1",
                        task.priority === 'High' ? "text-red-400" : "text-white/40"
                      )}>
                        <AlertCircle className="w-3 h-3" /> {task.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-white/50 bg-surface px-2.5 py-1.5 rounded-lg border border-white/5">
                      <Clock className="w-3.5 h-3.5" />
                      {task.due}
                    </div>
                    <button className="text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 mb-2">
            <h3 className="font-bold text-white">Completed Tasks</h3>
            <span className="text-sm text-white/40">18 total</span>
          </div>
          
          <div className="space-y-3 opacity-60">
            {TASKS.slice(3, 4).map((task) => (
              <Card key={task.id} className="bg-surface/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <button className="text-white/20 cursor-not-allowed">
                    <GripVertical className="w-5 h-5" />
                  </button>
                  
                  <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-white/60 line-through">
                      {task.title || task.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs mt-1">
                      <span className="text-white/30">{task.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-white mb-4">Categories</h3>
              <div className="space-y-3">
                {[
                  { name: 'Vendors', count: 12, color: 'bg-primary' },
                  { name: 'Planning', count: 8, color: 'bg-accent' },
                  { name: 'Finance', count: 5, color: 'bg-green-500' },
                  { name: 'Attire', count: 3, color: 'bg-yellow-500' },
                ].map((cat, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">{cat.name}</span>
                    </div>
                    <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/40 group-hover:bg-white/10 transition-colors">{cat.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h4 className="font-bold text-white mb-2">Automated Tasks</h4>
              <p className="text-sm text-white/80 leading-relaxed mb-4">
                Nexora automatically created 32 tasks based on your event type (Wedding). We recommend reviewing them to ensure nothing is missed!
              </p>
              <Button size="sm" className="w-full">Review Auto-Tasks</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
