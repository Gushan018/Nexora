import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, ShieldAlert, Check, Trash2, Eye, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

export const ProductModeration = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products');
      setProducts(Array.isArray(response.data) ? response.data : (response.data?.products || []));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) =>
      [p.productName, p.category?.categoryName, p.vendor?.businessName, `PRD-${p.productId}`].some(val => val?.toString().toLowerCase().includes(query))
    );
  }, [products, searchTerm]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Product Moderation
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Review physical products, catalog items, and seller listings in real-time.</p>
        </div>
        <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchProducts}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Live Products</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{products.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">In Stock Products</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-500">
                {products.filter(p => (p.quantity || 0) > 0).length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300 dark:border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Out of Stock</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {products.filter(p => (p.quantity || 0) === 0).length}
              </span>
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
              placeholder="Search by Product Name, ID, or Seller..." 
              className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchProducts}>Refresh</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 uppercase tracking-wider">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">Seller Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No products found in database.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.productId} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-slate-500">
                          {product.imageUrl ? <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-slate-400" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white">{product.productName}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">PRD-{product.productId} • LKR {Number(product.price).toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-800 dark:text-slate-200">
                      <span className="block font-medium">{product.vendor?.businessName || 'N/A'}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">SEL-{product.vendorId}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded text-xs text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">
                        {product.category?.categoryName || 'General'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold",
                        (product.quantity || 0) > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {(product.quantity || 0) > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
