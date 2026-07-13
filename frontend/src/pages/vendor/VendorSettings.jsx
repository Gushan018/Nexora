import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, CreditCard, Users, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

export const VendorSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('general');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const [settings, setSettings] = useState({
    currency: 'LKR',
    timezone: 'UTC',
    bookingLeadTime: '48h',
    instantBook: false,
    requireDeposits: false,
    cancellationPolicy: 'Moderate'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors/profile');
      const vendor = response.data;
      
      setSettings({
        currency: vendor.currency || 'LKR',
        timezone: vendor.timezone || 'UTC',
        bookingLeadTime: vendor.bookingLeadTime || '48h',
        instantBook: vendor.instantBook || false,
        requireDeposits: vendor.requireDeposits || false,
        cancellationPolicy: vendor.cancellationPolicy || 'Moderate'
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      await api.put('/vendors/profile', settings);
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleChangePassword = async () => {
    setPasswordMessage({ type: '', text: '' });

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setPasswordSaving(true);
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
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
        <p className="text-textPrimary/60">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary" />
            Vendor Settings
          </h1>
          <p className="text-textPrimary/60">Configure your operational preferences and account security.</p>
        </div>
        <Button 
          onClick={handleSave} 
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
            message.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          )}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6">
        
        {/* Settings Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Login', icon: Shield },
            { id: 'billing', label: 'Billing & Taxes', icon: CreditCard },
            { id: 'team', label: 'Team Access', icon: Users },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-textPrimary/60 hover:text-textPrimary hover:bg-white/5 border border-transparent"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Settings Content */}
        <div className="md:col-span-3 space-y-6">
          
          {activeTab === 'general' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Business Preferences</CardTitle>
                  <CardDescription>Global rules for how you operate on Nexora.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-textPrimary/90">Default Currency</label>
                      <select 
                        value={settings.currency}
                        onChange={(e) => updateSetting('currency', e.target.value)}
                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                      >
                        <option value="LKR">LKR (Rs)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-textPrimary/90">Timezone</label>
                      <select 
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                      >
                        <option value="UTC">UTC</option>
                        <option value="Asia/Colombo">Asia/Colombo (IST)</option>
                        <option value="PST">Pacific Time (PT)</option>
                        <option value="EST">Eastern Time (ET)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-textPrimary/90">Booking Lead Time</label>
                    <select 
                      value={settings.bookingLeadTime}
                      onChange={(e) => updateSetting('bookingLeadTime', e.target.value)}
                      className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                    >
                      <option value="48h">Minimum 48 hours notice</option>
                      <option value="1w">Minimum 1 week notice</option>
                      <option value="1m">Minimum 1 month notice</option>
                    </select>
                    <p className="text-xs text-textPrimary/40">Prevents last-minute bookings from customers.</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-surface/30 cursor-pointer transition-colors hover:bg-surface/40">
                      <div>
                        <h4 className="text-textPrimary font-medium text-sm">Instant Book</h4>
                        <p className="text-xs text-textPrimary/50">Automatically approve bookings if your calendar is free.</p>
                      </div>
                      <button 
                        onClick={() => updateSetting('instantBook', !settings.instantBook)}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none",
                          settings.instantBook ? "bg-primary" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ease-in-out",
                          settings.instantBook ? "right-0.5" : "left-0.5"
                        )} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-surface/30 cursor-pointer transition-colors hover:bg-surface/40">
                      <div>
                        <h4 className="text-textPrimary font-medium text-sm">Require Deposits</h4>
                        <p className="text-xs text-textPrimary/50">Force customers to pay 20% upfront to confirm a date.</p>
                      </div>
                      <button 
                        onClick={() => updateSetting('requireDeposits', !settings.requireDeposits)}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none",
                          settings.requireDeposits ? "bg-primary" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ease-in-out",
                          settings.requireDeposits ? "right-0.5" : "left-0.5"
                        )} />
                      </button>
                    </label>
                  </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cancellation Policy</CardTitle>
                  <CardDescription>Set the terms for when a customer cancels an event.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: 'Flexible', desc: 'Full refund up to 7 days before.' },
                      { title: 'Moderate', desc: 'Full refund up to 30 days before.' },
                      { title: 'Strict', desc: 'Non-refundable deposit.' },
                    ].map((policy) => (
                      <div 
                        key={policy.title} 
                        onClick={() => updateSetting('cancellationPolicy', policy.title)}
                        className={cn(
                          "p-4 rounded-xl border cursor-pointer transition-all",
                          settings.cancellationPolicy === policy.title 
                            ? "border-primary bg-primary/10" 
                            : "border-white/10 bg-surface/30 hover:border-white/30"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={cn("font-bold text-sm", settings.cancellationPolicy === policy.title ? "text-primary" : "text-textPrimary")}>{policy.title}</h4>
                          {settings.cancellationPolicy === policy.title && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                        <p className="text-xs text-textPrimary/60 leading-relaxed">{policy.desc}</p>
                      </div>
                    ))}
                  </div>

                </CardContent>
              </Card>

              <Card className="border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-textPrimary/60">If you want to temporarily hide your business or permanently delete your account, you can do so here.</p>
                  <div className="flex gap-4">
                    <Button variant="outline">Pause Account</Button>
                    <Button variant="outline" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20">Deactivate Business</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your email and in-app notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-textPrimary/60 text-sm">Notification preferences are coming soon. You'll be able to configure email alerts for new bookings, cancellations, and messages.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password. You'll need to enter your current password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                  {passwordMessage.text && (
                    <div className={cn(
                      "p-3 rounded-xl flex items-center gap-2 text-sm border",
                      passwordMessage.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                    )}>
                      {passwordMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {passwordMessage.text}
                    </div>
                  )}
                  <Button
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                    leftIcon={passwordSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Shield className="w-4 h-4"/>}
                  >
                    {passwordSaving ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Taxes</CardTitle>
                <CardDescription>Manage your bank account details and tax information for payouts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Bank Name"
                  placeholder="e.g. Bank of Ceylon"
                  value={settings.bankName || ''}
                  onChange={(e) => updateSetting('bankName', e.target.value)}
                />
                <Input
                  label="Bank Account Number"
                  placeholder="e.g. 1234567890"
                  value={settings.bankAccountNo || ''}
                  onChange={(e) => updateSetting('bankAccountNo', e.target.value)}
                />
                <Input
                  label="Tax ID / VAT Number"
                  placeholder="e.g. TAX-123456"
                  value={settings.taxId || ''}
                  onChange={(e) => updateSetting('taxId', e.target.value)}
                />
                <p className="text-xs text-textPrimary/40">Your bank details are used for monthly payouts. Tax ID is required for invoicing.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Access</CardTitle>
                <CardDescription>Invite team members to manage your business.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-textPrimary/60 text-sm">Team access is coming soon. You'll be able to add staff accounts with different permission levels (Admin, Editor, Viewer).</p>
              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
};

