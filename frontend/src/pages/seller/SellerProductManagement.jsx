import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Edit2, Trash2, Package, Tag, AlertTriangle, Loader2, X, Check } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';
import { api, getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../../utils/api';

export const SellerProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoriesRes = await api.get('/categories');
      setCategories(categoriesRes.data);

      // Fetch products
      const productsRes = await api.get('/products/my-products');
      setProducts(productsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(productId);
      await api.delete(`/products/${productId}`);

      setProducts(products.filter(p => p.productId !== productId));
      setSuccessMessage('Product deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prod.productId?.toString().includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || prod.categoryId?.toString() === categoryFilter;
    const matchesStatus = statusFilter === 'all';

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Product Management
          </h1>
          <p className="text-slate-600">Manage your inventory, update pricing, and add new items.</p>
        </div>
        <Link to="/seller/add-product">
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Add Product</Button>
        </Link>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 flex items-center gap-2"
        >
          <Check className="w-5 h-5" />
          {successMessage}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search products by name or ID..." 
              className="w-full bg-surface/50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface/50 border border-white/10 rounded-xl px-4 py-2 text-textPrimary text-sm focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface/50 border border-white/10 rounded-xl px-4 py-2 text-textPrimary text-sm focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="all">All Status</option>
            </select>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-white/10 text-textPrimary/60 hover:text-textPrimary hover:border-primary/50 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/80">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
                {filteredProducts.map((prod) => (
                  <tr key={prod.productId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface border border-white/10 shrink-0 overflow-hidden">
                          <img
                            src={getImageUrl(prod.imageUrl)}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_PRODUCT_IMAGE;
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-textPrimary line-clamp-1">{prod.productName}</span>
                          <span className="text-xs text-textPrimary/50">#PRD-{prod.productId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-textPrimary/80">{prod.category?.categoryName || 'Uncategorized'}</td>
                    <td className="p-4 font-medium text-textPrimary">LKR {parseFloat(prod.price).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={cn(
                        "font-medium",
                        prod.quantity === 0 ? "text-red-400" : prod.quantity < 5 ? "text-yellow-400" : "text-textPrimary"
                      )}>
                        {prod.quantity} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-current/20 whitespace-nowrap text-green-400 bg-green-400/10">
                        Active
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/seller/edit-product/${prod.productId}`}>
                          <button
                            className="p-2 text-textPrimary/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                            disabled={deleteLoading === prod.productId}
                          >
                            <Edit2 className="w-4 h-4"/>
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(prod.productId)}
                          disabled={deleteLoading === prod.productId}
                          className="p-2 text-textPrimary/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === prod.productId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4"/>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Footer Stats */}
        {products.length > 0 && (
          <div className="p-4 border-t border-white/5 bg-white/[0.01] text-sm text-textPrimary/60">
            <p>Showing {filteredProducts.length} of {products.length} products</p>
          </div>
        )}
      </Card>
    </div>
  );
};

