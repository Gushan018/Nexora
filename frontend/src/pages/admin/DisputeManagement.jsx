import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, Search, Filter, MessageSquare, Clock, ArrowRight, Gavel, Download, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const DISPUTES = [
  {
    id: 'DSP-045',
    orderId: 'ORD-1024',
    amount: 'LKR 25,000',
    raisedBy: 'Customer',
    reporter: 'Nina Fernando',
    reason: 'Service Not Delivered',
    date: 'Jun 15, 2026',
    status: 'open',
    service: 'Premium Wedding Catering',
    vendor: 'Elite Catering Co.',
    customer: 'Nina Fernando',
    paidAmount: 'LKR 25,000',
    chat: [
      { sender: 'Customer', message: 'I still have not received the venue setup after 4 hours.', time: 'Jun 15 · 09:12' },
      { sender: 'Vendor', message: 'Our team arrived but the event manager said the hall was not ready.', time: 'Jun 15 · 09:35' },
      { sender: 'Customer', message: 'Please check the booking notes, this is a confirmed slot.', time: 'Jun 15 · 09:42' },
    ],
    evidence: [
      { id: 'E-01', label: 'Event Contract', type: 'Document' },
      { id: 'E-02', label: 'Venue Photo', type: 'Image' },
    ],
  },
  {
    id: 'DSP-046',
    orderId: 'ORD-1027',
    amount: 'LKR 14,500',
    raisedBy: 'Vendor',
    reporter: 'Pulse Entertainment',
    reason: 'Poor Quality Audio Equipment',
    date: 'Jun 12, 2026',
    status: 'investigating',
    service: 'Live DJ Package',
    vendor: 'Pulse Entertainment',
    customer: 'Ravi Kumar',
    paidAmount: 'LKR 14,500',
    chat: [
      { sender: 'Vendor', message: 'Equipment quality did not match the agreed package.', time: 'Jun 12 · 08:08' },
      { sender: 'Customer', message: 'We promised premium sound with backup speakers.', time: 'Jun 12 · 08:15' },
      { sender: 'Vendor', message: 'We only had two microphones available.', time: 'Jun 12 · 08:22' },
    ],
    evidence: [
      { id: 'E-03', label: 'Audio Log', type: 'Audio' },
      { id: 'E-04', label: 'Supplier Invoice', type: 'Document' },
    ],
  },
  {
    id: 'DSP-047',
    orderId: 'ORD-1030',
    amount: 'LKR 8,200',
    raisedBy: 'Customer',
    reporter: 'Priya Senarath',
    reason: 'Unresponsive vendor after booking',
    date: 'Jun 02, 2026',
    status: 'resolved',
    service: 'Floral Decoration',
    vendor: 'Bloom Designs',
    customer: 'Priya Senarath',
    paidAmount: 'LKR 8,200',
    chat: [
      { sender: 'Customer', message: 'Please confirm the flower arrangement details.', time: 'Jun 02 · 10:02' },
      { sender: 'Vendor', message: 'We are on leave today, will reply tomorrow.', time: 'Jun 02 · 10:12' },
      { sender: 'Customer', message: 'This is too late for the event schedule.', time: 'Jun 02 · 10:20' },
    ],
    evidence: [
      { id: 'E-05', label: 'Booking Confirmation', type: 'Document' },
      { id: 'E-06', label: 'Screenshot of Messages', type: 'Image' },
    ],
  },
];

const TABS = [
  { id: 'open', label: '🔴 Open / Action Required' },
  { id: 'investigating', label: '🟡 Under Investigation' },
  { id: 'resolved', label: '🟢 Resolved / Closed' },
];

const badgeStyles = {
  Customer: 'bg-blue-500/10 text-blue-300 border-blue-300/20',
  Vendor: 'bg-purple-500/10 text-purple-300 border-purple-300/20',
};

const statusStyles = {
  open: 'bg-red-500/10 text-red-300 border-red-300/20',
  investigating: 'bg-yellow-500/10 text-yellow-300 border-yellow-300/20',
  resolved: 'bg-emerald-500/10 text-emerald-300 border-emerald-300/20',
};

