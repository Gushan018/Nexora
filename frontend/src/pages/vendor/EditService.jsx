import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Save, Trash2, Loader2, AlertCircle, Check, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';

export const EditService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    description: '',
    price: '',
    pricingModel: 'fixed',
    serviceArea: 'Colombo, Kandy, Galle, Negombo',
    imageUrl: '',
    isApproved: true,
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [serviceId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let serviceRes;
      try {
        serviceRes = await api.get(`/services/${serviceId}`);
      } catch (e1) {
        serviceRes = await api.get(`/vendors/services/${serviceId}`);
      }
      const service = serviceRes.data;
      setFormData({
        serviceName: service.serviceName || '',
        category: service.categoryId ? service.categoryId.toString() : (service.category?.categoryId ? service.category.categoryId.toString() : ''),
        description: service.description || '',
        price: service.price ? service.price.toString() : '',
        pricingModel: service.pricingModel || 'fixed',
        serviceArea: service.serviceArea || 'Colombo, Kandy, Galle, Negombo',
        imageUrl: service.imageUrl || '',
        isApproved: service.isApproved !== false,
        createdAt: service.createdAt ? new Date(service.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
        updatedAt: service.updatedAt ? new Date(service.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''
      });
      if (service.imageUrl) {
        setCoverImagePreview(service.imageUrl);
      }
    } catch (err) {
      console.error('Fetch service error:', err);
      setError('Failed to load service details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/vendors/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append('file', file);
    try {
      const response = await api.post('/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.imageUrl || response.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.serviceName.trim()) {
      setError('Service name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }

    setSaving(true);

    try {
      let imageUrl = formData.imageUrl;
      if (coverImage) {
        const uploaded = await uploadImage(coverImage);
        if (uploaded) imageUrl = uploaded;
      } else if (coverImagePreview) {
        imageUrl = coverImagePreview;
      }

      const servicePayload = {
        serviceName: formData.serviceName.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        categoryId: formData.category ? parseInt(formData.category) : null,
        pricingModel: formData.pricingModel,
        serviceArea: formData.serviceArea.trim(),
        imageUrl: imageUrl
      };

      try {
        await api.put(`/services/${serviceId}`, servicePayload);
      } catch (errPut) {
        await api.put(`/vendors/services/${serviceId}`, servicePayload);
      }

      setSuccess('Service updated successfully!');
      setTimeout(() => navigate('/vendor/service-listing'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    try {
      try {
        await api.delete(`/services/${serviceId}`);
      } catch (eDel) {
        await api.delete(`/vendors/services/${serviceId}`);
      }
      navigate('/vendor/service-listing');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading service details...</p>
      </div>
    );
  }

  if (error && !formData.serviceName) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-red-500 gap-4 text-center p-6">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg font-semibold">{error}</p>
        <Button onClick={fetchData} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/vendor/service-listing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 w-fit mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            Edit Service
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Update details for "{formData.serviceName || 'Service'}".
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            leftIcon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4"/>}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-500 text-sm flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <Input
                label="Service Title *"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                placeholder="e.g. Premium Wedding Videography"
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                >
                  <option value="" disabled style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Select a category...</option>
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                        {cat.categoryName}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Photography & Videography</option>
                      <option value="2" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Catering & Food</option>
                      <option value="3" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Decor & Styling</option>
                      <option value="4" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>DJ & Entertainment</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Detailed Description</label>
                <textarea 
                  rows="6" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what makes this service special..."
                  className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Media & Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Cover Photo</label>
                <div className="w-full h-56 rounded-xl border border-slate-300 dark:border-white/10 overflow-hidden relative group bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {coverImagePreview || formData.imageUrl ? (
                    <img 
                      src={coverImagePreview || formData.imageUrl} 
                      alt="Cover" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
                    />
                  ) : (
                    <div className="text-center text-slate-400 p-6">
                      <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Upload or paste an image URL</p>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <span className="text-white font-bold flex items-center gap-2 bg-primary/90 px-4 py-2 rounded-xl backdrop-blur-sm shadow-lg">
                      <Upload className="w-5 h-5"/> Replace Cover Image
                    </span>
                    <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <Input
                label="Or Direct Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => {
                  handleInputChange(e);
                  setCoverImagePreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
              />

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Pricing & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                  label="Starting Price (LKR) *" 
                  leftIcon={<span className="text-xs font-bold text-slate-400">Rs.</span>}
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="250000" 
                  required
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Pricing Model</label>
                  <select 
                    name="pricingModel"
                    value={formData.pricingModel}
                    onChange={handleInputChange}
                    className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="fixed" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Fixed Package</option>
                    <option value="hourly" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Hourly Rate</option>
                    <option value="custom" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Custom Quote Required</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Service Area (Sri Lankan Cities / Districts)</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleInputChange}
                    placeholder="e.g. Colombo, Kandy, Galle, Negombo"
                    className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-500">Separate Sri Lankan locations with commas.</p>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Listing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={cn(
                "p-4 rounded-xl border text-sm",
                formData.isApproved ? "border-green-500/20 bg-green-500/5" : "border-yellow-500/20 bg-yellow-500/5"
              )}>
                <span className={cn("font-bold flex items-center gap-2 mb-1", formData.isApproved ? "text-green-500" : "text-yellow-500")}>
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", formData.isApproved ? "bg-green-500" : "bg-yellow-500")} />
                  {formData.isApproved ? 'Published & Live' : 'Pending Approval'}
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {formData.isApproved ? 'This service is currently visible to customers in search results.' : 'This service is currently pending administrator review.'}
                </p>
              </div>
              {formData.createdAt && (
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-1">
                  <p className="text-xs text-slate-500 flex justify-between">
                    <span>Created:</span>
                    <span className="text-slate-800 dark:text-white font-medium">{formData.createdAt}</span>
                  </p>
                  {formData.updatedAt && (
                    <p className="text-xs text-slate-500 flex justify-between">
                      <span>Last Updated:</span>
                      <span className="text-slate-800 dark:text-white font-medium">{formData.updatedAt}</span>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Permanently delete this service. This action cannot be undone and will remove it from all future search results.</p>
              <Button 
                onClick={handleDelete}
                variant="outline" 
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30" 
                leftIcon={<Trash2 className="w-4 h-4"/>}
              >
                Delete Service
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
