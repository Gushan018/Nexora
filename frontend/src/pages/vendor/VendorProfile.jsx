import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Camera, Edit2, MapPin, Phone, Mail, Star, Users, Briefcase, Eye, Loader2, AlertCircle, Check, X, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { cn } from '../../utils/cn';
import { api, resolveAssetUrl } from '../../utils/api';

export const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);

  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    contactNumber: '',
    location: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors/profile');
      const data = response.data;
      setVendor(data);
      setFormData({
        businessName: data.businessName || '',
        description: data.description || '',
        contactNumber: data.contactNumber || '',
        location: data.location || ''
      });
      setPreviewImage(data.profileImage || data.logoImage || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80');
      setPreviewCover(data.coverImage || data.bannerImage || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80');
      setError(null);
    } catch (err) {
      setError('Failed to load profile data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type = 'avatar') => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') {
          setProfileImage(file);
          setPreviewImage(reader.result);
        } else {
          setCoverImage(file);
          setPreviewCover(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const response = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url || response.data.imageUrl || response.data.fileUrl;
    } catch (err) {
      console.error('Image upload failed', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess('');

    try {
      let imageUrl = vendor?.profileImage || vendor?.logoImage;
      if (profileImage) {
        const uploadedUrl = await uploadImage(profileImage);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      let coverUrl = vendor?.coverImage || vendor?.bannerImage;
      if (coverImage) {
        const uploadedCover = await uploadImage(coverImage);
        if (uploadedCover) coverUrl = uploadedCover;
      }

      const res = await api.put('/vendors/profile', {
        ...formData,
        profileImage: imageUrl,
        coverImage: coverUrl,
        logoImage: imageUrl,
        bannerImage: coverUrl,
      });

      const updated = res.data;
      setVendor(updated);
      const newLogo = updated.profileImage || updated.logoImage || imageUrl;
      const newBanner = updated.coverImage || updated.bannerImage || coverUrl;
      setPreviewImage(newLogo);
      setPreviewCover(newBanner);
      setProfileImage(null);
      setCoverImage(null);

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 text-slate-100">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Store className="w-7 h-7 text-primary" />
            Vendor Profile
          </h1>
          <p className="text-gray-600 dark:text-white/60">Manage how customers see your business on Event Nest.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreviewModalOpen(true)} leftIcon={<Eye className="w-4 h-4"/>}>
            Preview Public Profile
          </Button>
          <Button onClick={handleSubmit} disabled={saving} leftIcon={saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Edit2 className="w-4 h-4"/>}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Cover & Avatar Section */}
      <Card className="overflow-hidden border-none shadow-2xl relative bg-transparent">
        {/* Cover Photo */}
        <div className="h-64 w-full relative group cursor-pointer bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
          <img 
            src={resolveAssetUrl(previewCover)} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity"
          />
          <label className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-slate-950/60 backdrop-blur-xs">
            <Camera className="w-8 h-8 text-white mb-2" />
            <span className="text-sm font-bold text-white">Change Cover Photo</span>
            <span className="text-xs text-slate-300">Click to upload banner</span>
            <input type="file" onChange={(e) => handleImageChange(e, 'cover')} accept="image/*" className="hidden" />
          </label>
        </div>

        {/* Avatar */}
        <div className="absolute left-8 bottom-[-40px] flex items-end gap-6 z-10">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-2xl bg-slate-900 border-4 border-slate-950 flex items-center justify-center overflow-hidden shadow-2xl">
              <img 
                src={resolveAssetUrl(previewImage)} 
                alt="Logo" 
                className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
              />
            </div>
            <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-slate-950/60 rounded-2xl">
              <Camera className="w-7 h-7 text-white" />
              <input type="file" onChange={(e) => handleImageChange(e, 'avatar')} accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
      </Card>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-4">
                  <Input 
                    label="Business Name" 
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
                  <Input 
                    label="Location" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Colombo, Sri Lanka"
                    leftIcon={<MapPin className="w-4 h-4"/>}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80">About the Business</label>
                  <textarea 
                    rows="6" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detail your experience, services offered, equipment, and company background..."
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Public Phone" 
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+94 XX XXX XXXX"
                  />
                  <Input 
                    label="Email (Read-only)" 
                    value={vendor?.email || ''}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Sidebar Status & Badges */}
        <div className="space-y-6">
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/20 text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Top Rated Vendor</h3>
                  <p className="text-xs text-gray-600 dark:text-white/60">Maintained 4.8+ rating for active operations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
            <CardHeader>
              <CardTitle>Profile Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-white/5 text-sm">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-white/60">
                    <Briefcase className="w-4 h-4 text-primary" /> <span>Active Type</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white uppercase">{vendor?.vendorType || 'Vendor'}</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-white/60">
                    <Star className="w-4 h-4 text-amber-400" /> <span>Average Rating</span>
                  </div>
                  <span className="font-bold text-amber-400">5.0 / 5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
            <CardHeader>
              <CardTitle>Service Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs font-bold text-primary uppercase">
                  {vendor?.vendorType || 'Event Management'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-white/50 mt-4">Derived from your registered vendor category.</p>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Public Profile Live Preview Modal */}
      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title="Public Customer Profile Preview">
        <div className="space-y-6 pt-2 text-gray-900 dark:text-white">
          <div className="relative rounded-2xl overflow-hidden h-48 border border-gray-200 dark:border-white/10">
            <img src={resolveAssetUrl(previewCover)} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-6 gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary shrink-0 bg-slate-900">
                <img src={resolveAssetUrl(previewImage)} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{formData.businessName || 'Your Business Name'}</h2>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {formData.location || 'Colombo, Sri Lanka'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl space-y-2 border border-gray-200 dark:border-white/10">
            <h4 className="text-xs font-bold uppercase text-primary tracking-wider">About Business</h4>
            <p className="text-sm text-gray-700 dark:text-white/80 whitespace-pre-line">
              {formData.description || 'No description provided yet.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-[11px] text-gray-500 dark:text-white/50">Contact Number</p>
                <p className="text-xs font-bold">{formData.contactNumber || 'Not provided'}</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-[11px] text-gray-500 dark:text-white/50">Public Email</p>
                <p className="text-xs font-bold">{vendor?.email || 'email@example.com'}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-white/10">
            <Button onClick={() => setIsPreviewModalOpen(false)}>Close Preview</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
