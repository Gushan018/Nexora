import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Filter, MoreVertical, Package, ShieldCheck, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const SELLERS = [
  { id: 'SEL-401', name: 'Luxe Dining Rentals', category: 'Tableware', products: 124, location: 'Colombo, Sri Lanka', gmv: 'LKR 85,200', status: 'Verified' },
  { id: 'SEL-402', name: 'ProSound Equipment', category: 'AV Gear', products: 45, location: 'Kandy, Sri Lanka', gmv: 'LKR 112,000', status: 'Verified' },
  { id: 'SEL-403', name: 'Floral Wholesalers', category: 'Decor', products: 312, location: 'Galle, Sri Lanka', gmv: 'LKR 14,500', status: 'Pending Review' },
  { id: 'SEL-404', name: 'Cheap Party Supplies', category: 'Decor', products: 12, location: 'Unknown', gmv: 'LKR 800', status: 'Flagged' },
];

export const AdminSellerManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-primary" />
            Seller Management
          </h1>
          <p className="text-slate-600">Oversee physical product vendors, their inventory health, and fulfillment rates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Total Sellers</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">412</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Total Active Products</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">14,250</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Fulfillment Rate</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900">98.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Flagged Sellers</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-red-400">3</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-red-400 border-red-400/20 hover:bg-red-400/10">
              Review
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search sellers by store name or ID..." 
              className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>All Categories</option>
              <option>Tableware</option>
              <option>AV Gear</option>
              <option>Decor</option>
            </select>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
                <th className="p-4 pl-6">Store Details</th>
                <th className="p-4">Location</th>
                <th className="p-4">Inventory & Sales</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {SELLERS.map((seller, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{seller.name}</span>
                      <span className="text-xs text-slate-500">{seller.category} • {seller.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-xs">{seller.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-900 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-slate-500" /> 
                        {seller.products} listed
                      </span>
                      <span className="text-xs text-green-400 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {seller.gmv} YTD</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full",
                      seller.status === 'Verified' ? "bg-green-500/10 text-green-400" :
                      seller.status === 'Flagged' ? "bg-red-500/20 text-red-400 border border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {seller.status === 'Verified' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {seller.status === 'Flagged' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {seller.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Manage Store
                    </Button>
                    <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors" title="Actions">
                      <MoreVertical className="w-5 h-5"/>
                    </button>
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
