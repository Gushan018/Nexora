import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, Search, MessageSquare, Gavel, Download, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';

const TABS = [
  { id: 'open', label: '🔴 Open / Action Required' },
  { id: 'investigating', label: '🟡 Under Investigation' },
  { id: 'resolved', label: '🟢 Resolved / Closed' },
  { id: 'rejected', label: '⚫ Rejected' },
];

const badgeStyles = {
  Customer: 'bg-blue-500/10 text-blue-300 border-blue-300/20',
  Vendor: 'bg-purple-500/10 text-purple-300 border-purple-300/20',
};

const statusStyles = {
  open: 'bg-red-500/10 text-red-300 border-red-300/20',
  investigating: 'bg-yellow-500/10 text-yellow-300 border-yellow-300/20',
  resolved: 'bg-emerald-500/10 text-emerald-300 border-emerald-300/20',
  rejected: 'bg-slate-500/10 text-slate-300 border-slate-300/20',
};

export const DisputeManagement = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [notes, setNotes] = useState('');
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    activeDisputes: 0,
    disputedFunds: 'LKR 0',
    resolvedThisMonth: 0,
    avgResolutionTime: '0 Days',
  });
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchDisputeStats = async () => {
    setStatsLoading(true);
    try {
      const response = await api.get('/admin/disputes-stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dispute stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchDisputes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/disputes');
      setDisputes(response.data || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Unable to load disputes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
    fetchDisputeStats();
  }, []);

  const updateDisputeStatus = async (status) => {
    if (!selectedDispute) return;
    setActionLoading(true);
    try {
      await api.put(`/admin/disputes/${selectedDispute.id}/status`, { status: status.toUpperCase() });
      await fetchDisputes();
      await fetchDisputeStats();
      setSelectedDispute(null);
    } catch (statusError) {
      setError(statusError.response?.data?.message || 'Unable to update dispute status.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDisputes = useMemo(() => {
    return disputes.filter((dispute) => {
      if (activeTab && dispute.status !== activeTab) return false;
      const normalized = searchQuery.toLowerCase();
      return [dispute.id, dispute.orderId, dispute.raisedBy, dispute.reason, dispute.reporter]
        .some((value) => value?.toString().toLowerCase().includes(normalized));
    });
  }, [activeTab, disputes, searchQuery]);

  const openDispute = (dispute) => {
    setSelectedDispute(dispute);
    setNotes('');
  };

  const closeDisputeModal = () => setSelectedDispute(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Gavel className="w-7 h-7 text-red-500" />
            Disputes & Resolution
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track open cases, review evidence, and decide escrow outcomes with confidence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-red-500">Active Disputes</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">{stats.activeDisputes}</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">New issues currently open.</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 dark:bg-gray-900/50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Disputed Funds</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">{stats.disputedFunds}</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Escrow frozen until resolution.</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 dark:bg-gray-900/50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved (This Month)</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">{stats.resolvedThisMonth}</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Closed disputes this month.</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 dark:bg-gray-900/50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Resolution Time</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">{stats.avgResolutionTime}</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Average admin decision time.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 dark:border-gray-800 dark:bg-gray-900/50">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 border-b border-gray-200/70 dark:border-gray-800">
          <div>
            <CardTitle className="text-gray-900 dark:text-white">Dispute Case Queue</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Filter by status and review each case in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-md dark:bg-white dark:!text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search dispute, order, reason, or reporter..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    fetchDisputes();
                    fetchDisputeStats();
                  }} 
                  className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Refresh
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                Loading disputes...
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                      <th className="p-4 text-left">Dispute ID</th>
                      <th className="p-4 text-left">Order ID & Amount</th>
                      <th className="p-4 text-left">Raised By</th>
                      <th className="p-4 text-left">Reason</th>
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDisputes.length > 0 ? (
                      filteredDisputes.map((dispute) => (
                        <tr key={dispute.id} className="border-b border-gray-200/70 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="p-4 font-semibold text-gray-900 dark:text-white">{dispute.id}</td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">
                            <div>{dispute.orderId}</div>
                            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{dispute.amount}</div>
                          </td>
                          <td className="p-4">
                            <div className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', badgeStyles[dispute.raisedBy] || 'bg-gray-100 text-gray-700 border-gray-200')}>
                              {dispute.raisedBy}
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{dispute.reporter}</p>
                          </td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">{dispute.reason}</td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">{dispute.date}</td>
                          <td className="p-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => openDispute(dispute)} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                              Review Case
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                          No disputes match this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      <AnimatePresence>
        {selectedDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              className="w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-900 border border-transparent dark:border-gray-700"
            >
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Case {selectedDispute.id}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order {selectedDispute.orderId} • {selectedDispute.amount}</p>
                </div>
                <button
                  type="button"
                  onClick={closeDisputeModal}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr] overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-900">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="border-b border-gray-200/70 p-5 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Order Details</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Service</p>
                          <p className="mt-2 font-semibold text-gray-900 dark:text-white">{selectedDispute.service || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Paid Amount</p>
                          <p className="mt-2 font-semibold text-gray-900 dark:text-white">{selectedDispute.amount || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Vendor</p>
                          <p className="mt-2 font-semibold text-gray-900 dark:text-white">{selectedDispute.vendor || selectedDispute.vendorId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Customer</p>
                          <p className="mt-2 font-semibold text-gray-900 dark:text-white">{selectedDispute.customer || selectedDispute.customerId || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="border-b border-gray-200/70 p-5 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Evidence & Chat Logs</h3>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Review uploaded evidence and chat history below.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(selectedDispute.evidence || []).map((file) => (
                            <div key={file.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{file.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{file.type}</p>
                              </div>
                              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" leftIcon={<Download className="w-4 h-4" />}>
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-gray-200/70 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                          <MessageSquare className="w-4 h-4" />
                          Chat transcript
                        </div>
                        <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                          {(selectedDispute.chat || []).map((message, index) => (
                            <div key={index} className={cn(
                              'rounded-2xl px-4 py-3 border shadow-sm',
                              message.sender === 'Customer'
                                ? 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30'
                            )}>
                              <div className="flex items-center justify-between gap-3 text-xs mb-2">
                                <span className={cn(
                                  'font-bold',
                                  message.sender === 'Customer'
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-blue-700 dark:text-blue-400'
                                )}>
                                  {message.sender}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 font-medium">{message.time}</span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">{message.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="border-b border-gray-200/70 p-5 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Internal Notes</h3>
                    </div>
                    <div className="p-5">
                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Type private admin notes here..."
                        className="h-36 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-primary/50"
                      />
                      <div className="mt-4 flex justify-end">
                        <Button variant="secondary" size="sm" className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Save Note</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30">
                    <div className="border-b border-gray-200/70 p-5 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Case Summary</h3>
                    </div>
                    <div className="p-5 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500"><ShieldAlert className="w-5 h-5" /></span>
                        <p className="font-semibold text-gray-900 dark:text-white text-base">{selectedDispute.reason}</p>
                      </div>
                      <div className="space-y-2 pt-2">
                        <p><span className="font-medium text-gray-500 dark:text-gray-400">Raised by:</span> {selectedDispute.raisedBy} • {selectedDispute.reporter}</p>
                        <p><span className="font-medium text-gray-500 dark:text-gray-400">Reported on:</span> {selectedDispute.date}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="font-medium text-gray-500 dark:text-gray-400">Current status:</span>
                          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusStyles[selectedDispute.status])}>
                            {selectedDispute.status === 'open' ? 'Open' : selectedDispute.status === 'investigating' ? 'Under Investigation' : selectedDispute.status === 'resolved' ? 'Resolved' : 'Rejected'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Admin Actions</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Select a resolution and apply escrow instructions.</p>
                    <div className="mt-6 grid gap-3">
                      <Button onClick={() => updateDisputeStatus('RESOLVED')} disabled={actionLoading || selectedDispute.status !== 'open'} className="justify-start bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 border-none" size="md">
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Resolve
                      </Button>
                      <Button onClick={() => updateDisputeStatus('REJECTED')} disabled={actionLoading || selectedDispute.status !== 'open'} variant="danger" size="md" className="justify-start dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20">
                        <AlertTriangle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

