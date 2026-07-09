import React, { useEffect, useState } from 'react';
import { Bell, Send, Users, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

const TARGET_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'customer', label: 'All Customers' },
  { value: 'vendor', label: 'All Vendors' },
];

const TYPE_OPTIONS = [
  { value: 'info', label: 'Info', icon: MessageSquare, activeClass: 'border-primary/40 bg-primary/10 text-primary', iconClass: 'text-primary' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, activeClass: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400', iconClass: 'text-yellow-500' },
  { value: 'success', label: 'Success', icon: ShieldCheck, activeClass: 'border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400', iconClass: 'text-green-500' },
];

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString();
};

export const AdminNotificationManagement = () => {
  const [audience, setAudience] = useState({ all: 0, customer: 0, vendor: 0 });
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [targetRole, setTargetRole] = useState('all');
  const [type, setType] = useState('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const loadAudience = async () => {
    try {
      const res = await api.get('/admin/broadcasts/audience');
      setAudience(res.data);
    } catch (err) {
      // Non-fatal: composer still works without live counts
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.get('/admin/broadcasts');
      setHistory(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load broadcast history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadAudience();
    loadHistory();
  }, []);

  const handleSend = async () => {
    setError('');
    setSuccess('');
    if (!title.trim() || !message.trim()) {
      setError('Please provide both a title and a message.');
      return;
    }
    setSending(true);
    try {
      await api.post('/admin/broadcasts', { title, message, type, targetRole });
      setSuccess('Broadcast sent successfully.');
      setTitle('');
      setMessage('');
      await Promise.all([loadHistory(), loadAudience()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send broadcast.');
    } finally {
      setSending(false);
    }
  };

  const targetLabelFor = (role) => TARGET_OPTIONS.find((t) => t.value === role)?.label || role;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-7 h-7 text-primary" />
            Global Push Notifications
          </h1>
          <p className="text-gray-600 dark:text-white/60">Broadcast system alerts, promotions, and updates to user cohorts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Col: Composer */}
        <Card className="border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Send className="w-5 h-5" /> Compose Broadcast</CardTitle>
            <CardDescription>Send an in-app notification to a specific group.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Target Audience</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
              >
                {TARGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({(audience[opt.value] ?? 0).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Notification Type</label>
              <div className="grid grid-cols-3 gap-3">
                {TYPE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      'cursor-pointer border rounded-lg p-3 text-center transition-colors',
                      type === opt.value
                        ? opt.activeClass
                        : 'border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 bg-light-surface/50 dark:bg-surface/50'
                    )}
                  >
                    <input
                      type="radio"
                      name="type"
                      className="hidden"
                      checked={type === opt.value}
                      onChange={() => setType(opt.value)}
                    />
                    <opt.icon className={cn('w-5 h-5 mx-auto mb-1', type === opt.value ? '' : opt.iconClass)} />
                    <span className={cn('text-xs font-medium', type === opt.value ? 'font-bold' : 'text-gray-600 dark:text-white/60')}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Message Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Maintenance"
                className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-white/80 block">Message Body</label>
              <textarea
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full bg-light-surface dark:bg-surface border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}

            <div className="pt-2 flex justify-end">
              <Button leftIcon={<Send className="w-4 h-4" />} onClick={handleSend} isLoading={sending}>
                Send Broadcast Now
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Right Col: History */}
        <Card>
          <CardHeader>
            <CardTitle>Broadcast History</CardTitle>
            <CardDescription>Recently sent global notifications.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loadingHistory ? (
              <p className="p-4 text-sm text-gray-500 dark:text-white/60">Loading history...</p>
            ) : history.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 dark:text-white/60">No broadcasts sent yet.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {history.map((log) => (
                  <div key={log.broadcastId} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />}
                        {log.type === 'success' && <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />}
                        {log.type === 'info' && <MessageSquare className="w-4 h-4 text-primary shrink-0" />}
                        {log.title}
                      </h4>
                      <span className="text-[10px] text-gray-500 dark:text-white/50 shrink-0 ml-2">{formatRelativeTime(log.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-white/50">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Target: {targetLabelFor(log.targetRole)}</span>
                      <span>Delivered to {log.recipientCount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
