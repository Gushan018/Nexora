import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Edit2, Trash2, Package, Tag, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

const PRODUCTS = [
  { id: '#PRD-01', name: 'Premium Gold Cutlery Set', category: 'Catering Supplies', price: '$120.00', stock: 45, status: 'Active' },
  { id: '#PRD-02', name: 'Crystal Wine Glasses (Set of 12)', category: 'Catering Supplies', price: '$85.00', stock: 12, status: 'Active' },
  { id: '#PRD-03', name: 'Silk Table Linens', category: 'Decor', price: '$45.00', stock: 0, status: 'Out of Stock' },
  { id: '#PRD-04', name: 'LED Uplights (x4)', category: 'Lighting', price: '$450.00', stock: 8, status: 'Draft' },
  { id: '#PRD-05', name: 'Rustic Wooden Arch', category: 'Decor', price: '$300.00', stock: 2, status: 'Low Stock' },
];

export const SellerProductManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Product Management
          </h1>
          <p className="text-white/60">Manage your inventory, update pricing, and add new items.</p>
        </div>
        <Link to="/seller/add-product">
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Add Product</Button>
        </Link>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search products by name or ID..." 
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Category</Button>
            <Button variant="outline" leftIcon={<Tag className="w-4 h-4"/>}>Status</Button>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {PRODUCTS.map((prod, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface border border-white/10 shrink-0 overflow-hidden">
                         <img src={`https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=100&q=80&${i}`} alt="" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white line-clamp-1">{prod.name}</span>
                        <span className="text-xs text-white/50">{prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white/80">{prod.category}</td>
                  <td className="p-4 font-medium text-white">{prod.price}</td>
                  <td className="p-4">
                    <span className={cn(
                      "font-medium",
                      prod.stock === 0 ? "text-red-400" : prod.stock < 5 ? "text-yellow-400" : "text-white"
                    )}>
                      {prod.stock} in stock
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border border-current/20 whitespace-nowrap",
                      prod.status === 'Active' ? "text-green-400 bg-green-400/10" : 
                      prod.status === 'Draft' ? "text-white/60 bg-white/10" : 
                      prod.status === 'Low Stock' ? "text-yellow-400 bg-yellow-400/10" :
                      "text-red-400 bg-red-400/10"
                    )}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-white/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      <button className="p-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
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
