import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, CreditCard, Camera, ShieldCheck, Mail, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const ProfileManagement = () => {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['customerProfile'],
    queryFn: async () => {
      const res = await api.get('/customers/profile');
      return res.data;
    }
  });

  React.useEffect(() => {
    if (profile) {
      const parts = profile.name ? profile.name.split(' ') : [''];
      setFormData({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        phone: profile.contactNumber || ''
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put('/customers/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['customerProfile']);
      if (data.customer) {
        setUser({ ...user, name: data.customer.name });
      }
      alert('Profile updated successfully!');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Error updating profile');
    }
  });

  const handleSave = () => {
    updateMutation.mutate({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      contactNumber: formData.phone
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div className="text-slate-900">Loading profile...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-600">Manage your profile, security, and preferences.</p>
        </div>
        <Button 
          leftIcon={<Save className="w-4 h-4"/>} 
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { icon: <User className="w-4 h-4" />, label: 'Public Profile', active: true },
            { icon: <Lock className="w-4 h-4" />, label: 'Password & Security' },
            { icon: <CreditCard className="w-4 h-4" />, label: 'Payment Methods' },
            { icon: <Bell className="w-4 h-4" />, label: 'Notifications' },
          ].map((item, i) => (
            <button key={i} className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              item.active 
                ? "bg-primary/20 text-primary border border-primary/30" 
                : "text-slate-600 hover:bg-surface hover:text-slate-900 border border-transparent"
            )}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Your avatar helps vendors recognize you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-surface border-2 border-slate-300 relative overflow-hidden group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" alt="User Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-slate-900" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">Remove</Button>
                  </div>
                  <p className="text-xs text-slate-500">Must be JPEG, PNG, or GIF. Max size 2MB.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                  label="First Name" 
                  name="firstName"
                  value={formData.firstName} 
                  onChange={handleChange}
                />
                <Input 
                  label="Last Name" 
                  name="lastName"
                  value={formData.lastName} 
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-800">Bio / Notes (Optional)</label>
                <textarea 
                  rows="3" 
                  className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Tell vendors a bit about what you are planning..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{profile?.email}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-green-400" /> Email Verified
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Change Email</Button>
              </div>
              <Input 
                label="Phone Number" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