export const DisputeManagement = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [notes, setNotes] = useState('');

  const filteredDisputes = useMemo(() => {
    return DISPUTES.filter((dispute) => {
      if (dispute.status !== activeTab) return false;
      const normalized = searchQuery.toLowerCase();
      return [dispute.id, dispute.orderId, dispute.raisedBy, dispute.reason, dispute.reporter]
        .some((value) => value.toLowerCase().includes(normalized));
    });
  }, [activeTab, searchQuery]);

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
          <p className="text-gray-600 dark:text-white/60">Track open cases, review evidence, and decide escrow outcomes with confidence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-red-500">Active Disputes</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">4</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-white/60">New issues currently open.</p>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-white/60">Disputed Funds</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">LKR 52,300</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-white/60">Escrow frozen until resolution.</p>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-white/60">Resolved (This Month)</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">18</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-white/60">Closed disputes this month.</p>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-white/60">Avg. Resolution Time</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">2.5 Days</p>
            <p className="mt-3 text-sm text-gray-500 dark:text-white/60">Average admin decision time.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 border-b border-gray-200/70 dark:border-white/10">
          <div>
            <CardTitle>Dispute Case Queue</CardTitle>
            <p className="text-sm text-gray-500 dark:text-white/60">Filter by status and review each case in one place.</p>
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
                    ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10 dark:bg-white dark:text-slate-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
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
                className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-white/10 dark:bg-surface dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button variant="outline" size="sm">Refresh</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-[0.18em] text-gray-500 dark:bg-white/5 dark:text-white/50">
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
                    <tr key={dispute.id} className="border-b border-gray-200/70 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-semibold text-gray-900 dark:text-white">{dispute.id}</td>
                      <td className="p-4 text-gray-700 dark:text-white/80">
                        <div>{dispute.orderId}</div>
                        <div className="mt-1 text-sm text-gray-500 dark:text-white/60">{dispute.amount}</div>
                      </td>
                      <td className="p-4">
                        <div className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', badgeStyles[dispute.raisedBy])}>
                          {dispute.raisedBy}
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-white/60">{dispute.reporter}</p>
                      </td>
                      <td className="p-4 text-gray-700 dark:text-white/80">{dispute.reason}</td>
                      <td className="p-4 text-gray-700 dark:text-white/80">{dispute.date}</td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => openDispute(dispute)}>
                          Review Case
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm text-gray-500 dark:text-white/60">
                      No disputes match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-5 dark:border-white/10">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Case {selectedDispute.id}</h2>
                  <p className="text-sm text-gray-500 dark:text-white/60">Order {selectedDispute.orderId} • {selectedDispute.amount}</p>
                </div>
                <button
                  type="button"
                  onClick={closeDisputeModal}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:hover:bg-white/5 dark:hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  <Card className="border-gray-200 dark:border-white/10">
                    <CardHeader className="border-b border-gray-200/70 dark:border-white/10">
                      <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-700 dark:text-white/80">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 dark:text-white/60">Service</p>
                          <p className="mt-2 font-semibold">{selectedDispute.service}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-white/60">Paid Amount</p>
                          <p className="mt-2 font-semibold">{selectedDispute.paidAmount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-white/60">Vendor</p>
                          <p className="mt-2 font-semibold">{selectedDispute.vendor}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-white/60">Customer</p>
                          <p className="mt-2 font-semibold">{selectedDispute.customer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 dark:border-white/10">
                    <CardHeader className="border-b border-gray-200/70 dark:border-white/10">
                      <CardTitle>Evidence & Chat Logs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500 dark:text-white/60">Review uploaded evidence and chat history below.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedDispute.evidence.map((file) => (
                            <div key={file.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{file.label}</p>
                                <p className="text-xs text-gray-500 dark:text-white/60">{file.type}</p>
                              </div>
                              <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-gray-200/70 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                          <MessageSquare className="w-4 h-4" />
                          Chat transcript
                        </div>
                        <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-2">
                          {selectedDispute.chat.map((message, index) => (
                            <div key={index} className={cn(
                              'rounded-2xl px-4 py-3',
                              message.sender === 'Customer'
                                ? 'bg-white text-gray-900 dark:bg-slate-800 dark:text-white'
                                : 'bg-slate-900 text-white dark:bg-slate-800'
                            )}>
                              <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-white/50">
                                <span>{message.sender}</span>
                                <span>{message.time}</span>
                              </div>
                              <p className="mt-2 text-sm leading-6">{message.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 dark:border-white/10">
                    <CardHeader className="border-b border-gray-200/70 dark:border-white/10">
                      <CardTitle>Internal Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Type private admin notes here..."
                        className="h-36 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                      />
                      <div className="mt-4 flex justify-end">
                        <Button variant="secondary" size="sm">Save Note</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <CardHeader className="border-b border-gray-200/70 dark:border-white/10">
                      <CardTitle>Case Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-700 dark:text-white/80">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500"><ShieldAlert className="w-4 h-4" /></span>
                        <p className="font-semibold">{selectedDispute.reason}</p>
                      </div>
                      <p><span className="font-semibold">Raised by:</span> {selectedDispute.raisedBy} • {selectedDispute.reporter}</p>
                      <p><span className="font-semibold">Reported on:</span> {selectedDispute.date}</p>
                      <p><span className="font-semibold">Current status:</span> <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusStyles[selectedDispute.status])}>{selectedDispute.status === 'open' ? 'Open' : selectedDispute.status === 'investigating' ? 'Under Investigation' : 'Resolved'}</span></p>
                    </CardContent>
                  </Card>

                  <div className="rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Admin Actions</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-white/60">Select a resolution and apply escrow instructions.</p>
                    <div className="mt-5 grid gap-3">
                      <Button className="justify-start bg-emerald-500 text-white hover:bg-emerald-600" size="sm" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                        Release Funds to Vendor
                      </Button>
                      <Button variant="danger" size="sm" className="justify-start" leftIcon={<AlertTriangle className="w-4 h-4" />}>
                        Refund to Customer
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start" leftIcon={<FileText className="w-4 h-4" />}>
                        Partial Refund (50/50)
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
