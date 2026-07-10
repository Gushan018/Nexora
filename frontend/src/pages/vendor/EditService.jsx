import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Upload, Save, Trash2, Loader2, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

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
  });

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [serviceId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceRes] = await Promise.all([
        api.get(`/vendors/services/${serviceId}`)
      ]);
      const service = serviceRes.data;
      setFormData({
        serviceName: service.serviceName || '',
        category: service.categoryId ? service.categoryId.toString() : '',
        description: service.description || '',
        price: service.price ? service.price.toString() : '',
      });
      if (service.imageUrl) {
        setCoverImagePreview(service.imageUrl);
      }
    } catch (err) {
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
      let imageUrl = coverImagePreview;
      if (coverImage) {
        imageUrl = await uploadImage(coverImage);
      }

      await api.put(`/vendors/services/${serviceId}`, {
        serviceName: formData.serviceName.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        categoryId: formData.category ? parseInt(formData.category) : null,
        imageUrl: imageUrl
      });

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
      await api.delete(`/vendors/services/${serviceId}`);
      navigate('/vendor/service-listing');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service');
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textPrimary/40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg">Loading service details...</p>
      </div>
    );
  }

  if (error && !formData.serviceName) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-red-400 gap-4 text-center p-6">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg">{error}</p>
        <Button onClick={fetchData} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/vendor/service-listing" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 w-fit mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Edit Service
          </h1>
          <p className="text-slate-600">Update details for "Premium Wedding Videography".</p>
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
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">

        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <Input
                label="Service Title"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                placeholder="e.g. Premium Wedding Videography"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Category</label>
                <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer" defaultValue="photography">
                  <option value="photography">Photography & Videography</option>
                  <option value="venues">Venues & Spaces</option>
                  <option value="catering">Catering & Food</option>
                  <option value="entertainment">Entertainment & Music</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Detailed Description</label>
                <textarea 
                  rows="6" 
                  defaultValue="Our premium wedding videography package includes full-day coverage, drone footage (weather permitting), and a 5-7 minute cinematic highlight film. We use state-of-the-art 4K cameras to ensure your memories are preserved in the highest quality."
                  className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Cover Photo</label>
                <div className="w-full h-48 rounded-xl border border-slate-300 overflow-hidden relative group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-slate-900 font-bold flex items-center gap-2"><Upload className="w-5 h-5"/> Replace Cover</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Starting Price (Base Rate)" leftIcon={<DollarSign className="w-4 h-4"/>} defaultValue="2500" type="number" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Pricing Model</label>
                  <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer" defaultValue="fixed">
                    <option value="fixed">Fixed Package</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="custom">Custom Quote Required</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Service Area (Locations)</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    defaultValue="Los Angeles, San Diego, Santa Barbara"
                    className="w-full bg-surface/50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Listing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-sm">
                <span className="text-green-400 font-bold flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Published
                </span>
                <p className="text-slate-600">This service is currently visible to customers in search results.</p>
              </div>
              <div className="pt-2">
                <p className="text-xs text-slate-500 flex justify-between">
                  <span>Created:</span>
                  <span className="text-slate-800">Jan 12, 2026</span>
                </p>
                <p className="text-xs text-slate-500 flex justify-between mt-1">
                  <span>Last Updated:</span>
                  <span className="text-slate-800">Oct 05, 2026</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">Permanently delete this service. This action cannot be undone and will remove it from all future search results.</p>
              <Button variant="outline" className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20" leftIcon={<Trash2 className="w-4 h-4"/>}>
                Delete Service
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
