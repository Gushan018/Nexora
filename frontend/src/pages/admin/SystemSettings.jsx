import React, { useEffect, useState } from 'react';
import { Settings, Server, Globe, Lock, Bell, CreditCard, Mail, Database, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api, resolveAssetUrl } from '../../utils/api';

export const SystemSettings = () => {
  const defaultFormState = {
    platformName: 'Nexora Marketplace',
    supportEmail: 'support@nexora.com',
    maintenanceMode: false,
    commissionPercent: 10,
    paymentGateway: 'Stripe',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    smtpFromEmail: '',
    smtpSecure: false,
    authLockoutEnabled: false,
    authFailedAttemptsLimit: 5,
    authPasswordMinLength: 8,
    authTwoFactorEnabled: false,
    logoUrl: '',
  };

  const [formState, setFormState] = useState(defaultFormState);
  const [initialState, setInitialState] = useState(defaultFormState);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  const tabs = [
    { id: 'general', icon: Globe, label: 'General', description: 'Manage global platform configuration and branding.' },
    { id: 'payments', icon: CreditCard, label: 'Payments & Fees', description: 'Manage payment gateway, commissions, and transaction fees.' },
    { id: 'smtp', icon: Mail, label: 'SMTP & Email', description: 'Configure outgoing email server and notification settings.' },
    { id: 'security', icon: Lock, label: 'Security & Auth', description: 'Manage authentication, password policy, and access controls.' },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/admin/settings');
        const data = response.data;
        const loadedState = {
          platformName: data.platformName || 'Nexora Marketplace',
          supportEmail: data.supportEmail || 'support@nexora.com',
          maintenanceMode: data.maintenanceMode ?? false,
          commissionPercent: data.commissionPercent ?? 10,
          paymentGateway: data.paymentGateway || 'Stripe',
          smtpHost: data.smtpHost || '',
          smtpPort: data.smtpPort ?? '',
          smtpUser: data.smtpUser || '',
          smtpPassword: data.smtpPassword || '',
          smtpFromEmail: data.smtpFromEmail || '',
          smtpSecure: data.smtpSecure ?? false,
          authLockoutEnabled: data.authLockoutEnabled ?? false,
          authFailedAttemptsLimit: data.authFailedAttemptsLimit ?? 5,
          authPasswordMinLength: data.authPasswordMinLength ?? 8,
          authTwoFactorEnabled: data.authTwoFactorEnabled ?? false,
          logoUrl: data.logoUrl || '',
        };
        setFormState(loadedState);
        setInitialState(loadedState);
        // set preview if logo exists
        if (loadedState.logoUrl) {
          setLogoPreview(resolveAssetUrl(loadedState.logoUrl));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await api.put('/admin/settings', formState);
      setFormState((prev) => ({ ...prev, ...response.data.settings }));
      setMessage(response.data.message || 'Settings saved successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = res.data.url; // returns /uploads/filename
      setFormState((prev) => ({ ...prev, logoUrl: url }));

      setLogoPreview(resolveAssetUrl(url));
    } catch (err) {
      setError(err.response?.data?.message || 'Logo upload failed.');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 flex flex-col lg:flex-row gap-6 lg:gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0 space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
        
        <nav className="space-y-1">
          {tabs.map((item) => (
            <button 
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                item.id === activeTab
                  ? "bg-primary/20 text-primary border border-primary/20"
                  : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{tabs.find((tab) => tab.id === activeTab)?.label}</h2>
          <p className="text-sm text-gray-600 dark:text-white/60 mt-1">{tabs.find((tab) => tab.id === activeTab)?.description}</p>
        </div>

        {activeTab === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle>Platform Identity</CardTitle>
              <CardDescription>Public-facing details for the marketplace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Platform Name</label>
                  <input
                    type="text"
                    value={formState.platformName}
                    onChange={handleChange('platformName')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Support Email</label>
                  <input
                    type="email"
                    value={formState.supportEmail}
                    onChange={handleChange('supportEmail')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="pt-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Platform Logo</label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-20 h-20 rounded-md object-contain bg-white/5 p-2" />
                    ) : (
                      <div className="w-20 h-20 rounded-md bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 flex items-center justify-center text-sm text-gray-500">No logo</div>
                    )}
                    <div className="flex flex-col">
                      <input type="file" accept="image/*" onChange={handleLogoChange} />
                      {uploadingLogo && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        

        {activeTab === 'payments' && (
          <Card>
            <CardHeader>
              <CardTitle>Payments & Fees</CardTitle>
              <CardDescription>Configure commission rates and transaction fee settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Platform Commission (%)</label>
                  <input
                    type="number"
                    min={0}
                    value={formState.commissionPercent}
                    onChange={handleChange('commissionPercent')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Payment Gateway</label>
                  <select
                    value={formState.paymentGateway}
                    onChange={handleChange('paymentGateway')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="Stripe">Stripe</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Razorpay">Razorpay</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'smtp' && (
          <Card>
            <CardHeader>
              <CardTitle>SMTP & Email</CardTitle>
              <CardDescription>Set up outgoing email delivery and notification settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">SMTP Host</label>
                <input
                  type="text"
                  value={formState.smtpHost}
                  onChange={handleChange('smtpHost')}
                  className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">SMTP Port</label>
                  <input
                    type="number"
                    min={1}
                    value={formState.smtpPort}
                    onChange={handleChange('smtpPort')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">From Email</label>
                  <input
                    type="email"
                    value={formState.smtpFromEmail}
                    onChange={handleChange('smtpFromEmail')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">SMTP Username</label>
                  <input
                    type="text"
                    value={formState.smtpUser}
                    onChange={handleChange('smtpUser')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">SMTP Password</label>
                  <input
                    type="password"
                    value={formState.smtpPassword}
                    onChange={handleChange('smtpPassword')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="smtpSecure"
                  type="checkbox"
                  checked={formState.smtpSecure}
                  onChange={handleChange('smtpSecure')}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="smtpSecure" className="text-sm text-gray-700 dark:text-white/80">Use secure SMTP (TLS/SSL)</label>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle>Security & Auth</CardTitle>
              <CardDescription>Manage login and access controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    id="authLockoutEnabled"
                    type="checkbox"
                    checked={formState.authLockoutEnabled}
                    onChange={handleChange('authLockoutEnabled')}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="authLockoutEnabled" className="text-sm text-gray-700 dark:text-white/80">Enable lockout after failed attempts</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="authTwoFactorEnabled"
                    type="checkbox"
                    checked={formState.authTwoFactorEnabled}
                    onChange={handleChange('authTwoFactorEnabled')}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="authTwoFactorEnabled" className="text-sm text-gray-700 dark:text-white/80">Enable two-factor auth</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Failed Attempts Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={formState.authFailedAttemptsLimit}
                    onChange={handleChange('authFailedAttemptsLimit')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Minimum Password Length</label>
                  <input
                    type="number"
                    min={6}
                    value={formState.authPasswordMinLength}
                    onChange={handleChange('authPasswordMinLength')}
                    className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {message && <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={() => setFormState(initialState || defaultFormState)}>
            Cancel Changes
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={saving || loading || uploadingLogo}>
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>

      </div>

    </div>
  );
};
