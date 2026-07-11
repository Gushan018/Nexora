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
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Calculator className="w-7 h-7 text-primary" />
            Budget Planner
          </h1>
          <p className="text-textPrimary/60">Track your event expenses and manage category allocations.</p>
        </div>
        <Button onClick={() => handleOpenCatModal()} leftIcon={<Plus className="w-4 h-4"/>}>Add Expense / Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5 relative group cursor-pointer" onClick={handleOpenTotalModal}>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 className="w-4 h-4 text-primary" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Total Budget</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-textPrimary">LKR {totalAllocated.toLocaleString()}</span>
            </div>
            <p className="text-xs text-primary/80 mt-4">Click to edit total budget</p>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Spent</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-textPrimary">LKR {totalSpent.toLocaleString()}</span>
              <span className="text-xl font-bold text-primary">{percentageSpent}%</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${Math.min(percentageSpent, 100)}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Remaining Funds</h3>
            <div className="flex items-end gap-3">
              <span className={`text-3xl font-bold ${(totalAllocated - totalSpent) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                LKR {(totalAllocated - totalSpent).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-textPrimary/50 mt-4">Across all active categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-textPrimary mb-2">Budget Categories</h3>
          
          {categories.length === 0 && (
            <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
              <p className="text-textPrimary/50">No categories added yet.</p>
            </div>
          )}

          {categories.map(cat => {
            const allocated = parseFloat(cat.allocated);
            const spent = parseFloat(cat.spent);
            const catPercentage = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
            const isOverBudget = spent > allocated;
            
            return (
              <Card key={cat.id} className="overflow-visible group border-white/5 hover:border-white/10 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${cat.color || 'bg-primary'}`} />
                      <h4 className="font-bold text-textPrimary text-lg">{cat.name}</h4>
                    </div>
                    <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenCatModal(cat)} className="p-1.5 text-textPrimary/40 hover:text-primary transition-colors bg-white/5 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteCat(cat.id)} className="p-1.5 text-textPrimary/40 hover:text-red-400 transition-colors bg-white/5 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-textPrimary/60">Spent: <span className="font-bold text-textPrimary">LKR {spent.toLocaleString()}</span></span>
                    <span className="text-textPrimary/60">Allocated: <span className="font-bold text-textPrimary">LKR {allocated.toLocaleString()}</span></span>
                  </div>
                  
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${isOverBudget ? 'bg-red-500' : cat.color || 'bg-primary'}`} 
                      style={{ width: `${Math.min(catPercentage, 100)}%` }} 
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs font-bold ${isOverBudget ? 'text-red-400' : 'text-textPrimary/40'}`}>
                      {isOverBudget ? `Over budget by LKR ${(spent - allocated).toLocaleString()}` : `${catPercentage}% used`}
                    </span>
                    <button onClick={() => handleOpenCatModal(cat)} className="text-xs text-primary font-medium hover:underline">Add Expense</button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          <Button onClick={() => handleOpenCatModal()} variant="outline" className="w-full border-dashed border-white/20 text-textPrimary/60 hover:text-textPrimary" leftIcon={<Plus className="w-4 h-4"/>}>
            Add New Category
          </Button>
        </div>

        {/* Visualizer / Quick actions */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-48 h-48 rounded-full border-[16px] border-surface relative mb-6 flex items-center justify-center">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #5B7CFA 0% 53%, 
                      #D4AF37 53% 74%, 
                      #22c55e 74% 90%, 
                      #eab308 90% 100%
                    )`,
                    margin: '-16px'
                  }}
                />
                <div className="absolute inset-0 bg-background rounded-full m-2 flex flex-col items-center justify-center">
                  <span className="text-textPrimary/60 text-xs uppercase tracking-wider mb-1">Total</span>
                  <span className="text-2xl font-bold text-textPrimary">LKR {totalAllocated.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-sm text-textPrimary/60">Your budget is tracked securely. Stay on top of your expenses.</p>
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

