import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, CreditCard, Users, Save, Loader2, CheckCircle, AlertCircle, Building, MapPin, Phone, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Kurunegala', 
  'Matara', 'Nuwara Eliya', 'Batticaloa', 'Trincomalee', 'Gampaha', 
  'Kalutara', 'Ratnapura', 'Badulla', 'Anuradhapura', 'Hambantota'
];

const SRI_LANKA_BANKS = [
  'Commercial Bank of Ceylon', 'Sampath Bank', 'Hatton National Bank (HNB)', 
  'Bank of Ceylon (BOC)', "People's Bank", 'Seylan Bank', 'Nations Trust Bank (NTB)', 
  'DFCC Bank', 'National Development Bank (NDB)'
];

export const VendorSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('general');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const [profile, setProfile] = useState({
    businessName: '',
    contactNumber: '',
    location: 'Colombo',
    address: '',
    description: '',
    currency: 'LKR (Rs.)',
    timezone: 'Asia/Colombo (IST - UTC+5:30)',
    bookingLeadTime: '48h',
    instantBook: false,
    requireDeposits: true,
    cancellationPolicy: 'Moderate',
    bankName: 'Commercial Bank of Ceylon',
    accountHolder: '',
    accountNumber: '',
    branchName: 'Colombo Main Branch',
    emailNotifications: true,
    smsNotifications: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors/profile');
      const vendor = response.data || {};
      
      setProfile({
        businessName: vendor.businessName || '',
        contactNumber: vendor.contactNumber || '',
        location: vendor.location || 'Colombo',
        address: vendor.address || '',
        description: vendor.description || '',
        currency: 'LKR (Rs.)',
        timezone: 'Asia/Colombo (IST - UTC+5:30)',
        bookingLeadTime: vendor.bookingLeadTime || '48h',
        instantBook: vendor.instantBook || false,
        requireDeposits: vendor.requireDeposits !== false,
        cancellationPolicy: vendor.cancellationPolicy || 'Moderate',
        bankName: vendor.bankName || 'Commercial Bank of Ceylon',
        accountHolder: vendor.accountHolder || vendor.businessName || '',
        accountNumber: vendor.accountNumber || '',
        branchName: vendor.branchName || 'Colombo Fort',
        emailNotifications: vendor.emailNotifications !== false,
        smsNotifications: vendor.smsNotifications !== false,
      });
    } catch (error) {
      console.error('Error fetching vendor settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      await api.put('/vendors/profile', profile);
      
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'All password fields are required.' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      setPasswordSaving(true);
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-slate-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary" />
            Vendor Settings
          </h1>
          <p className="text-slate-600">Configure your business profile, Sri Lankan locations, and security preferences.</p>
        </div>
        <Button 
          onClick={handleSaveProfile} 
          disabled={saving}
          leftIcon={saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-xl flex items-center gap-3 border",
            message.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-red-500/10 border-red-500/20 text-red-600"
          )}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { id: 'general', label: 'General & Location', icon: Settings },
            { id: 'billing', label: 'Bank & Payouts (LKR)', icon: CreditCard },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Password', icon: Shield },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === 'general' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Business Profile & Location</CardTitle>
                  <CardDescription>Your business identity and primary Sri Lankan operation zone.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input 
                    label="Business Name"
                    leftIcon={<Building className="w-4 h-4" />}
                    value={profile.businessName}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      label="Contact Number (+94)"
                      leftIcon={<Phone className="w-4 h-4" />}
                      placeholder="+94 77 123 4567"
                      value={profile.contactNumber}
                      onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                    />
                    <div className="flex flex-col space-y-1.5 w-full">
                      <label className="text-sm font-medium text-gray-700 dark:text-white/90">Primary District / Location</label>
                      <select
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="flex w-full rounded-xl border border-gray-300 dark:border-white/10 bg-light-surface dark:bg-surface/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                      >
                        {SRI_LANKA_DISTRICTS.map((town) => (
                          <option key={town} value={town} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>{town}, Sri Lanka</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Input 
                    label="Street Address"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    placeholder="No. 45, Galle Road, Colombo 03"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label className="text-sm font-medium text-gray-700 dark:text-white/90">Business Description</label>
                    <textarea
                      rows="3"
                      value={profile.description}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                      className="flex w-full rounded-xl border border-gray-300 dark:border-white/10 bg-light-surface dark:bg-surface/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operating Preferences</CardTitle>
                  <CardDescription>Rules and minimum lead times for clients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5 w-full">
                      <label className="text-sm font-medium text-gray-700 dark:text-white/90">Default Currency</label>
                      <input 
                        type="text" 
                        disabled 
                        value="LKR (Rs. Sri Lankan Rupee)" 
                        className="flex w-full rounded-xl border border-gray-300 dark:border-white/10 bg-light-surface dark:bg-surface/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white/80 font-semibold cursor-not-allowed opacity-80"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5 w-full">
                      <label className="text-sm font-medium text-gray-700 dark:text-white/90">Timezone</label>
                      <input 
                        type="text" 
                        disabled 
                        value="Asia/Colombo (IST - UTC+5:30)" 
                        className="flex w-full rounded-xl border border-gray-300 dark:border-white/10 bg-light-surface dark:bg-surface/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white/80 font-semibold cursor-not-allowed opacity-80"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-300 dark:border-white/10 bg-light-surface dark:bg-surface/30 cursor-pointer">
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-medium text-sm">Require Upfront Deposit</h4>
                      <p className="text-xs text-gray-500 dark:text-white/60">Require customers to pay a deposit in LKR to lock in their date.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={profile.requireDeposits}
                      onChange={(e) => setProfile({ ...profile, requireDeposits: e.target.checked })}
                      className="w-5 h-5 accent-primary cursor-pointer"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Bank Account & Direct Payouts (LKR)</CardTitle>
                <CardDescription>Bank account info for receiving direct earnings in Sri Lankan Rupees.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-1.5 w-full">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/90">Bank Name</label>
                  <select
                    value={profile.bankName}
                    onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                    className="flex w-full rounded-xl border border-gray-300 dark:border-white/10 bg-light-surface dark:bg-surface/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  >
                    {SRI_LANKA_BANKS.map((b) => (
                      <option key={b} value={b} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>{b}</option>
                    ))}
                  </select>
                </div>
                <Input 
                  label="Account Holder Name"
                  placeholder="e.g. A.B.C. Perera"
                  value={profile.accountHolder}
                  onChange={(e) => setProfile({ ...profile, accountHolder: e.target.value })}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Account Number"
                    placeholder="8001234567"
                    value={profile.accountNumber}
                    onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                  />
                  <Input 
                    label="Branch Name"
                    placeholder="Colombo Main / Kandy City"
                    value={profile.branchName}
                    onChange={(e) => setProfile({ ...profile, branchName: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how you receive new booking alerts and payment releases.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="text-slate-900 font-medium text-sm">Email Alerts</h4>
                    <p className="text-xs text-slate-500">Receive emails for new client bookings and payments.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={profile.emailNotifications}
                    onChange={(e) => setProfile({ ...profile, emailNotifications: e.target.checked })}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="text-slate-900 font-medium text-sm">SMS Alerts (+94)</h4>
                    <p className="text-xs text-slate-500">Receive SMS notifications on your Sri Lankan mobile number.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={profile.smsNotifications}
                    onChange={(e) => setProfile({ ...profile, smsNotifications: e.target.checked })}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security & Password</CardTitle>
                <CardDescription>Update your vendor account password.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {passwordMessage.text && (
                    <div className={cn(
                      "p-3 rounded-xl text-xs font-medium border",
                      passwordMessage.type === 'success' ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
                    )}>
                      {passwordMessage.text}
                    </div>
                  )}
                  <Input 
                    label="Current Password"
                    type="password"
                    leftIcon={<Lock className="w-4 h-4" />}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                  <Input 
                    label="New Password"
                    type="password"
                    leftIcon={<Lock className="w-4 h-4" />}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                  <Input 
                    label="Confirm New Password"
                    type="password"
                    leftIcon={<Lock className="w-4 h-4" />}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                  <Button type="submit" disabled={passwordSaving} className="mt-2">
                    {passwordSaving ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};


