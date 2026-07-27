import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Image as ImageIcon, Store, MapPin, Phone, Globe, Save, Loader2, Upload, X, Check, AlertTriangle, Building, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { api, getImageUrl } from '../../utils/api';

export const StoreManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    description: '',
    contactNumber: '',
    location: '',
    address: '',
    website: '',
    logoImage: '',
    bannerImage: ''
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError('');
        const res = await api.get('/vendors/profile');
        const data = res.data;

        setFormData({
          businessName: data.businessName || '',
          email: data.email || '',
          description: data.description || '',
          contactNumber: data.contactNumber || '',
          location: data.location || '',
          address: data.address || '',
          website: data.website || '',
          logoImage: data.logoImage || '',
          bannerImage: data.bannerImage || ''
        });

        if (data.logoImage) {
          setLogoPreview(getImageUrl(data.logoImage));
        }
        if (data.bannerImage) {
          setBannerPreview(getImageUrl(data.bannerImage));
        }
      } catch (err) {
        console.error('Error fetching store profile:', err);
        setError(err.response?.data?.message || 'Failed to load store settings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo image must be less than 5MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Banner image must be less than 5MB');
        return;
      }
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      let logoImage = formData.logoImage;
      let bannerImage = formData.bannerImage;

      // Upload Logo if new file selected
      if (logoFile) {
        const logoData = new FormData();
        logoData.append('file', logoFile);
        const logoRes = await api.post('/upload', logoData);
        logoImage = logoRes.data.imageUrl || logoRes.data.fileUrl || logoRes.data.url;
      }

      // Upload Banner if new file selected
      if (bannerFile) {
        const bannerData = new FormData();
        bannerData.append('file', bannerFile);
        const bannerRes = await api.post('/upload', bannerData);
        bannerImage = bannerRes.data.imageUrl || bannerRes.data.fileUrl || bannerRes.data.url;
      }

      const payload = {
        ...formData,
        logoImage,
        bannerImage
      };

      await api.put('/vendors/profile', payload);

      setFormData(prev => ({ ...prev, logoImage, bannerImage }));
      if (logoImage) setLogoPreview(getImageUrl(logoImage));
      if (bannerImage) setBannerPreview(getImageUrl(bannerImage));
      setLogoFile(null);
      setBannerFile(null);
      setSuccessMessage('Store details updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error updating store profile:', err);
      setError(err.response?.data?.message || 'Failed to update store profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-600 dark:text-slate-400">Loading store settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            Store Management
          </h1>
          <p className="text-gray-600 dark:text-white/70">Customize your public marketplace storefront appearance and details.</p>
        </div>
        <Button 
          type="submit" 
          isLoading={isSaving} 
          leftIcon={!isSaving && <Save className="w-4 h-4" />}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Success Message Banner */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-600 dark:text-green-400 flex items-center gap-2 text-sm font-medium"
        >
          <Check className="w-5 h-5" />
          {successMessage}
        </motion.div>
      )}

      {/* Error Message Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 flex items-center justify-between text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
          <button type="button" onClick={() => setError('')}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Brand Identity</CardTitle>
              <CardDescription className="text-gray-600 dark:text-white/60">How customers will identify your business on the EventNest marketplace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div
                  className="w-32 h-32 rounded-2xl bg-surface border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group shrink-0 overflow-hidden relative"
                  onClick={() => document.getElementById('store-logo-file').click()}
                >
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-semibold">Change Logo</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 dark:text-white/40 group-hover:text-primary mb-1 transition-colors" />
                      <span className="text-xs text-gray-600 dark:text-white/60 font-medium">Upload Logo</span>
                    </>
                  )}
                  <input
                    id="store-logo-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <Input 
                    label="Store Name *" 
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    leftIcon={<Building className="w-5 h-5" />}
                    required
                  />
                  <Input 
                    label="Public Email" 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleChange}
                    leftIcon={<Mail className="w-5 h-5" />} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-white/70 block">Or enter Logo Image URL directly:</label>
                <input
                  type="text"
                  name="logoImage"
                  value={formData.logoImage}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) setLogoPreview(e.target.value);
                  }}
                  placeholder="https://example.com/logo.jpg"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900 dark:text-white">About Us / Store Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5" 
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-gray-400 dark:placeholder:text-white/40 text-sm"
                  placeholder="Describe your products, specialty, and services offered..."
                />
              </div>

            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Contact & Location</CardTitle>
              <CardDescription className="text-gray-600 dark:text-white/60">Contact numbers and physical location for customer pick-ups.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                  label="Public Contact Phone" 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="077-123-4567"
                  leftIcon={<Phone className="w-5 h-5"/>} 
                />
                <Input 
                  label="Website / Portfolio Link" 
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..." 
                  leftIcon={<Globe className="w-5 h-5"/>} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Sri Lankan Town / District</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer text-sm"
                >
                  <option value="" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Select Location...</option>
                  {['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Kurunegala', 'Matara', 'Nuwara Eliya', 'Batticaloa', 'Trincomalee', 'Gampaha', 'Kalutara', 'Ratnapura', 'Badulla', 'Anuradhapura', 'Hambantota'].map(city => (
                    <option key={city} value={city} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
                      {city}, Sri Lanka
                    </option>
                  ))}
                </select>
              </div>

              <Input 
                label="Street Address" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 45 Galle Road, Colombo 03" 
                leftIcon={<MapPin className="w-5 h-5"/>} 
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Store Cover Photo</CardTitle>
              <CardDescription className="text-gray-600 dark:text-white/60">Appears at the top of your public profile storefront.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div 
                className="w-full h-44 rounded-xl bg-surface border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group overflow-hidden relative"
                onClick={() => document.getElementById('store-banner-file').click()}
              >
                {bannerPreview ? (
                  <>
                    <img src={bannerPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                      <Upload className="w-7 h-7 mb-1" />
                      <span className="text-xs font-semibold">Change Cover Photo</span>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-gray-400 dark:text-white/40 group-hover:text-primary mb-2 transition-colors" />
                    <span className="text-xs text-gray-600 dark:text-white/60 font-medium">Click to upload banner</span>
                  </>
                )}
                <input
                  id="store-banner-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleBannerChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-white/70 block">Or enter Banner Image URL:</label>
                <input
                  type="text"
                  name="bannerImage"
                  value={formData.bannerImage}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) setBannerPreview(e.target.value);
                  }}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-surface">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Store Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5">
                <div className="flex items-center gap-2 mb-1 text-green-600 dark:text-green-400 font-bold text-sm">
                  <Check className="w-4 h-4" /> Store Published
                </div>
                <p className="text-xs text-gray-600 dark:text-white/70">Your storefront is verified and active on the EventNest Sri Lanka marketplace.</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </form>
  );
};
