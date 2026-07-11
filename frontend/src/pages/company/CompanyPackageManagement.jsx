import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, CheckCircle2, ShieldCheck, Edit, Trash2, Calendar, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../utils/api';

export const CompanyPackageManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    packageName: '',
    category: 'Wedding',
    price: '',
    maxGuests: '250',
    description: '',
  });

  const { data: packagesData, isLoading } = useQuery({
    queryKey: ['companyPackages'],
    queryFn: async () => {
      const res = await api.get('/packages/my');
      return res.data;
    },
  });

  const packagesList = Array.isArray(packagesData) ? packagesData : packagesData?.packages || [];

  const createPackageMutation = useMutation({
    mutationFn: (newPackage) => api.post('/packages', newPackage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPackages'] });
      setIsCreateModalOpen(false);
      setFormData({ packageName: '', category: 'Wedding', price: '', maxGuests: '250', description: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPackageMutation.mutate({
      ...formData,
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests, 10),
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Event Package Management
          </h1>
          <p className="text-gray-600 dark:text-white/60">Create & manage complete event packages (Weddings, Galas, Birthdays, Anniversaries).</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Create Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packagesList.map((pkg) => (
          <Card key={pkg.packageId || pkg.id} className="border-gray-200 dark:border-white/10 flex flex-col justify-between">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary rounded-full border border-primary/30">
                  {pkg.category || 'Event Package'}
                </span>
                <span className="text-xl font-bold text-emerald-400">LKR {Number(pkg.price || 0).toLocaleString()}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{pkg.packageName}</h3>
              <p className="text-sm text-gray-600 dark:text-white/60 line-clamp-3 mb-4">{pkg.description}</p>
              
              <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-white/5 text-xs text-gray-500 dark:text-white/60">
                <div className="flex items-center justify-between">
                  <span>Capacity:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{pkg.maxGuests || 250} Guests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Approved
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for Creating New Package */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Full-Service Event Package">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1">Package Name</label>
            <input
              type="text"
              required
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              placeholder="e.g. Royal Platinum Wedding Package"
              className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white"
              >
                <option value="Wedding">Wedding</option>
                <option value="Corporate Gala">Corporate Gala</option>
                <option value="Birthday">Birthday Party</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Concert">Concert / Festival</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1">Price (LKR)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="250000"
                className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1">Description & Included Offerings</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail full event decoration, stage setup, lighting, sound, catering, & coordination..."
              className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createPackageMutation.isPending}>
              {createPackageMutation.isPending ? 'Publishing...' : 'Publish Package'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
