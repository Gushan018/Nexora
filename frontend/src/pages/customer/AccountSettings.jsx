import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, Shield, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

export const AccountSettings = () => {
  const { user, setUser } = useAuth();
  
  const [firstName, ...lastNameArr] = (user?.name || ' ').split(' ');
  const defaultLastName = lastNameArr.join(' ');

  const [formFirst, setFormFirst] = useState(firstName || '');
  const [formLast, setFormLast] = useState(defaultLastName || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let profileImageUrl = user?.profileImage;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        profileImageUrl = uploadRes.data.url;
      }

      const res = await api.put('/customers/profile', {
        name: `${formFirst} ${formLast}`.trim(),
        profileImage: profileImageUrl
      });
      const updatedUser = { ...user, ...res.data.customer };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Account settings saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary mb-2">Account Settings</h1>
          <p className="text-textPrimary/60 text-lg">Manage your personal information and preferences.</p>
        </div>
        <Button 
          leftIcon={<Save className="w-4 h-4"/>} 
          className="px-6 h-12 text-base"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Avatar Card */}
        <Card className="md:col-span-1 border-white/5 bg-surface/40 hover:border-primary/30 transition-colors">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div className="w-32 h-32 rounded-full bg-gradient-premium border-4 border-surface p-1 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-4xl text-primary font-bold overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage.startsWith('blob:') ? previewImage : `http://localhost:5000${previewImage}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    firstName?.charAt(0) || 'U'
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-4 border-transparent">
                <Camera className="w-8 h-8 text-textPrimary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-textPrimary">{user?.name || 'User Name'}</h3>
              <p className="text-primary font-medium text-sm">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Customer'}</p>
            </div>
          </CardContent>
        </Card>

        {/* General Info Card */}
        <Card className="md:col-span-2 border-white/5 bg-surface/40 hover:border-primary/30 transition-colors">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              General Information
            </CardTitle>
            <CardDescription>Update your contact details and description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-textPrimary/80">First Name</label>
                <input 
                  type="text" 
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  value={formFirst} 
                  onChange={(e) => setFormFirst(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-textPrimary/80">Last Name</label>
                <input 
                  type="text" 
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  value={formLast} 
                  onChange={(e) => setFormLast(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-textPrimary/80">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-textPrimary/40" />
                <input 
                  type="email" 
                  disabled
                  className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-textPrimary/50 cursor-not-allowed focus:outline-none transition-all" 
                  value={user?.email || ''} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-textPrimary/80">Bio / Description</label>
              <textarea 
                rows="4" 
                placeholder="Tell vendors a bit about yourself..."
                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              ></textarea>
            </div>
            
          </CardContent>
        </Card>
      </div>

    </motion.div>
  );
};
