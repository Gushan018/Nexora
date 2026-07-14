import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, ShieldCheck, Edit, Trash2, Calendar, Users, DollarSign, Clock, Layers, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../utils/api';

export const CompanyPackageManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const [formData, setFormData] = useState({
    packageName: '',
    category: 'Wedding',
    price: '',
    maxGuests: '250',
    duration: 'Full Day (12 Hours)',
    servicesInput: 'Catering, Stage Decoration, Live Sound, Photography',
    imageUrl: '',
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
      closeModal();
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/packages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPackages'] });
      closeModal();
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: (id) => api.delete(`/packages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyPackages'] });
    },
  });

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingPackage(null);
    setFormData({
      packageName: '',
      category: 'Wedding',
      price: '',
      maxGuests: '250',
      duration: 'Full Day (12 Hours)',
      servicesInput: 'Catering, Stage Decoration, Live Sound, Photography',
      imageUrl: '',
      description: '',
    });
  };

  const handleEditClick = (pkg) => {
    setEditingPackage(pkg);
    const servicesStr = pkg.services?.map(s => s.name || s).join(', ') || '';
    const imgStr = pkg.images?.[0]?.url || '';
    setFormData({
      packageName: pkg.packageName || '',
      category: pkg.category || 'Wedding',
      price: pkg.price ? String(pkg.price) : '',
      maxGuests: pkg.maxGuests ? String(pkg.maxGuests) : '250',
      duration: pkg.duration || 'Full Day (12 Hours)',
      servicesInput: servicesStr,
      imageUrl: imgStr,
      description: pkg.description || '',
    });
    setIsCreateModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const servicesArray = formData.servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      packageName: formData.packageName,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      maxGuests: parseInt(formData.maxGuests, 10) || 0,
      duration: formData.duration,
      description: formData.description,
      services: servicesArray,
      images: formData.imageUrl ? [formData.imageUrl] : [],
    };

    if (editingPackage) {
      updatePackageMutation.mutate({ id: editingPackage.packageId || editingPackage.id, data: payload });
    } else {
      createPackageMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Event Package Management
          </h1>
          <p className="text-gray-600 dark:text-white/60">Create & manage complete full-service event packages (Weddings, Galas, Birthdays, Anniversaries).</p>
        </div>
        <Button onClick={() => { setEditingPackage(null); setIsCreateModalOpen(true); }} leftIcon={<Plus className="w-4 h-4" />}>
          Create Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packagesList.map((pkg) => {
          const coverImage = pkg.images?.[0]?.url;
          const serviceList = pkg.services?.map(s => s.name || s) || [];
          return (
            <Card key={pkg.packageId || pkg.id} className="border-gray-200 dark:border-white/10 flex flex-col justify-between overflow-hidden bg-white dark:bg-surface">
              {coverImage && (
                <div className="h-40 w-full overflow-hidden relative border-b border-gray-200 dark:border-white/10">
                  <img src={coverImage} alt={pkg.packageName} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-slate-950/80 text-primary backdrop-blur-md rounded-full border border-primary/30">
                    {pkg.category || 'Event Package'}
                  </span>
                </div>
              )}

              <CardContent className="p-6">
                {!coverImage && (
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary rounded-full border border-primary/30">
                      {pkg.category || 'Event Package'}
                    </span>
                    <span className="text-xl font-bold text-emerald-400">LKR {Number(pkg.price || 0).toLocaleString()}</span>
                  </div>
                )}

                {coverImage && (
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl font-bold text-emerald-400">LKR {Number(pkg.price || 0).toLocaleString()}</span>
                  </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{pkg.packageName}</h3>
                <p className="text-sm text-gray-600 dark:text-white/60 line-clamp-2 mb-4">{pkg.description}</p>

                {/* Included Services Badges */}
                {serviceList.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-white/50 mb-1.5 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-primary" /> Included Services:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {serviceList.map((service, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/80 rounded-md border border-gray-200 dark:border-white/5">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-white/5 text-xs text-gray-500 dark:text-white/60">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gray-400" /> Guest Capacity:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{pkg.maxGuests || 250} Guests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> Event Duration:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{pkg.duration || 'Full Day'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Approval Status:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Approved
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-white/5">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(pkg)} leftIcon={<Edit className="w-3.5 h-3.5" />}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-500/10 border-red-500/30" onClick={() => deletePackageMutation.mutate(pkg.packageId || pkg.id)} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal for Creating / Editing Package */}
      <Modal isOpen={isCreateModalOpen} onClose={closeModal} title={editingPackage ? "Edit Event Package" : "Create Full-Service Event Package"} maxWidth="max-w-2xl">
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
                <option value="Birthday Party">Birthday Party</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Concert / Festival">Concert / Festival</option>
                <option value="Private Dining">Private Dining</option>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1">Guest Capacity (Max Guests)</label>
              <input
                type="number"
                required
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                placeholder="250"
                className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1">Event Duration</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. Full Day (12 Hours) or 8 Hours"
                className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1">Included Services (Comma Separated)</label>
            <input
              type="text"
              value={formData.servicesInput}
              onChange={(e) => setFormData({ ...formData, servicesInput: e.target.value })}
              placeholder="e.g. Catering, Stage Decor, Sound System, Photography"
              className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1">Package Banner Image URL (Optional)</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white"
            />
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
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button type="submit" disabled={createPackageMutation.isPending || updatePackageMutation.isPending}>
              {createPackageMutation.isPending || updatePackageMutation.isPending ? 'Saving...' : (editingPackage ? 'Update Package' : 'Publish Package')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
