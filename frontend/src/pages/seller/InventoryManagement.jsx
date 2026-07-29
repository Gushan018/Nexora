import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Package, AlertTriangle, CheckCircle2, XCircle, Plus, Minus, Edit3, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { cn } from '../../utils/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getImageUrl } from '../../utils/api';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export const InventoryManagement = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-inventory'],
    queryFn: async () => {
      const res = await api.get('/products/my-products');
      return res.data;
    }
  });

  const categories = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const set = new Set();
    products.forEach(p => {
      if (p.category?.categoryName) set.add(p.category.categoryName);
    });
    return Array.from(set);
  }, [products]);

  const updateStockMutation = useMutation({
    mutationFn: async ({ productId, newQuantity }) => {
      setUpdatingId(productId);
      await api.put(`/products/${productId}`, { quantity: newQuantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['seller-inventory']);
      queryClient.invalidateQueries(['seller-products']);
      showToast('Stock quantity updated successfully!', 'success');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to update stock', 'error');
    },
    onSettled: () => {
      setUpdatingId(null);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      await api.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['seller-inventory']);
      queryClient.invalidateQueries(['seller-products']);
      setItemToDelete(null);
      showToast('Item deleted from inventory.', 'success');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to delete item', 'error');
    }
  });

  const handleStockChange = (productId, currentQty, delta) => {
    const nextQty = Math.max(0, currentQty + delta);
    updateStockMutation.mutate({ productId, newQuantity: nextQty });
  };

  const handleDirectQuantityChange = (productId, value) => {
    const nextQty = Math.max(0, parseInt(value) || 0);
    updateStockMutation.mutate({ productId, newQuantity: nextQty });
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((prod) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query || (
        prod.productName?.toLowerCase().includes(query) ||
        prod.productId?.toString().includes(query) ||
        prod.description?.toLowerCase().includes(query)
      );

      const matchesCategory = categoryFilter === 'ALL' || prod.category?.categoryName === categoryFilter;

      let matchesStock = true;
      if (stockFilter === 'IN_STOCK') {
        matchesStock = prod.quantity > 10;
      } else if (stockFilter === 'LOW_STOCK') {
        matchesStock = prod.quantity > 0 && prod.quantity <= 10;
      } else if (stockFilter === 'OUT_OF_STOCK') {
        matchesStock = prod.quantity === 0;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const stats = useMemo(() => {
    if (!Array.isArray(products)) return { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 };
    return {
      total: products.length,
      inStock: products.filter(p => p.quantity > 10).length,
      lowStock: products.filter(p => p.quantity > 0 && p.quantity <= 10).length,
      outOfStock: products.filter(p => p.quantity === 0).length
    };
  }, [products]);

  return (
    <div className="space-y-6 pb-12 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-amber-500 dark:text-amber-400" />
            Inventory Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Track stock levels, update inventory quantities, and manage low-stock alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Link to="/seller/add-product">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none" leftIcon={<Plus className="w-4 h-4" />}>
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Listed Products</h3>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5 dark:bg-[#151D2F]">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">In Stock ({'>'}10 units)</h3>
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.inStock}</span>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20 bg-yellow-500/5 dark:bg-[#151D2F]">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">Low Stock Warning (1-10)</h3>
            <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.lowStock}</span>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5 dark:bg-[#151D2F]">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Out of Stock (0)</h3>
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.outOfStock}</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory by product name or ID..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" 
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock ({'>'}10)</option>
              <option value="LOW_STOCK">Low Stock (1-10)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> Loading inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
            <p className="font-medium text-base text-slate-800 dark:text-white">No inventory items match your criteria</p>
            <p className="text-sm mt-1">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/80">
                  <th className="p-4 pl-6">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Quick Stock Adjust</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredProducts.map((prod) => {
                  const isLow = prod.quantity > 0 && prod.quantity <= 10;
                  const isOut = prod.quantity === 0;

                  return (
                    <tr key={prod.productId} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(prod.imageUrl)}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-white/10 shrink-0"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-white">{prod.productName}</span>
                            <span className="text-xs text-slate-500">#PRD-{prod.productId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                        {prod.category?.categoryName || 'Uncategorized'}
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        LKR {parseFloat(prod.price).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStockChange(prod.productId, prod.quantity, -1)}
                            disabled={updatingId === prod.productId || prod.quantity === 0}
                            className="p-1 rounded-md border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-40"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={prod.quantity}
                            onChange={(e) => handleDirectQuantityChange(prod.productId, e.target.value)}
                            disabled={updatingId === prod.productId}
                            className="w-16 text-center font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-1 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleStockChange(prod.productId, prod.quantity, 1)}
                            disabled={updatingId === prod.productId}
                            className="p-1 rounded-md border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-emerald-500 hover:text-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <XCircle className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <AlertTriangle className="w-3.5 h-3.5" /> Low ({prod.quantity})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({prod.quantity})
                          </span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/seller/edit-product/${prod.productId}`}>
                            <button className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 hover:border-amber-500 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(prod)}
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 hover:border-rose-500 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Sleek Custom System Confirmation Modal */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => itemToDelete && deleteProductMutation.mutate(itemToDelete.productId)}
        title="Delete Inventory Item"
        message={`Are you sure you want to delete "${itemToDelete?.productName}" from your inventory? This action cannot be undone.`}
        confirmText="Delete Item"
        isDanger={true}
        isLoading={deleteProductMutation.isPending}
      />
    </div>
  );
};
