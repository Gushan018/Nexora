import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Filter, MoreVertical, Package, ShieldCheck, MapPin, TrendingUp, AlertTriangle, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

export const AdminSellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/vendors');
      const allVendors = Array.isArray(response.data) ? response.data : [];
      setSellers(allVendors);
    } catch (err) {
      setError('Failed to load sellers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return sellers;
    return sellers.filter(s =>
      [s.businessName, `SEL-${s.vendorId}`].some(val => val?.toString().toLowerCase().includes(query))
    );
  }, [sellers, searchTerm]);

  const totalProducts = useMemo(() =>
    sellers.reduce((sum, s) => sum + (s.products?.length || s._count?.products || 0), 0),
  [sellers]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-primary" />
            Seller Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Oversee physical product vendors, their inventory health, and fulfillment rates.</p>
        </div>
        <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchSellers}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Sellers</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{sellers.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Total Active Products</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-500">{totalProducts.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Fulfillment Rate</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Flagged / Blocked Sellers</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-red-500">{sellers.filter(s => s.isBlocked).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sellers by store name or ID..." 
              className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>} onClick={fetchSellers}>Refresh</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 dark:border-white/10 text-xs font-bold bg-slate-200/80 dark:bg-slate-800/90 uppercase tracking-wider">
                <th className="p-4 pl-6 text-slate-900 dark:text-slate-100">Store Details</th>
                <th className="p-4 text-slate-900 dark:text-slate-100">Location</th>
                <th className="p-4 text-slate-900 dark:text-slate-100">Inventory & Services</th>
                <th className="p-4 text-slate-900 dark:text-slate-100">Status</th>
                <th className="p-4 pr-6 text-right text-slate-900 dark:text-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
                {filteredSellers.map((seller) => (
                  <tr key={seller.vendorId} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{seller.businessName}</span>
                        <span className="text-xs text-slate-500 dark:text-white/50">{seller.vendorType || 'Vendor'} • SEL-{seller.vendorId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-white/80">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium">{seller.location || 'Sri Lanka'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          {seller.products?.length || seller._count?.products || 0} products
                        </span>
                        <span className="text-xs text-green-500 flex items-center gap-1 font-medium">
                          <TrendingUp className="w-3 h-3"/> {seller.services?.length || seller._count?.services || 0} services
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn("flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full", seller.isBlocked ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500")}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {seller.isBlocked ? 'Blocked' : 'Verified'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/user/${seller.vendorId}?type=vendor`)}
                      >
                        Manage Store
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
    </div>
  );
};

