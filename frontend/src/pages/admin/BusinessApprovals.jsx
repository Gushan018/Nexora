import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Search, Filter, Check, X, FileText, Building, AlertTriangle, 
  CreditCard, ExternalLink, RefreshCcw, Eye, Phone, MapPin, Globe, CheckCircle2, DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export const BusinessApprovals = () => {
  const { showToast } = useToast();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchPendingVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/vendors/pending');
      setVendors(res.data || []);
    } catch (err) {
      console.error('Error fetching pending vendors:', err);
      showToast(err.response?.data?.message || 'Failed to load pending registrations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const handleApprove = async (vendorId, name) => {
    try {
      setActionLoadingId(vendorId);
      const res = await api.put(`/admin/vendors/${vendorId}/approve`);
      showToast(res.data.message || `${name} has been approved and activated!`, 'success');
      fetchPendingVendors();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve vendor.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (vendorId, name) => {
    if (!window.confirm(`Are you sure you want to reject the registration for ${name}?`)) return;
    try {
      setActionLoadingId(vendorId);
      const res = await api.put(`/admin/vendors/${vendorId}/reject`);
      showToast(res.data.message || `${name} registration has been rejected.`, 'info');
      fetchPendingVendors();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject vendor.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getAccountLabel = (vendorType) => {
    if (vendorType === 'RENTAL') return { label: 'Product Seller', fee: 4000, color: 'bg-blue-500/15 text-blue-600 border-blue-300' };
    if (vendorType === 'EVENT_COMPANY') return { label: 'Event Management', fee: 5000, color: 'bg-purple-500/15 text-purple-600 border-purple-300' };
    return { label: 'Service Provider', fee: 3500, color: 'bg-amber-500/15 text-amber-600 border-amber-300' };
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    if (typeFilter === 'ALL') return matchesSearch;
    if (typeFilter === 'VENDOR') return matchesSearch && v.vendorType !== 'RENTAL' && v.vendorType !== 'EVENT_COMPANY';
    if (typeFilter === 'SELLER') return matchesSearch && v.vendorType === 'RENTAL';
    if (typeFilter === 'COMPANY') return matchesSearch && v.vendorType === 'EVENT_COMPANY';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-primary" />
            Registration & Payment Approvals
          </h1>
          <p className="text-gray-600 dark:text-white/60">
            Verify initial payments and approve user registration for Service Providers, Sellers, and Event Companies.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchPendingVendors}
          leftIcon={<RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />}
        >
          Refresh List
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-5">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-white/70">Total Pending Review</h3>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">
              {vendors.length}
            </div>
            <p className="text-[11px] text-yellow-600/70 mt-1">Awaiting admin decision</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-5">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-white/70">Service Providers (RS 3,500)</h3>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-500 mt-1">
              {vendors.filter(v => v.vendorType !== 'RENTAL' && v.vendorType !== 'EVENT_COMPANY').length}
            </div>
            <p className="text-[11px] text-amber-600/70 mt-1">Vendors & Specialists</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-5">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-white/70">Product Sellers (RS 4,000)</h3>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {vendors.filter(v => v.vendorType === 'RENTAL').length}
            </div>
            <p className="text-[11px] text-blue-600/70 mt-1">Shop & Rental Stores</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-5">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-white/70">Event Companies (RS 5,000)</h3>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {vendors.filter(v => v.vendorType === 'EVENT_COMPANY').length}
            </div>
            <p className="text-[11px] text-purple-600/70 mt-1">Planner Organizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business name, email, BRN, location..." 
              className="w-full bg-slate-50 dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors" 
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-surface border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary cursor-pointer w-full sm:w-auto"
            >
              <option value="ALL">Filter: All Types</option>
              <option value="VENDOR">Service Providers (RS 3500)</option>
              <option value="SELLER">Product Sellers (RS 4000)</option>
              <option value="COMPANY">Event Companies (RS 5000)</option>
            </select>
          </div>
        </div>

        {/* Vendors Table / Cards */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500 dark:text-white/60">
              <RefreshCcw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              Loading pending registrations...
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-white/60">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500 opacity-60" />
              <h3 className="font-bold text-gray-900 dark:text-white text-base">No Pending Approvals</h3>
              <p className="text-xs text-gray-500 dark:text-white/50 mt-1">All user registrations have been reviewed.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-white/50 bg-slate-50 dark:bg-white/[0.02]">
                  <th className="p-4 pl-6">Business Details</th>
                  <th className="p-4">Account Type</th>
                  <th className="p-4">Initial Fee</th>
                  <th className="p-4">Payment Info</th>
                  <th className="p-4">Contact Details</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200 dark:divide-white/5">
                {filteredVendors.map((vendor) => {
                  const accountInfo = getAccountLabel(vendor.vendorType);
                  const feeAmount = vendor.vendorType === 'EVENT_COMPANY' ? 5000 : (vendor.vendorType === 'RENTAL' ? 4000 : 3500);
                  return (
                    <tr key={vendor.vendorId} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-base">
                            <Building className="w-4 h-4 text-primary shrink-0" />
                            {vendor.businessName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-white/50 mt-0.5">
                            {vendor.email}
                          </span>
                          {vendor.registrationNumber && (
                            <span className="text-[11px] text-gray-400 dark:text-white/40 mt-0.5">
                              BRN: {vendor.registrationNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold border inline-block", accountInfo.color)}>
                          {accountInfo.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                          RS {feeAmount.toLocaleString()}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Initial Payment</span>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-gray-800 dark:text-white flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5 text-primary" />
                            {vendor.registrationPaymentMethod === 'BANK_SLIP' ? 'Bank Transfer' : 'Online Card'}
                          </span>
                          {vendor.registrationTransactionId && (
                            <span className="text-[11px] text-gray-500 dark:text-white/60 block font-mono">
                              Ref: {vendor.registrationTransactionId}
                            </span>
                          )}
                          {vendor.registrationPaymentReceipt && (
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(vendor.registrationPaymentReceipt)}
                              className="text-xs text-primary hover:underline font-bold flex items-center gap-1 mt-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect Bank Receipt
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-xs space-y-1 text-gray-700 dark:text-white/80">
                          {vendor.contactNumber && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" /> {vendor.contactNumber}
                            </div>
                          )}
                          {vendor.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" /> {vendor.location}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm"
                            isLoading={actionLoadingId === vendor.vendorId}
                            onClick={() => handleApprove(vendor.vendorId, vendor.businessName)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white border-none" 
                            leftIcon={<Check className="w-4 h-4"/>}
                          >
                            Approve Account
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            isLoading={actionLoadingId === vendor.vendorId}
                            onClick={() => handleReject(vendor.vendorId, vendor.businessName)}
                            className="text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10" 
                            leftIcon={<X className="w-4 h-4"/>}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface border border-white/10 rounded-3xl p-6 max-w-lg w-full relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Payment Receipt Inspection
            </h3>
            <div className="max-h-[70vh] overflow-auto rounded-xl border bg-black/5 flex items-center justify-center p-2">
              <img src={selectedReceipt} alt="Bank Slip Receipt" className="max-w-full max-h-[60vh] object-contain rounded-lg" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setSelectedReceipt(null)}>Close Inspection</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
