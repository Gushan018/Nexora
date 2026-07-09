import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Store, Search, Filter, MoreVertical, Star, ShieldCheck, MapPin, TrendingUp, AlertCircle, Loader2, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

export const AdminVendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/vendors');
      setVendors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load vendors. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return vendors;
    return vendors.filter(v =>
      [v.businessName, v.email, `VND-${v.vendorId}`].some(val => val?.toString().toLowerCase().includes(query))
    );
  }, [vendors, searchTerm]);

  const stats = useMemo(() => ({
    total: vendors.length,
    topPerformers: vendors.filter(v => v.averageRating >= 4.5).length,
    atRisk: vendors.filter(v => v.averageRating < 3 && v._count?.reviews > 0).length,
  }), [vendors]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            Vendor Ecosystem
          </h1>
          <p className="text-textPrimary/60">Monitor vendor performance, verification status, and quality control.</p>
        </div>
        <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchVendors}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Vendors</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{stats.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Top Performers (4.8+ <Star className="w-3 h-3 inline"/>)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-accent">{stats.topPerformers}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Vendors</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-textPrimary/60 mb-2">At Risk (Quality)</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-yellow-500">{stats.atRisk}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input
              type="text"
              placeholder="Search vendors by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-textPrimary/40 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading vendors...</p>
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center text-red-400 gap-3 text-center">
              <AlertCircle className="w-8 h-8" />
              <p>{error}</p>
              <Button onClick={fetchVendors} variant="outline" size="sm">Try Again</Button>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-textPrimary/40 gap-3 text-center">
              <Store className="w-12 h-12 opacity-20" />
              <p>No vendors found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
                  <th className="p-4 pl-6">Business</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Performance</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.vendorId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-textPrimary">{vendor.businessName}</span>
                        <span className="text-xs text-textPrimary/50">{vendor.vendorType} • VND-{vendor.vendorId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-textPrimary/80">
                        <MapPin className="w-4 h-4 text-textPrimary/40" />
                        <span className="text-xs">{vendor.location || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-textPrimary flex items-center gap-1">
                          <Star className={cn("w-3.5 h-3.5", vendor.averageRating >= 4.5 ? "text-yellow-400 fill-yellow-400" : vendor.averageRating < 3 ? "text-red-400" : "text-yellow-400")} />
                          {vendor.averageRating?.toFixed(1) || 'N/A'}
                        </span>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3"/> {vendor._count?.services || 0} services
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => navigate(`/admin/user/${vendor.vendorId}?type=vendor`)}
                      >
                        Manage
                      </Button>
                      <button className="p-2 text-textPrimary/40 hover:text-textPrimary hover:bg-white/10 rounded-lg transition-colors" title="Actions">
                        <MoreVertical className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};
