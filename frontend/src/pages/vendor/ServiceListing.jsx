import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Search, Filter, Plus, Edit2, Trash2, Tag, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';
import { Link } from 'react-router-dom';

export const ServiceListing = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors/services');
      setServices(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load services. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (serviceId) => {
    setServiceToDelete(serviceId);
    setDeleteModalOpen(true);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/vendors/services/${serviceToDelete}`);
      setServices(prev => prev.filter(s => s.serviceId !== serviceToDelete));
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setServiceToDelete(null);
    setDeleteError('');
  };

  const categories = [...new Set(services.map(s => s.category?.categoryName).filter(Boolean))];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || service.category?.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary" />
            My Services
          </h1>
          <p className="text-slate-600">Manage the services and packages you offer to clients.</p>
        </div>
        <Link to="/vendor/create-service">
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Create New Service</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Active Services</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">3</span>
              <span className="text-sm text-green-400 mb-1">Visible to clients</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Total Bookings (All Time)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">46</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Drafts / Hidden</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">1</span>
              <span className="text-sm text-slate-500 mb-1">Not visible</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-full bg-surface/50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-surface/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
                <th className="p-4 pl-6">Service Name</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Bookings</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {SERVICES.map((service, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface border border-slate-300 flex items-center justify-center shrink-0">
                        <Tag className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{service.name}</span>
                        <span className="text-xs text-slate-500">{service.category} â€¢ {service.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{service.price}</td>
                  <td className="p-4 text-slate-600">{service.bookings} completed</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {service.status === 'Active' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-500">Hidden</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit Service">
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      <button className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                      <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredServices.map((service) => (
                  <tr key={service.serviceId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {service.imageUrl ? (
                            <img src={service.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Tag className="w-5 h-5 text-textPrimary/40" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-textPrimary">{service.serviceName}</span>
                          <span className="text-xs text-textPrimary/50">ID: SVC-{service.serviceId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-textPrimary/80">LKR {parseFloat(service.price).toLocaleString()}</td>
                    <td className="p-4 text-textPrimary/60">{service.category?.categoryName || 'Uncategorized'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">Published</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/vendor/edit-service/${service.serviceId}`}>
                          <button className="p-2 text-textPrimary/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit Service">
                            <Edit2 className="w-4 h-4"/>
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(service.serviceId)}
                          className="p-2 text-textPrimary/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
      <Modal isOpen={deleteModalOpen} onClose={cancelDelete} title="Delete Service">
        <p className="text-textPrimary/80 mb-6">
          Are you sure you want to delete <strong className="text-textPrimary">
            {services.find(s => s.serviceId === serviceToDelete)?.serviceName}
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
