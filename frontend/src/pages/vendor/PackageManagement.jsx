import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, CheckCircle2, EyeOff, Loader2, AlertCircle, X, DollarSign, FileText, Check, GripVertical, Star } from 'lucide-react';
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

  // Global Add-ons state
  const [addons, setAddons] = useState(() => {
    const saved = localStorage.getItem('vendor_global_addons');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState('');

  const saveAddons = (newAddons) => {
    setAddons(newAddons);
    localStorage.setItem('vendor_global_addons', JSON.stringify(newAddons));
  };

  const handleCreateAddon = (e) => {
    e.preventDefault();
    if (!newAddonName.trim()) return;
    const item = {
      id: Date.now().toString(),
      name: newAddonName.trim(),
      price: newAddonPrice.trim() || 'LKR 0',
    };
    saveAddons([...addons, item]);
    setNewAddonName('');
    setNewAddonPrice('');
    setIsAddonModalOpen(false);
  };

  const handleDeleteAddon = (id) => {
    saveAddons(addons.filter(a => a.id !== id));
  };

  const [formData, setFormData] = useState({
    packageName: '',
    description: '',
    price: '',
    category: ''
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
      const response = await api.get('/packages?my=true');
      setPackages(Array.isArray(response.data) ? response.data : (response.data?.packages || []));
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
        price: pkg.price ? pkg.price.toString() : '',
        category: pkg.category || (pkg.categoryId ? pkg.categoryId.toString() : '')
      });
    } else {
      setEditingPackage(null);
      setFormData({
        packageName: '',
        description: '',
        price: '',
        category: ''
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
        packageName: formData.packageName,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        categoryId: formData.category && !isNaN(formData.category) ? parseInt(formData.category) : undefined
      };

      if (editingPackage) {
        await api.put(`/packages/${editingPackage.packageId}`, payload);
      } else {
        await api.post('/packages', payload);
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
    <div className="space-y-6 text-slate-900 dark:text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Pricing Packages</h1>
          <p className="text-slate-600 dark:text-slate-300">Configure tiered pricing packages for your primary service.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4"/>}>Create New Package</Button>
      </div>

      {loading ? (
        <div className="text-center text-slate-500 dark:text-slate-400 py-12">Loading packages...</div>
      ) : packages.length === 0 ? (
        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-surface">
          <CardContent className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Packages Found</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Create your first tiered pricing package to offer clients bundled event services.</p>
            <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4"/>}>Create New Package</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {packages.map((pkg) => (
            <Card key={pkg.packageId} className="relative transition-all duration-300 hover:-translate-y-1 border-slate-300 dark:border-white/10 bg-white dark:bg-surface">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pkg.packageName}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">LKR {Number(pkg.price).toLocaleString()}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">/event</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => handleOpenModal(pkg)}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors"
                      title="Edit Package"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(pkg.packageId)}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{pkg.description || 'Custom event service package.'}</p>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {pkg.isApproved ? 'Approved & Live' : 'Pending Approval'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

        {/* Global Add-ons */}
        <div className="lg:col-span-3 mt-8">
          <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-surface">
            <CardHeader className="flex flex-row justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
              <CardTitle className="text-slate-900 dark:text-white">Global Add-ons</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Plus className="w-4 h-4"/>}
                onClick={() => setIsAddonModalOpen(true)}
              >
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {addons.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No global add-ons added yet. Click "Add Item" above.</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {addons.map((addon) => (
                    <div key={addon.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 cursor-grab" />
                        <span className="font-medium text-slate-900 dark:text-white">{addon.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-amber-500">{addon.price}</span>
                        <button 
                          onClick={() => handleDeleteAddon(addon.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Delete Add-on"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      {/* Add-on Modal */}
      <Modal
        isOpen={isAddonModalOpen}
        onClose={() => setIsAddonModalOpen(false)}
        title="Add Global Add-on"
      >
        <form onSubmit={handleCreateAddon} className="space-y-4">
          <Input 
            label="Add-on Name"
            placeholder="e.g. Extra Hour of Coverage"
            value={newAddonName}
            onChange={(e) => setNewAddonName(e.target.value)}
            required
          />
          <Input 
            label="Price Rate"
            placeholder="e.g. LKR 500/hr or LKR 1000 flat"
            value={newAddonPrice}
            onChange={(e) => setNewAddonPrice(e.target.value)}
            required
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddonModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Add-on
            </Button>
          </div>
        </form>
      </Modal>

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
            <label className="text-sm font-medium text-slate-900 dark:text-white">Description</label>
            <textarea 
              rows="4"
              placeholder="What's included in this package?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col space-y-1.5 w-full">
            <label className="text-sm font-medium text-gray-700 dark:text-white/90">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="flex w-full rounded-xl border border-gray-300 dark:border-white/10 bg-light-surface dark:bg-surface/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 cursor-pointer"
            >
              <option value="" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Select a category...</option>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <option key={cat.categoryId || cat.categoryName} value={cat.categoryName} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                    {cat.categoryName}
                  </option>
                ))
              ) : (
                <>
                  <option value="Decorations" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Decorations</option>
                  <option value="Food & Catering" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Food & Catering</option>
                  <option value="Music & Entertainment" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Music & Entertainment</option>
                  <option value="Photography & Video" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Photography & Video</option>
                </>
              )}
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

