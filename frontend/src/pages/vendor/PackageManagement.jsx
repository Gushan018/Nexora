import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, CheckCircle2, EyeOff, Loader2, AlertCircle, X, DollarSign, FileText, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';

export const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [formData, setFormData] = useState({
    packageName: '',
    description: '',
    price: '',
    categoryId: ''
  });

  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/vendors/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors/packages');
      setPackages(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load packages. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        packageName: pkg.packageName,
        description: pkg.description || '',
        price: pkg.price.toString(),
        categoryId: pkg.categoryId?.toString() || ''
      });
    } else {
      setEditingPackage(null);
      setFormData({
        packageName: '',
        description: '',
        price: '',
        categoryId: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined
      };

      if (editingPackage) {
        await api.put(`/vendors/packages/${editingPackage.packageId}`, payload);
      } else {
        await api.post('/vendors/packages', payload);
      }
      fetchPackages();
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save package');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (packageId) => {
    setPackageToDelete(packageId);
    setDeleteModalOpen(true);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/vendors/packages/${packageToDelete}`);
      setPackages(prev => prev.filter(p => p.packageId !== packageToDelete));
      setDeleteModalOpen(false);
      setPackageToDelete(null);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete package');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setPackageToDelete(null);
    setDeleteError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Package Management
          </h1>
          <p className="text-textPrimary/60">Bundle your services into attractive event packages.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900">Pricing Packages</h1>
          <p className="text-slate-600">Configure tiered pricing packages for your primary service.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4"/>}>Create New Package</Button>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Total Packages</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{packages.length}</span>
              <span className="text-sm text-textPrimary/40 mb-1">All published</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">New this month</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">
                {packages.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-textPrimary/40 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p>Loading your packages...</p>
          </div>
        ) : error ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-red-400 gap-3 text-center">
            <AlertCircle className="w-10 h-10" />
            <p>{error}</p>
            <Button onClick={fetchPackages} variant="outline" size="sm">Try Again</Button>
          </div>
        ) : packages.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-textPrimary/40 gap-3 text-center border-2 border-dashed border-white/5 rounded-2xl">
            <Package className="w-16 h-16 opacity-10" />
            <p className="text-lg">No packages found yet.</p>
            <Button onClick={() => handleOpenModal()} variant="outline" size="sm" className="mt-2">Create Your First Package</Button>
          </div>
        ) : (
          packages.map((pkg) => (
            <Card key={pkg.packageId} className="group hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col">
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Package className="w-6 h-6" />
=======
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        
        {PACKAGES.map((pkg) => (
          <Card key={pkg.id} className={cn(
            "relative transition-all duration-300 hover:-translate-y-1",
            pkg.popular ? "border-primary/50 shadow-[0_0_30px_rgba(91,124,250,0.15)] bg-primary/5" : "border-slate-300"
          )}>
            {pkg.popular && (
              <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
                <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-white" /> Most Popular
                </span>
              </div>
            )}
            
            <CardContent className="p-6">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={cn("text-xl font-bold", pkg.popular ? "text-primary" : "text-slate-900")}>
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold text-slate-900">LKR {pkg.price}</span>
                    <span className="text-sm text-slate-500">/event</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 group cursor-pointer">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-800 group-hover:text-slate-900 transition-colors">{feature}</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-500/20 bg-green-500/10">
                    <CheckCircle2 className="w-3 h-3 text-green-400" /> <span className="text-green-400">Live</span>
                  </div>
                </div>
                
<<<<<<< HEAD
                <div>
                  <h3 className="text-xl font-bold text-textPrimary mb-1">{pkg.packageName}</h3>
                  {pkg.category && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 mb-2">
                      {pkg.category.categoryName}
                    </span>
                  )}
                  <p className="text-sm text-textPrimary/50 line-clamp-2 min-h-[2.5rem]">{pkg.description || 'No description provided.'}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-textPrimary/40 mb-0.5">Package Price</p>
                    <p className="text-lg font-bold text-textPrimary">LKR {parseFloat(pkg.price).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex gap-2">
                <Button 
                  onClick={() => handleOpenModal(pkg)}
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>
                <button 
                  onClick={() => handleDelete(pkg.packageId)}
                  className="p-2 text-textPrimary/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
=======
                {/* Add Feature Mock */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Plus className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-primary font-medium">Add Feature</span>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}

        {/* Global Add-ons */}
        <div className="lg:col-span-3 mt-8">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center border-b border-slate-200 pb-4">
              <CardTitle>Global Add-ons</CardTitle>
              <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4"/>}>Add Item</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {[
                  { name: 'Extra Hour of Coverage', price: 'LKR 250/hr' },
                  { name: 'Rush Editing (1 Week Delivery)', price: 'LKR 500 flat' },
                  { name: 'Drone Photography', price: 'LKR 350 flat' },
                ].map((addon, i) => (
                  <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                      <span className="font-medium text-slate-900">{addon.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-accent">{addon.price}</span>
                      <button className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingPackage ? 'Edit Package' : 'Create New Package'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Package Name"
            placeholder="e.g. Essential Wedding Bundle"
            value={formData.packageName}
            onChange={(e) => setFormData({...formData, packageName: e.target.value})}
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-textPrimary/90">Description</label>
            <textarea 
              rows="4"
              placeholder="What's included in this package?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-textPrimary/90">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors appearance-none"
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <Input 
            label="Package Price (LKR)"
            type="number"
            placeholder="5000"
            leftIcon={<DollarSign className="w-4 h-4" />}
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={formLoading}>
              {formLoading ? 'Saving...' : editingPackage ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={cancelDelete} title="Delete Package">
        <p className="text-textPrimary/80 mb-6">
          Are you sure you want to delete <strong className="text-textPrimary">
            {packages.find(p => p.packageId === packageToDelete)?.packageName}
          </strong>? This action cannot be undone.
        </p>
        {deleteError && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {deleteError}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-xl border border-white/10 text-textPrimary/70 hover:text-textPrimary hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};