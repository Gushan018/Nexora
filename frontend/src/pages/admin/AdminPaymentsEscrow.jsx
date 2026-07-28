import React, { useMemo, useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, ShieldAlert, DollarSign, ArrowRight, FileText, Download, RefreshCw, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../utils/api';
import { cn } from '../../utils/cn';


const SUMMARY_METRICS = [
  { id: 'm1', title: 'Total Escrow Held', value: 'LKR 1.46M', note: '127 orders currently held', color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400' },
  { id: 'm2', title: 'Ready for Payout', value: 'LKR 392K', note: '34 vendor payments', color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400' },
  { id: 'm3', title: 'Pending Release', value: 'LKR 248K', note: '18 review tickets', color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400' },
  { id: 'm4', title: 'Disputed Funds', value: 'LKR 71K', note: '9 active disputes', color: 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400' },
];

const ESCROW_RECORDS = [
  {
    id: 'ORD-8472',
    vendor: 'Midnight Gold',
    amount: 'LKR 42,800',
    heldSince: '2026-06-05',
    releaseDate: '2026-07-03',
    status: 'In Escrow',
    type: 'inEscrow',
  },
  {
    id: 'ORD-8414',
    vendor: 'Grand Azure Resort',
    amount: 'LKR 80,200',
    heldSince: '2026-06-01',
    releaseDate: '2026-06-29',
    status: 'Ready for Payout',
    type: 'readyPayout',
  },
  {
    id: 'ORD-8331',
    vendor: 'Elite Catering Co.',
    amount: 'LKR 16,500',
    heldSince: '2026-05-28',
    releaseDate: '2026-06-19',
    status: 'In Escrow',
    type: 'inEscrow',
  },
  {
    id: 'ORD-8288',
    vendor: 'DJ Velocity',
    amount: 'LKR 29,900',
    heldSince: '2026-05-24',
    releaseDate: '2026-06-15',
    status: 'Ready for Payout',
    type: 'readyPayout',
  },
  {
    id: 'ORD-8122',
    vendor: 'Bloom Designs',
    amount: 'LKR 65,300',
    heldSince: '2026-05-10',
    releaseDate: '2026-05-30',
    status: 'Released',
    type: 'history',
  },
  {
    id: 'ORD-8076',
    vendor: 'Aura Decor',
    amount: 'LKR 22,600',
    heldSince: '2026-05-03',
    releaseDate: '2026-05-24',
    status: 'Paid Out',
    type: 'history',
  },
];

const TABS = [
  { id: 'inEscrow', label: '⏳ In Escrow' },
  { id: 'readyPayout', label: '✅ Ready for Payout' },
  { id: 'history', label: '📜 Transaction History' },
];

const STATUS_STYLES = {
  'In Escrow': 'bg-blue-500/10 text-blue-600 border-blue-300/30 dark:text-blue-400 dark:border-blue-400/20',
  'Ready for Payout': 'bg-emerald-500/10 text-emerald-600 border-emerald-300/30 dark:text-emerald-400 dark:border-emerald-400/20',
  'Released': 'bg-purple-500/10 text-purple-600 border-purple-300/30 dark:text-purple-400 dark:border-purple-400/20',
  'Paid Out': 'bg-gray-500/10 text-gray-600 border-gray-300/30 dark:text-gray-400 dark:border-gray-400/20',
};

const statusBadge = (status) => (
  <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border', STATUS_STYLES[status])}>
    {status === 'In Escrow' && <Clock className="w-3.5 h-3.5" />}
    {status === 'Ready for Payout' && <CheckCircle2 className="w-3.5 h-3.5" />}
    {status === 'Released' && <FileText className="w-3.5 h-3.5" />}
    {status === 'Paid Out' && <ArrowRight className="w-3.5 h-3.5" />}
    {status}
  </span>
);

export const AdminPaymentsEscrow = () => {
  const [activeTab, setActiveTab] = useState('inEscrow');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalEscrowHeld: 0,
    escrowCount: 0,
    readyForPayout: 0,
    readyPayoutCount: 0,
    pendingRelease: 0,
    pendingCount: 0,
    disputedFunds: 0,
    disputedCount: 0,
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [receiptRecord, setReceiptRecord] = useState(null);
  const [releasingId, setReleasingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const fetchEscrowStats = async () => {
    try {
      const response = await api.get('/admin/escrow-stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching escrow stats:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get('/admin/payments');
      setRecords(response.data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchEscrowStats(), fetchPayments()]);
    } catch (err) {
      setError('Failed to load escrow data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRelease = async (record) => {
    if (!window.confirm(`Release ${record.amount} in escrow to ${record.vendor}?`)) return;
    setActionError('');
    setReleasingId(record.id);
    try {
      await api.put(`/admin/payments/${record.id}/release`);
      setSelectedRecord(null);
      await fetchAllData();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to release payment.');
    } finally {
      setReleasingId(null);
    }
  };


  const handleExportCSV = () => {
    if (!filteredRecords.length) return;
    const headers = ['Order ID', 'Vendor', 'Customer', 'Amount', 'Held Since', 'Release Date', 'Status'];
    const rows = filteredRecords.map(r => [
      r.orderId,
      `"${r.vendor}"`,
      `"${r.customer}"`,
      `"${r.amount}"`,
      r.heldSince,
      r.releaseDate,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Escrow_Payments_${activeTab}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (activeTab === 'inEscrow' && record.type !== 'inEscrow') return false;
      if (activeTab === 'readyPayout' && record.type !== 'readyPayout') return false;
      const normalized = searchQuery.toLowerCase();
      return (
        record.vendor?.toLowerCase().includes(normalized) ||
        record.orderId?.toLowerCase().includes(normalized) ||
        record.status?.toLowerCase().includes(normalized)
      );
    });
  }, [activeTab, searchQuery, records]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-primary" />
            Payments & Escrow
          </h1>
          <p className="text-gray-600 dark:text-white/60">Manage escrow balances, payout-ready orders, and transaction history.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4" />}>Export</Button>
          <Button size="sm" onClick={fetchAllData} leftIcon={<RefreshCw className="w-4 h-4" />}>Sync Ledger</Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-amber-500/20 bg-amber-500/5 dark:border-white/10 dark:bg-surface">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Total Escrow Held</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">LKR {stats.totalEscrowHeld.toLocaleString()}</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">
                <DollarSign className="w-6 h-6" />
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-gray-500 dark:text-white/40">{stats.escrowCount} orders currently held</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5 dark:border-white/10 dark:bg-surface">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Ready for Payout</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">LKR {stats.readyForPayout.toLocaleString()}</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-gray-500 dark:text-white/40">{stats.readyPayoutCount} vendor payments</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5 dark:border-white/10 dark:bg-surface">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Pending Release</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">LKR {stats.pendingRelease.toLocaleString()}</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
                <Clock className="w-6 h-6" />
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-gray-500 dark:text-white/40">{stats.pendingCount} review tickets</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5 dark:border-white/10 dark:bg-surface">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Disputed Funds</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">LKR {stats.disputedFunds.toLocaleString()}</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-gray-500 dark:text-white/40">{stats.disputedCount} active disputes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="border-gray-200 dark:border-white/10 dark:bg-surface">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 border-b border-gray-200/70 dark:border-white/10">
          <div>
            <CardTitle>Escrow Activity</CardTitle>
            <p className="text-sm text-gray-500 dark:text-white/60 mt-1">Review the current escrow lifecycle and payout pipeline.</p>
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
                    ? 'bg-primary text-white shadow-md dark:bg-primary dark:!text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {actionError && (
            <div className="px-5 pt-4 text-sm text-red-600 dark:text-red-400">{actionError}</div>
          )}
          {/* Search Bar */}
          <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-transparent border-b border-gray-200/70 dark:border-white/10">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/40" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search vendor, order ID, or status..."
                className="w-full rounded-full border border-gray-200 bg-white px-11 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
              />
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-white/50">
              Showing <span className="text-gray-900 dark:text-white">{filteredRecords.length}</span> records
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm text-left">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-[0.1em] text-gray-500 dark:bg-white/5 dark:text-white/60 border-b border-gray-200/70 dark:border-white/10">
                  <th className="py-4 px-6 font-semibold">Vendor Name</th>
                  <th className="py-4 px-6 font-semibold">Order ID</th>
                  <th className="py-4 px-6 font-semibold">Escrow Amount</th>
                  <th className="py-4 px-6 font-semibold">Held Since</th>
                  <th className="py-4 px-6 font-semibold">Release Date</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/70 dark:divide-white/10">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{record.vendor}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-white/70 font-medium">{record.orderId}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">{record.amount}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-white/60">{record.heldSince}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-white/60">{record.releaseDate}</td>
                      <td className="px-6 py-4">{statusBadge(record.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {record.type === 'inEscrow' && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>Review</Button>
                              <Button
                                size="sm"
                                onClick={() => handleRelease(record)}
                                isLoading={releasingId === record.id}
                              >
                                Release
                              </Button>
                            </>
                          )}
                          {record.type === 'readyPayout' && (
                            <>
                              <Button variant="outline" size="sm">Verify</Button>
                              <Button size="sm">Initiate Payout</Button>
                            </>
                          )}
                          {record.type === 'history' && (
                            <Button variant="outline" size="sm" onClick={() => setReceiptRecord(record)}>Receipt</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-white/50">
                        <Search className="w-8 h-8 mb-3 opacity-50" />
                        <p className="text-sm font-medium">No records found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord ? `Escrow Review — ${selectedRecord.orderId}` : ''}
      >
        {selectedRecord && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-white/50">Vendor</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right">{selectedRecord.vendor}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-white/50">Customer</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right">{selectedRecord.customer || '—'}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-white/50">Item</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right">{selectedRecord.item || '—'}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-white/50">Amount</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedRecord.amount}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-white/50">Held Since</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedRecord.heldSince}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-white/50">Est. Release</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedRecord.releaseDate}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-500 dark:text-white/50">Status</span>
              {statusBadge(selectedRecord.status)}
            </div>

            {actionError && <p className="text-sm text-red-500">{actionError}</p>}

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedRecord(null)}>Close</Button>
              {selectedRecord.type === 'inEscrow' && (
                <Button
                  size="sm"
                  onClick={() => handleRelease(selectedRecord)}
                  isLoading={releasingId === selectedRecord.id}
                >
                  Release Funds
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!receiptRecord}
        onClose={() => setReceiptRecord(null)}
        title={receiptRecord ? `Receipt — ${receiptRecord.orderId}` : ''}
      >
        {receiptRecord && (
          <div className="space-y-4">
            <div id="receipt-print-area" className="space-y-3 text-sm">
              <div className="text-center pb-3 border-b border-gray-200 dark:border-white/10">
                <p className="text-lg font-bold text-gray-900 dark:text-white">Payment Receipt</p>
                <p className="text-xs text-gray-500 dark:text-white/50">EventNest Platform</p>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-white/50">Order ID</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right">{receiptRecord.orderId}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-white/50">Vendor</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right">{receiptRecord.vendor}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-white/50">Customer</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right">{receiptRecord.customer || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-white/50">Item</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right">{receiptRecord.item || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-white/50">Held Since</span>
                <span className="font-semibold text-gray-900 dark:text-white">{receiptRecord.heldSince}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-white/50">Release Date</span>
                <span className="font-semibold text-gray-900 dark:text-white">{receiptRecord.releaseDate}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-500 dark:text-white/50">Status</span>
                {statusBadge(receiptRecord.status)}
              </div>
              <div className="flex justify-between gap-4 pt-3 border-t border-gray-200 dark:border-white/10">
                <span className="text-gray-500 dark:text-white/50 font-semibold">Amount</span>
                <span className="font-bold text-gray-900 dark:text-white text-base">{receiptRecord.amount}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setReceiptRecord(null)}>Close</Button>
              <Button size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
                Print Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
