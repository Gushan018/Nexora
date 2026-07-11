import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Lock, User, Mail, Shield, Loader2, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { api } from '../../utils/api';

export const SellerSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    contactNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/vendors/profile');
        const data = res.data;
        setFormData({
          businessName: data.businessName || user?.name || '',
          email: data.email || user?.email || '',
          contactNumber: data.contactNumber || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (err) {
        console.error('Error fetching settings:', err);
        setFormData(prev => ({
          ...prev,
          businessName: user?.name || '',
          email: user?.email || ''
        }));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          setIsSaving(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setError('New password must be at least 6 characters');
          setIsSaving(false);
          return;
        }
      }

      await api.put('/vendors/profile', {
        businessName: formData.businessName,
        contactNumber: formData.contactNumber,
        ...(formData.newPassword ? { password: formData.newPassword } : {})
      });

      setSuccessMessage('Account preferences saved successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-600 dark:text-slate-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-7 h-7 text-primary" />
          Seller Account Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Manage security preferences and personal account details.</p>
      </div>

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

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 flex items-center gap-2 text-sm font-medium"
        >
          <AlertTriangle className="w-5 h-5" />
          {error}
        </motion.div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Account & Business Identity</CardTitle>
          <CardDescription>Update your public account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input 
              label="Business / Store Name" 
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              leftIcon={<User className="w-5 h-5" />}
              required
            />
            <Input 
              label="Email Address" 
              type="email" 
              name="email"
              value={formData.email}
              disabled
              leftIcon={<Mail className="w-5 h-5" />}
            />
          </div>
          <Input 
            label="Contact Number" 
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="077-123-4567"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security & Password</CardTitle>
          <CardDescription>Update your login password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input 
              label="New Password" 
              type="password" 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              leftIcon={<Lock className="w-5 h-5" />}
            />
            <Input 
              label="Confirm New Password" 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              leftIcon={<Lock className="w-5 h-5" />}
            />
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t border-slate-200 dark:border-white/10">
            <Button type="submit" isLoading={isSaving} leftIcon={!isSaving && <Save className="w-4 h-4"/>}>
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
