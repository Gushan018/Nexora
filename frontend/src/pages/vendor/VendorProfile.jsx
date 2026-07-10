import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Camera, Edit2, MapPin, Globe, Star, Users, Briefcase, Eye, Loader2, AlertCircle, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

export const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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
      setPreviewImage(data.profileImage);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
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
      return response.data.imageUrl || response.data.url;
    } catch (err) {
      console.error('Image upload failed', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess('');

    try {
      let imageUrl = vendor.profileImage;
      if (profileImage) {
        imageUrl = await uploadImage(profileImage);
      }

      await api.put('/vendors/profile', {
        ...formData,
        profileImage: imageUrl
      });

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
      <div className="h-[60vh] flex flex-col items-center justify-center text-textPrimary/40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            Vendor Profile
          </h1>
          <p className="text-slate-600">Manage how customers see your business on Event Nest.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Eye className="w-4 h-4"/>}>Preview Public Profile</Button>
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
        <div className="h-64 w-full relative group cursor-pointer bg-surface">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-slate-900 mb-2" />
            <span className="text-sm font-bold text-slate-900">Change Cover Photo</span>
            <span className="text-xs text-slate-600">Recommended: 1200x400px</span>
          </div>
        </div>

        {/* Avatar */}
        <div className="absolute left-8 bottom-[-40px] flex items-end gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-2xl bg-surface border-4 border-background flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80" 
                alt="Logo" 
                className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-slate-900" />
            </div>
            <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-textPrimary" />
              <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
      </Card>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
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
                <label className="text-sm font-medium text-slate-800">About the Business</label>
                <textarea 
                  rows="6" 
                  className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  defaultValue="Lumiere Photography is a premium wedding and event photography studio based in California. With over 10 years of experience, our team specializes in candid, documentary-style captures blended with stunning editorial portraits. We believe every event has a unique story, and our goal is to preserve those memories in the most authentic way possible."
                />
              </div>

              </CardContent>
            </Card>

            <Card>
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
                    value={vendor.email}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Sidebar Status & Badges */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-green-500/20 text-green-500">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Top Rated Vendor</h3>
                  <p className="text-xs text-slate-600">Maintained 4.8+ rating for 6 months</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Users className="w-4 h-4" /> <span className="text-sm">Profile Views (30d)</span>
                  </div>
                  <span className="font-bold text-slate-900">1,245</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Briefcase className="w-4 h-4" /> <span className="text-sm">Total Bookings</span>
                  </div>
                  <span className="font-bold text-slate-900">84</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Star className="w-4 h-4" /> <span className="text-sm">Average Rating</span>
                  </div>
                  <span className="font-bold text-yellow-400">4.9 / 5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-surface border border-slate-300 rounded-full text-xs text-slate-900">Photography</span>
                <span className="px-3 py-1 bg-surface border border-slate-300 rounded-full text-xs text-slate-900">Videography</span>
                <span className="px-3 py-1 bg-surface border border-slate-300 rounded-full text-xs text-slate-900">Drone Coverage</span>
              </div>
              <p className="text-xs text-slate-500 mt-4 italic">Categories are derived from your active service listings.</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
