import React from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, ShieldAlert, Check, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const PRODUCTS = [
  { id: 'PRD-1092', name: 'Replica Designer Serving Tray', seller: 'Cheap Party Supplies', category: 'Decor', price: '$15.00', flag: 'Potential Counterfeit', risk: 'High', status: 'Pending Review' },
  { id: 'PRD-1093', name: 'Industrial Heat Lamp', seller: 'ProSound Equipment', category: 'Equipment', price: '$450.00', flag: 'Missing Safety Docs', risk: 'Medium', status: 'Pending Review' },
  { id: 'PRD-1094', name: 'Vintage Silver Cutlery Set', seller: 'Luxe Dining Rentals', category: 'Tableware', price: '$85.00/day', flag: 'Image Copyright Claim', risk: 'Low', status: 'Resolved' },
];

export const ProductModeration = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Product Moderation
          </h1>
          <p className="text-white/60">Review flagged physical products for policy violations (counterfeits, banned items, copyright).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">High Risk Flags</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-red-400">14</span>
            </div>
            <p className="text-xs text-red-400/60 mt-2">Requires immediate takedown</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Total Pending Review</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-500">142</span>
            </div>
            <p className="text-xs text-yellow-500/60 mt-2">AI-flagged or User-reported</p>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Items Removed (YTD)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">4,215</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-2">AI Accuracy Score</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-white">94.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by Product Name, ID, or Seller..." 
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Filter by Risk: All</option>
              <option>Risk: High</option>
              <option>Risk: Medium</option>
              <option>Risk: Low</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>More Filters</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">Seller Info</th>
                <th className="p-4">Violation Flag</th>
                <th className="p-4">System Risk</th>
                <th className="p-4 pr-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {PRODUCTS.map((product, i) => (
                <tr key={i} className={cn(
                  "border-b border-white/5 transition-colors group",
                  product.risk === 'High' && product.status === 'Pending Review' ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-white/[0.02]"
                )}>
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-surface overflow-hidden shrink-0">
                        <img src={`https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80`} alt="Product" className="w-full h-full object-cover opacity-50 mix-blend-luminosity" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{product.name}</span>
                        <span className="text-xs text-white/50">{product.id} • {product.price}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white/80">
                    <span className="block font-medium">{product.seller}</span>
                    <span className="text-xs text-white/40">ID: SEL-{Math.floor(Math.random() * 900) + 100}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-surface border border-white/10 rounded text-xs text-white/80 font-medium whitespace-nowrap">
                      {product.flag}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-bold w-fit",
                      product.risk === 'High' ? "text-red-400" : 
                      product.risk === 'Medium' ? "text-yellow-500" :
                      "text-green-400"
                    )}>
                      {product.risk === 'High' && <ShieldAlert className="w-3.5 h-3.5" />}
                      {product.risk === 'Medium' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {product.risk}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {product.status === 'Pending Review' ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="text-green-400 border-green-400/20 hover:bg-green-400/10" title="Approve & Ignore Flag">
                          <Check className="w-4 h-4"/>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-400 border-red-400/20 hover:bg-red-400/10" title="Delete Product">
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4"/>
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Resolved</span>
                    )}
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
