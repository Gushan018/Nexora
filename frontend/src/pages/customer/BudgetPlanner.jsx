import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, PieChart, TrendingUp, Plus, Edit2, Trash2, Edit3 } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';

const COLORS = ['bg-primary', 'bg-accent', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];

export const BudgetPlanner = () => {
  const queryClient = useQueryClient();
  
  // States for Modals
  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);
  const [editTotalBudget, setEditTotalBudget] = useState('');
  
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ id: null, name: '', allocated: '', spent: '', color: 'bg-primary' });

  // Fetch Budget
  const { data: budget, isLoading } = useQuery({
    queryKey: ['budget'],
    queryFn: async () => {
      const res = await api.get('/budget');
      return res.data;
    }
  });

  // Mutations
  const totalMut = useMutation({
    mutationFn: async (totalBudget) => api.put('/budget/total', { totalBudget }),
    onSuccess: () => {
      queryClient.invalidateQueries(['budget']);
      setIsTotalModalOpen(false);
    }
  });

  const addCatMut = useMutation({
    mutationFn: async (data) => api.post('/budget/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['budget']);
      setIsCatModalOpen(false);
    }
  });

  const updateCatMut = useMutation({
    mutationFn: async (data) => api.put(`/budget/categories/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['budget']);
      setIsCatModalOpen(false);
    }
  });

  const deleteCatMut = useMutation({
    mutationFn: async (id) => api.delete(`/budget/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['budget'])
  });

  // Calculations
  const categories = budget?.categories || [];
  const totalAllocated = parseFloat(budget?.totalBudget || 0);
  const totalSpent = categories.reduce((sum, cat) => sum + parseFloat(cat.spent), 0);
  const percentageSpent = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  // Handlers
  const handleOpenTotalModal = () => {
    setEditTotalBudget(totalAllocated.toString());
    setIsTotalModalOpen(true);
  };

  const handleSaveTotal = () => {
    if (editTotalBudget && !isNaN(editTotalBudget)) {
      totalMut.mutate(parseFloat(editTotalBudget));
    }
  };

  const handleOpenCatModal = (cat = null) => {
    if (cat) {
      setCatForm({ id: cat.id, name: cat.name, allocated: cat.allocated, spent: cat.spent, color: cat.color });
    } else {
      setCatForm({ id: null, name: '', allocated: '', spent: '0', color: COLORS[Math.floor(Math.random() * COLORS.length)] });
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCat = () => {
    const data = {
      name: catForm.name,
      allocated: parseFloat(catForm.allocated || 0),
      spent: parseFloat(catForm.spent || 0),
      color: catForm.color
    };
    if (catForm.id) {
      updateCatMut.mutate({ id: catForm.id, ...data });
    } else {
      addCatMut.mutate(data);
    }
  };

  const handleDeleteCat = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCatMut.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-7 h-7 text-primary" />
            Budget Planner
          </h1>
          <p className="text-slate-600 dark:text-slate-300">Track your event expenses and manage category allocations.</p>
        </div>
        <Button onClick={() => handleOpenCatModal()} className="bg-primary text-slate-950 font-bold hover:bg-primary/90" leftIcon={<Plus className="w-4 h-4"/>}>Add Expense / Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/30 bg-primary/10 dark:bg-primary/10 relative group cursor-pointer" onClick={handleOpenTotalModal}>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 className="w-4 h-4 text-primary" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Budget</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">LKR {totalAllocated.toLocaleString()}</span>
            </div>
            <p className="text-xs text-primary font-bold mt-4">Click to edit total budget</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C2333]">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Total Spent</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">LKR {totalSpent.toLocaleString()}</span>
              <span className="text-xl font-bold text-primary">{percentageSpent}%</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="h-full bg-primary" style={{ width: `${Math.min(percentageSpent, 100)}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C2333]">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Remaining Funds</h3>
            <div className="flex items-end gap-3">
              <span className={`text-3xl font-extrabold ${(totalAllocated - totalSpent) < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                LKR {(totalAllocated - totalSpent).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Across all active categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Budget Categories</h3>
          
          {categories.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">No categories added yet.</p>
            </div>
          )}

          {categories.map(cat => {
            const allocated = parseFloat(cat.allocated || 0);
            const spent = parseFloat(cat.spent || 0);
            const catPercentage = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
            const isOverBudget = spent > allocated && allocated > 0;
            
            return (
              <Card key={cat.id || cat.name} className="overflow-visible group border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C2333] hover:border-primary/50 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3.5 h-3.5 rounded-full ${cat.color || 'bg-primary'}`} />
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{cat.name}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenCatModal({ name: cat.name, allocated: cat.allocated, spent: '0', color: cat.color })} className="text-xs text-primary font-bold hover:underline flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg">
                        <Plus className="w-3.5 h-3.5" /> Add Expense
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Spent: <span className="font-bold text-slate-900 dark:text-white">LKR {spent.toLocaleString()}</span></span>
                    {allocated > 0 && (
                      <span className="text-slate-600 dark:text-slate-400">Allocated: <span className="font-bold text-slate-900 dark:text-white">LKR {allocated.toLocaleString()}</span></span>
                    )}
                  </div>
                  
                  {allocated > 0 && (
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2 border border-slate-200 dark:border-slate-700">
                      <div 
                        className={`h-full ${isOverBudget ? 'bg-red-500' : cat.color || 'bg-primary'}`} 
                        style={{ width: `${Math.min(catPercentage, 100)}%` }} 
                      />
                    </div>
                  )}

                  {/* Nested Expenses List */}
                  {cat.items && cat.items.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Included Items ({cat.items.length})</span>
                      {cat.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {item.title}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">LKR {Number(item.spent).toLocaleString()}</span>
                            {item.isPaid && <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">Paid</span>}
                            <button onClick={() => handleDeleteCat(item.id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {allocated > 0 && (
                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-xs font-bold ${isOverBudget ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                        {isOverBudget ? `Over budget by LKR ${(spent - allocated).toLocaleString()}` : `${catPercentage}% used`}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
          
          <Button onClick={() => handleOpenCatModal()} variant="outline" className="w-full border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" leftIcon={<Plus className="w-4 h-4"/>}>
            Add Custom Category
          </Button>
        </div>

        {/* Visualizer / Quick actions */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C2333]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 dark:border-slate-900 relative mb-6 flex items-center justify-center shadow-inner">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: categories.length ? `conic-gradient(${categories.map((c, i) => {
                      const colorMap = { 'bg-primary': '#5B7CFA', 'bg-accent': '#D4AF37', 'bg-green-500': '#22c55e', 'bg-blue-500': '#3b82f6', 'bg-purple-500': '#a855f7', 'bg-pink-500': '#ec4899', 'bg-orange-500': '#f97316' };
                      const color = colorMap[c.color] || '#5B7CFA';
                      const start = (i / categories.length) * 100;
                      const end = ((i + 1) / categories.length) * 100;
                      return `${color} ${start}% ${end}%`;
                    }).join(', ')})` : '#5B7CFA',
                    margin: '-16px'
                  }}
                />
                <div className="absolute inset-0 bg-white dark:bg-[#0A101D] rounded-full m-2 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1 font-medium">Total Spent</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">LKR {totalSpent.toLocaleString()}</span>
                  <span className="text-xs text-primary font-bold mt-1">{percentageSpent}% of total</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Expenses and bookings are automatically grouped by category for real-time tracking.</p>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Modals */}
      <Modal isOpen={isTotalModalOpen} onClose={() => setIsTotalModalOpen(false)} title="Update Total Budget">
        <div className="space-y-4">
          <Input 
            label="Total Budget Amount (LKR)" 
            type="number" 
            value={editTotalBudget} 
            onChange={(e) => setEditTotalBudget(e.target.value)} 
            placeholder="e.g. 500000"
          />
          <Button onClick={handleSaveTotal} isLoading={totalMut.isPending} className="w-full">Save Changes</Button>
        </div>
      </Modal>

      <Modal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title={catForm.id ? "Edit Category" : "Add Category"}>
        <div className="space-y-4">
          <Input 
            label="Category Name" 
            value={catForm.name} 
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} 
            placeholder="e.g. Venue, Photography"
          />
          <Input 
            label="Allocated Budget (LKR)" 
            type="number" 
            value={catForm.allocated} 
            onChange={(e) => setCatForm({ ...catForm, allocated: e.target.value })} 
          />
          <Input 
            label="Amount Spent (LKR)" 
            type="number" 
            value={catForm.spent} 
            onChange={(e) => setCatForm({ ...catForm, spent: e.target.value })} 
            helperText="Update this as you make payments."
          />
          <div>
            <label className="text-sm font-medium text-textPrimary/90 mb-2 block">Color Tag</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <div 
                  key={c} 
                  onClick={() => setCatForm({ ...catForm, color: c })}
                  className={`w-8 h-8 rounded-full cursor-pointer ${c} ${catForm.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : 'opacity-50 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleSaveCat} isLoading={addCatMut.isPending || updateCatMut.isPending} className="w-full mt-4">
            {catForm.id ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </Modal>

    </div>
  );
};

