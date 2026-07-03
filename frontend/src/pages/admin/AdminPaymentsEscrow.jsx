import React, { useMemo, useState } from 'react';
import { Search, Clock, CheckCircle2, ShieldAlert, DollarSign, ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';

const SUMMARY_METRICS = [
  { id: 'm1', title: 'Total Escrow Held', value: 'LKR 1.46M', note: '127 orders currently held', color: 'bg-primary/10 text-primary' },
  { id: 'm2', title: 'Ready for Payout', value: 'LKR 392K', note: '34 vendor payments', color: 'bg-emerald-500/10 text-emerald-400' },
  { id: 'm3', title: 'Pending Release', value: 'LKR 248K', note: '18 review tickets', color: 'bg-yellow-500/10 text-yellow-400' },
  { id: 'm4', title: 'Disputed Funds', value: 'LKR 71K', note: '9 active disputes', color: 'bg-red-500/10 text-red-400' },
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
  { id: 'inEscrow', label: 'In Escrow' },
  { id: 'readyPayout', label: 'Ready for Payout' },
  { id: 'history', label: 'Transaction History' },
];

const STATUS_STYLES = {
  'In Escrow': 'bg-slate-800/10 text-slate-100 border-slate-800/20',
  'Ready for Payout': 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
  Released: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
  'Paid Out': 'bg-green-500/10 text-green-400 border-green-400/20',
};

const statusBadge = (status) => (
  <span className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border', STATUS_STYLES[status] || 'bg-gray-800/10 text-white/80 border-gray-800/20')}>
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

  const filteredRecords = useMemo(() => {
    return ESCROW_RECORDS.filter((record) => {
      if (activeTab !== 'history' && record.type !== activeTab) {
        return false;
      }
      if (activeTab === 'history' && record.type !== 'history') {
        return false;
      }
      const normalized = searchQuery.toLowerCase();
      return (
        record.vendor.toLowerCase().includes(normalized) ||
        record.id.toLowerCase().includes(normalized) ||
        record.status.toLowerCase().includes(normalized)
      );
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-primary" />
            Payments & Escrow
          </h1>
          <p className="text-gray-600 dark:text-white/60">Manage escrow balances, payout-ready orders, and transaction history across vendors.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button size="sm">Sync Ledger</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {SUMMARY_METRICS.map((metric) => (
          <Card key={metric.id} className="border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-white/60">{metric.title}</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                </div>
                <span className={cn('inline-flex h-12 w-12 items-center justify-center rounded-2xl', metric.color)}>
                  <DollarSign className="w-5 h-5" />
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-white/60">{metric.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 border-b border-gray-200/70 dark:border-white/10">
          <div>
            <CardTitle>Escrow Activity</CardTitle>
            <CardDescription>Review the current escrow lifecycle and payout pipeline.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search vendor, order ID, or status..."
                className="w-full rounded-2xl border border-gray-200/70 bg-white/90 px-12 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-white/10 dark:bg-surface dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 md:w-[320px]">
              <div className="rounded-2xl border border-gray-200/70 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-white/50">Showing</p>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{filteredRecords.length}</p>
              </div>
              <div className="rounded-2xl border border-gray-200/70 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-white/50">Selected Tab</p>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{TABS.find((tab) => tab.id === activeTab)?.label}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-0 text-sm text-left">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-[0.16em] text-gray-500 dark:bg-white/5 dark:text-white/50">
                  <th className="py-4 px-5 rounded-tl-2xl">Vendor Name</th>
                  <th className="py-4 px-5">Order ID</th>
                  <th className="py-4 px-5">Escrow Amount</th>
                  <th className="py-4 px-5">Held Since</th>
                  <th className="py-4 px-5">Release Date</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 rounded-tr-2xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200/70 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="px-5 py-4 text-gray-900 dark:text-white">{record.vendor}</td>
                      <td className="px-5 py-4 text-gray-700 dark:text-white/80 font-medium">{record.id}</td>
                      <td className="px-5 py-4 text-gray-900 dark:text-white font-semibold">{record.amount}</td>
                      <td className="px-5 py-4 text-gray-700 dark:text-white/70">{record.heldSince}</td>
                      <td className="px-5 py-4 text-gray-700 dark:text-white/70">{record.releaseDate}</td>
                      <td className="px-5 py-4">{statusBadge(record.status)}</td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {record.type === 'inEscrow' && (
                          <>
                            <Button variant="outline" size="sm">Review</Button>
                            <Button size="sm">Release</Button>
                          </>
                        )}
                        {record.type === 'readyPayout' && (
                          <>
                            <Button variant="outline" size="sm">Verify</Button>
                            <Button size="sm">Initiate Payout</Button>
                          </>
                        )}
                        {record.type === 'history' && (
                          <Button variant="outline" size="sm">Receipt</Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500 dark:text-white/50">
                      No records match your search. Try a different vendor or order ID.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
