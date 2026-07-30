import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, Shield, Camera, Lock, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../utils/cn';
import { api, resolveAssetUrl } from '../../utils/api';

export const AccountSettings = () => {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  
  const [firstName, ...lastNameArr] = (user?.name || ' ').split(' ');
  const defaultLastName = lastNameArr.join(' ');

  const [formFirst, setFormFirst] = useState(firstName || '');
  const [formLast, setFormLast] = useState(defaultLastName || '');
  const [formBio, setFormBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null);
  const fileInputRef = useRef(null);

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const getProfilePath = () => {
    const role = (user?.role || '').toLowerCase();
    if (role === 'admin') return '/admin/profile';
    if (role === 'vendor' || role === 'seller' || role === 'service_provider' || role === 'company' || role === 'emc') {
      return '/vendors/profile';
    }
    return '/customers/profile';
  };

  const profilePath = getProfilePath();

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(profilePath);
        if (res.data) {
          const profile = res.data;
          if (profile.bio !== undefined) setFormBio(profile.bio || '');
          const profileName = profile.name || profile.businessName || user?.name || '';
          if (profileName) {
            const [first, ...rest] = profileName.split(' ');
            setFormFirst(first || '');
            setFormLast(rest.join(' ') || '');
          }
          if (profile.profileImage || profile.logoImage) {
            setPreviewImage(profile.profileImage || profile.logoImage);
          }
        }
      } catch (e) {
        console.error('Error fetching profile:', e);
      }
    };
    fetchProfile();
  }, [profilePath, user]);

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
      let profileImageUrl = user?.profileImage || previewImage;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        profileImageUrl = uploadRes.data.url;
      }

      const payload = {
        name: `${formFirst} ${formLast}`.trim(),
        businessName: `${formFirst} ${formLast}`.trim(),
        profileImage: profileImageUrl,
        logoImage: profileImageUrl,
        bio: formBio
      };

      const res = await api.put(profilePath, payload);

      const updatedProfile = res.data.customer || res.data.vendor || res.data.admin || res.data || {};
      const updatedUser = {
        ...user,
        name: `${formFirst} ${formLast}`.trim(),
        profileImage: profileImageUrl,
        ...updatedProfile,
        bio: formBio
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast('Account settings saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save settings:', err);
      showToast(err.response?.data?.message || 'Failed to save settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'warning');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      showToast(res.data?.message || 'Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password. Please check your current password.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getPasswordStrength = () => {
    if (!newPassword) return null;
    if (newPassword.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    if (newPassword.length < 10) return { label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h1>
          <p className="text-gray-600 dark:text-white/70 text-lg">Manage your personal information, security options, and preferences.</p>
        </div>
        <Button 
          leftIcon={<Save className="w-4 h-4"/>} 
          className="px-6 h-12 text-base"
          onClick={handleSave}
          disabled={isSaving || !formFirst.trim() || !formLast.trim()}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Avatar Card */}
        <Card className="md:col-span-1 border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface hover:border-primary/30 transition-colors">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div className="w-32 h-32 rounded-full bg-gradient-premium border-4 border-light-surface dark:border-surface p-1 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <div className="w-full h-full rounded-full bg-light-surface dark:bg-surface flex items-center justify-center text-4xl text-primary font-bold overflow-hidden">
                  {previewImage ? (
                    <img 
                      src={resolveAssetUrl(previewImage)} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    firstName?.charAt(0) || 'U'
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-4 border-transparent">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'User Name'}</h3>
              <p className="text-primary font-medium text-sm">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Customer'}</p>
            </div>
          </CardContent>
        </Card>

        {/* General Info Card */}
        <Card className="md:col-span-2 border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface hover:border-primary/30 transition-colors">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="w-5 h-5 text-primary" />
              General Information
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-white/60">Update your contact details and profile bio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">First Name</label>
                <input 
                  type="text" 
                  className="w-full bg-light-surface dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  value={formFirst} 
                  onChange={(e) => setFormFirst(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Last Name</label>
                <input 
                  type="text" 
                  className="w-full bg-light-surface dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  value={formLast} 
                  onChange={(e) => setFormLast(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40" />
                <input 
                  type="email" 
                  disabled
                  className="w-full bg-gray-100 dark:bg-slate-900/60 border border-gray-300 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-gray-600 dark:text-white/70 cursor-not-allowed focus:outline-none transition-all" 
                  value={user?.email || ''} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Bio / Description</label>
              <textarea 
                rows="3" 
                value={formBio}
                onChange={(e) => setFormBio(e.target.value)}
                placeholder="Tell vendors a bit about yourself..."
                className="w-full bg-light-surface dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              ></textarea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Password Change Card */}
      <Card className="border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface hover:border-primary/30 transition-colors mt-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
            <KeyRound className="w-5 h-5 text-amber-500" />
            Security & Password Change
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-white/60">Update your account password to ensure maximum account security.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Current Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-light-surface dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl pl-10 pr-10 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">New Password</label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-light-surface dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl pl-10 pr-10 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-light-surface dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl pl-10 pr-10 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {strength && (
              <div className="space-y-1 max-w-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-slate-400">Password Strength:</span>
                  <span className="font-semibold text-gray-700 dark:text-white">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 h-11"
              >
                {isChangingPassword ? 'Updating Password...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Theme Preferences Card */}
      <Card className="border-gray-200 dark:border-white/10 bg-light-surface dark:bg-surface hover:border-primary/30 transition-colors mt-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
            <Shield className="w-5 h-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-white/60">Customize how Nexora looks for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={cn(
                "flex-1 p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-4",
                theme === 'light' ? "border-primary bg-primary/5 text-primary" : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                <div className="w-6 h-6 bg-yellow-400 rounded-full" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Light Mode</span>
            </button>
            <button
              onClick={toggleTheme}
              className={cn(
                "flex-1 p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-4",
                theme === 'dark' ? "border-primary bg-primary/5 text-primary" : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-4 h-4 bg-transparent rounded-full shadow-[inset_4px_-4px_0_0_#cbd5e1]" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Dark Mode</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
