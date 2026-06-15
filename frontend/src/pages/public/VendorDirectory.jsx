import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { Link, useSearchParams } from 'react-router-dom';
import { PageLoader } from '../../components/common/PageLoader';

// Mock data removed

export const VendorDirectory = ({ isDashboard = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = [searchParams.get('query'), searchParams.get('location')].filter(Boolean).join(' ');
  const [search, setSearch] = useState(initialSearch || '');

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await api.get('/vendors');
      return res.data;
    }
  });

  const filteredVendors = vendors.filter(vendor => 
    vendor.businessName.toLowerCase().includes(search.toLowerCase()) || 
    (vendor.vendorType && vendor.vendorType.toLowerCase().includes(search.toLowerCase())) ||
    (vendor.location && vendor.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={cn("pb-20 min-h-screen bg-background", !isDashboard ? "pt-40" : "pt-6")}>
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            Vendor <span className="text-gradient">Directory</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg max-w-2xl"
          >
            Find and connect with Sri Lanka's top-rated event professionals.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mb-10"
        >
          <div className="flex-1">
            <Input 
              placeholder="Search by vendor name, category, or location..." 
              leftIcon={<Search className="w-5 h-5" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 text-base"
            />
          </div>
          <Button variant="outline" className="h-14 px-6" leftIcon={<Filter className="w-5 h-5"/>}>
            More Filters
          </Button>
        </motion.div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && <PageLoader text="Loading vendors..." />}
          {!isLoading && filteredVendors.length === 0 && (
             <div className="col-span-2 text-center text-slate-600 py-12">No vendors match your search.</div>
          )}
          {filteredVendors.map((vendor, index) => {
            const avgRating = vendor.reviews?.length 
              ? (vendor.reviews.reduce((acc, curr) => acc + curr.rating, 0) / vendor.reviews.length).toFixed(1)
              : 'New';

            return (
              <Link to={`/customer/book-vendor?id=${vendor.vendorId}`} key={vendor.vendorId}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.1, 1) }}
                  className="glass-card rounded-2xl p-6 border border-slate-200 hover:border-primary/50 transition-all duration-300 group cursor-pointer flex flex-col sm:flex-row gap-6 h-full"
                >
                  <div className="w-full sm:w-40 h-40 shrink-0 rounded-xl overflow-hidden bg-surface relative flex items-center justify-center text-slate-300">
                    <span className="text-4xl font-bold">{vendor.businessName.charAt(0)}</span>
                    {vendor.isApproved && (
                      <div className="absolute top-2 left-2 bg-green-500 text-slate-900 rounded-full p-1 shadow-lg" title="Verified Vendor">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">
                          {vendor.vendorType}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{vendor.businessName}</h3>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {vendor.description || 'No description available.'}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-800">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{avgRating}</span>
                          <span className="text-slate-500">({vendor.reviews?.length || 0})</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-4 h-4" />
                          {vendor.location || 'Anywhere'}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-10 w-10 bg-slate-100 hover:bg-primary/20 hover:text-primary">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
};
