import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, PieChart, TrendingUp, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const BUDGET_CATEGORIES = [
  { id: 1, name: 'Venue & Catering', allocated: 8000, spent: 7500, color: 'bg-primary' },
  { id: 2, name: 'Photography & Video', allocated: 3000, spent: 3200, color: 'bg-accent' },
  { id: 3, name: 'Decor & Flowers', allocated: 2500, spent: 1200, color: 'bg-green-500' },
  { id: 4, name: 'Entertainment', allocated: 1500, spent: 0, color: 'bg-yellow-500' },
];

export const BudgetPlanner = () => {
  const totalAllocated = BUDGET_CATEGORIES.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = BUDGET_CATEGORIES.reduce((sum, cat) => sum + cat.spent, 0);
  const percentageSpent = Math.round((totalSpent / totalAllocated) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-7 h-7 text-primary" />
            Budget Planner
          </h1>
          <p className="text-white/60">Track your event expenses and manage category allocations.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4"/>}>Add Expense</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Total Budget</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-white">${totalAllocated.toLocaleString()}</span>
            </div>
            <p className="text-xs text-white/50 mt-4">Configured for Sarah & John's Wedding</p>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Total Spent</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">${totalSpent.toLocaleString()}</span>
              <span className="text-xl font-bold text-primary">{percentageSpent}%</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${percentageSpent}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Remaining Funds</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">${(totalAllocated - totalSpent).toLocaleString()}</span>
            </div>
            <p className="text-xs text-white/50 mt-4">Across all active categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-white mb-2">Budget Categories</h3>
          
          {BUDGET_CATEGORIES.map(cat => {
            const catPercentage = Math.round((cat.spent / cat.allocated) * 100);
            const isOverBudget = cat.spent > cat.allocated;
            
            return (
              <Card key={cat.id} className="overflow-visible">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                      <h4 className="font-bold text-white text-lg">{cat.name}</h4>
                    </div>
                    <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-white/40 hover:text-primary transition-colors"><Edit2 className="w-4 h-4"/></button>
                      <button className="p-1.5 text-white/40 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Spent: <span className="font-bold text-white">${cat.spent.toLocaleString()}</span></span>
                    <span className="text-white/60">Allocated: <span className="font-bold text-white">${cat.allocated.toLocaleString()}</span></span>
                  </div>
                  
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${isOverBudget ? 'bg-red-500' : cat.color}`} 
                      style={{ width: `${Math.min(catPercentage, 100)}%` }} 
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs font-bold ${isOverBudget ? 'text-red-400' : 'text-white/40'}`}>
                      {isOverBudget ? `Over budget by $${(cat.spent - cat.allocated).toLocaleString()}` : `${catPercentage}% used`}
                    </span>
                    <button className="text-xs text-primary font-medium hover:underline">View Expenses</button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          <Button variant="outline" className="w-full border-dashed border-white/20 text-white/60 hover:text-white" leftIcon={<Plus className="w-4 h-4"/>}>
            Add New Category
          </Button>
        </div>

        {/* Visualizer / Quick actions */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-48 h-48 rounded-full border-[16px] border-surface relative mb-6 flex items-center justify-center">
                {/* Simulated donut chart using conic-gradient */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #5B7CFA 0% 53%, 
                      #7C3AED 53% 74%, 
                      #22c55e 74% 90%, 
                      #eab308 90% 100%
                    )`,
                    margin: '-16px'
                  }}
                />
                <div className="absolute inset-0 bg-background rounded-full m-2 flex flex-col items-center justify-center">
                  <span className="text-white/60 text-xs uppercase tracking-wider mb-1">Total</span>
                  <span className="text-2xl font-bold text-white">${totalAllocated.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-sm text-white/60">Your budget allocation is heavily focused on Venue & Catering (53%).</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Smart Tip
              </h4>
              <p className="text-sm text-white/80 leading-relaxed mb-4">
                You are currently tracking under budget for Entertainment. Consider exploring our Marketplace for live bands or DJs to elevate your event.
              </p>
              <Button size="sm" className="w-full">Browse Marketplace</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
