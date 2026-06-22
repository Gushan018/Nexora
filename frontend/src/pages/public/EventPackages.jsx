import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ChevronRight, Calendar, Search, Filter } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';
import { useNavigate } from 'react-router-dom';

export const EventPackages = ({ isDashboard = false }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const CATEGORIES = ['All', 'PHOTOGRAPHER', 'CATERING', 'DJ', 'EVENT_COMPANY', 'OTHER'];

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors-packages'],
    queryFn: async () => {
      const res = await api.get('/vendors');
      return res.data;
    }
  });

  const allPackages = vendors.flatMap(v => v.eventPackages?.map(pkg => {
    // Calculate avg rating for vendor
    const avgRating = v.reviews?.length ? v.reviews.reduce((acc, curr) => acc + curr.rating, 0) / v.reviews.length : 0;
    return {
      ...pkg,
      vendorName: v.businessName,
      vendorId: v.vendorId,
      vendorType: v.vendorType,
      vendorRating: avgRating
    };
  }) || []);

  const filteredPackages = allPackages.filter(pkg => {
    const matchesSearch = pkg.packageName.toLowerCase().includes(search.toLowerCase()) || 
                          pkg.vendorName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || pkg.vendorType === activeCategory;
    const matchesMinPrice = minPrice === '' || Number(pkg.price) >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || Number(pkg.price) <= Number(maxPrice);
    const matchesRating = minRating === '' || pkg.vendorRating >= Number(minRating);
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
    if (sortBy === 'name-asc') return a.packageName.localeCompare(b.packageName);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  if (isLoading) return <PageLoader text="Loading Packages..." />;
  return (
    <div className={cn("pb-24 min-h-screen bg-background", !isDashboard ? "pt-40" : "pt-6")}>
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          >
            Curated Event <span className="text-gradient">Packages</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg max-w-2xl mx-auto"
          >
            Choose from our pre-designed, vendor-bundled packages to simplify your planning process. Transparent pricing, premium service.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 items-start justify-between mb-8"
        >
          <div className="w-full">
            <Input 
              placeholder="Search by package name or vendor..." 
              leftIcon={<Search className="w-5 h-5" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="flex overflow-x-auto pb-2 md:pb-0 md:flex-wrap items-center gap-3 scrollbar-hide w-full">
            <Button 
              variant={showFilters ? "primary" : "outline"} 
              className="h-12 whitespace-nowrap shrink-0" 
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 px-4 rounded-xl border border-slate-200 bg-surface/50 text-slate-600 focus:outline-none focus:border-primary/50 shrink-0"
            >
              <option value="newest">Newest Packages</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 h-12 rounded-xl text-sm font-medium transition-all duration-300 border shrink-0 whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-surface/50 text-slate-600 border-slate-200 hover:border-primary/30 hover:text-primary"
                )}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12 max-w-4xl mx-auto"
            >
              <div className="p-6 bg-surface/50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-slate-900">Advanced Filters</h3>
                  <button onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    setMinRating('');
                  }} className="text-sm text-primary hover:underline">
                    Clear Filters
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Price Range (LKR)</label>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <span className="text-slate-400">-</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Minimum Vendor Rating</label>
                    <select 
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-surface text-slate-600 focus:outline-none focus:border-primary/50"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4 Stars & Above</option>
                      <option value="3">3 Stars & Above</option>
                      <option value="2">2 Stars & Above</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Cards */}
        {filteredPackages.length === 0 && (
          <div className="text-center text-slate-600 py-20 text-xl">
            No packages match your search.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.packageId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-2 bg-surface/50 border border-slate-300 hover:border-primary/50 group flex flex-col"
            >
              <div className="mb-4">
                <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2 block">
                  By {pkg.vendorName}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{pkg.packageName}</h3>
                <p className="text-slate-600 text-sm min-h-[3rem] line-clamp-2">{pkg.description || 'No description available.'}</p>
              </div>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">LKR {Number(pkg.price).toFixed(2)}</span>
                <span className="text-slate-500 font-medium"> / pkg</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {/* Fallback feature list since real packages might not have detailed array features yet */}
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-slate-500 group-hover:text-primary transition-colors" />
                  <span className="text-slate-800">Premium quality service</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-slate-500 group-hover:text-primary transition-colors" />
                  <span className="text-slate-800">Dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-slate-500 group-hover:text-primary transition-colors" />
                  <span className="text-slate-800">Customizable options</span>
                </li>
              </ul>
              
              <Button 
                variant="outline" 
                className="w-full py-6 text-lg rounded-xl group-hover:bg-primary group-hover:text-slate-900 group-hover:border-primary transition-all"
                onClick={() => navigate(`/customer/book-vendor?id=${pkg.vendorId}`)}
              >
                Book Package
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
