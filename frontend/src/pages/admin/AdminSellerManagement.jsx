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
      const productSellers = allVendors.filter(v => (v._count?.products || 0) > 0);
      setSellers(productSellers);
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
    sellers.reduce((sum, s) => sum + (s._count?.products || 0), 0),
  [sellers]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-primary" />
            Seller Management
          </h1>
          <p className="text-textPrimary/60">Oversee physical product vendors, their inventory health, and fulfillment rates.</p>
        </div>
        <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchSellers}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Sellers</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">{sellers.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Total Active Products</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">{totalProducts.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-textPrimary/60 mb-2">With Products</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-textPrimary">{sellers.length}</span>
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
              placeholder="Search sellers by store name or ID..."
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
              <p>Loading sellers...</p>
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center text-red-400 gap-3 text-center">
              <AlertCircle className="w-8 h-8" />
              <p>{error}</p>
              <Button onClick={fetchSellers} variant="outline" size="sm">Try Again</Button>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-textPrimary/40 gap-3 text-center">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>No sellers with products found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
                  <th className="p-4 pl-6">Store Details</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Inventory & Sales</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredSellers.map((seller) => (
                  <tr key={seller.vendorId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-textPrimary">{seller.businessName}</span>
                        <span className="text-xs text-textPrimary/50">{seller.vendorType} • SEL-{seller.vendorId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-textPrimary/80">
                        <MapPin className="w-4 h-4 text-textPrimary/40" />
                        <span className="text-xs">{seller.location || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-textPrimary flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-textPrimary/40" />
                          {seller._count?.products || 0} products
                        </span>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3"/> {seller._count?.services || 0} services
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
                        onClick={() => navigate(`/admin/user/${seller.vendorId}?type=vendor`)}
                      >
                        Manage Store
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
