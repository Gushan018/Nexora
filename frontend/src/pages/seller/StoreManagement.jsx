import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Image as ImageIcon, Store, MapPin, Phone, Globe, Save, Loader2, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { api } from '../../utils/api';

export const StoreManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    contactNumber: '',
    location: '',
    profileImage: '',
    // coverImage: '', // coverImage not in schema, using profileImage for now as logo
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/vendors/profile');
        const data = res.data;
        setFormData({
          businessName: data.businessName || '',
          description: data.description || '',
          contactNumber: data.contactNumber || '',
          location: data.location || '',
          profileImage: data.profileImage || '',
        });
        setLogoPreview(data.profileImage || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let profileImage = formData.profileImage;

      if (logoFile) {
        const uploadData = new FormData();
        uploadData.append('file', logoFile);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        profileImage = uploadRes.data.fileUrl;
      }

      await api.put('/vendors/profile', {
        ...formData,
        profileImage
      });

      alert('Store settings updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-textPrimary/60">Loading store settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            Store Management
          </h1>
          <p className="text-textPrimary/60">Customize your public marketplace storefront appearance and details.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            Store Management
          </h1>
          <p className="text-slate-600">Customize your public marketplace storefront appearance and details.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <Button 
          onClick={handleSave} 
          isLoading={isSaving} 
          leftIcon={!isSaving && <Save className="w-4 h-4" />}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>How customers will see your business on the marketplace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
<<<<<<< HEAD
                <div 
                  onClick={() => document.getElementById('logo-upload').click()}
                  className="w-32 h-32 rounded-2xl bg-surface border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group shrink-0 overflow-hidden relative"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-textPrimary/40 group-hover:text-primary mb-2" />
                      <span className="text-xs text-textPrimary/60 font-medium">Upload Logo</span>
                    </>
                  )}
                  <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
=======
                <div className="w-32 h-32 rounded-2xl bg-surface border-2 border-dashed border-slate-400 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group shrink-0">
                  <ImageIcon className="w-8 h-8 text-slate-500 group-hover:text-primary mb-2" />
                  <span className="text-xs text-slate-600 font-medium">Upload Logo</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <Input 
                    label="Store Name" 
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                  <Input label="Tagline (Internal Note)" placeholder="Add a short tagline if you want..." />
                </div>
              </div>

              <div className="space-y-1.5">
<<<<<<< HEAD
                <label className="text-sm font-medium text-textPrimary/90">About Us / Store Description</label>
=======
                <label className="text-sm font-medium text-slate-800">About Us / Store Description</label>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5" 
<<<<<<< HEAD
                  className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Tell customers about your business..."
=======
                  className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors"
                  defaultValue="Luxe Dining is Sri Lanka's premier provider of luxury event equipment. We specialize in supplying high-end cutlery, premium linens, and elegant tableware for weddings and corporate events."
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Location</CardTitle>
              <CardDescription>Where customers can reach you or pick up items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Public Email" type="email" value="contact@nexora.lk" disabled leftIcon={<Store className="w-5 h-5"/>} />
                <Input 
                  label="Public Phone" 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  leftIcon={<Phone className="w-5 h-5"/>} 
                />
              </div>
              <Input label="Website / Portfolio Link" placeholder="https://..." leftIcon={<Globe className="w-5 h-5"/>} />
              <Input 
                label="Store Location" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Colombo, Sri Lanka" 
                leftIcon={<MapPin className="w-5 h-5"/>} 
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
<<<<<<< HEAD
              <CardTitle>Store Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-white/10 bg-surface/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-textPrimary font-medium text-sm">Account Status</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 font-bold">ACTIVE</span>
=======
              <CardTitle>Store Cover Photo</CardTitle>
              <CardDescription>Appears at the top of your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-40 rounded-xl bg-surface border-2 border-dashed border-slate-400 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80" alt="Cover" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon className="w-8 h-8 text-slate-900 mb-2" />
                  <span className="text-sm text-slate-900 font-medium">Change Cover</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-surface/30 cursor-pointer">
                <div>
                  <h4 className="text-slate-900 font-medium text-sm">Store Visibility</h4>
                  <p className="text-xs text-slate-500">Turn on to appear in search</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                </div>
                <p className="text-xs text-textPrimary/50">Your store is currently visible to all users on Nexora.</p>
              </div>
              
              <div className="p-4 rounded-xl border border-white/10 bg-surface/30">
                <h4 className="text-textPrimary font-medium text-sm mb-1">Fulfillment Mode</h4>
                <p className="text-xs text-textPrimary/50 mb-3">Switch between active and vacation mode.</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">Vacation</Button>
                  <Button size="sm" className="flex-1 text-xs">Active</Button>
                </div>
<<<<<<< HEAD
              </div>
=======
              </label>
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-surface/30 cursor-pointer">
                <div>
                  <h4 className="text-slate-900 font-medium text-sm">Accepting New Orders</h4>
                  <p className="text-xs text-slate-500">Allow customers to buy</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </label>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
