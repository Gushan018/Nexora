import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors-packages'],
    queryFn: async () => {
      const res = await api.get('/vendors');
      return res.data;
    }
  });

  const allPackages = vendors.flatMap(v => v.eventPackages?.map(pkg => ({
    ...pkg,
    vendorName: v.businessName,
    vendorId: v.vendorId
  })) || []);

  const filteredPackages = allPackages.filter(pkg => 
    pkg.packageName.toLowerCase().includes(search.toLowerCase()) || 
    pkg.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <PageLoader text="Loading Packages..." />;
  return (
    <div className={cn("pb-24 min-h-screen bg-background", !isDashboard ? "pt-40" : "pt-6")}>
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-textPrimary mb-6"
          >
            Curated Event <span className="text-gradient">Packages</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-textPrimary/60 text-lg max-w-2xl mx-auto"
          >
            Choose from our pre-designed, vendor-bundled packages to simplify your planning process. Transparent pricing, premium service.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mb-12 max-w-4xl mx-auto"
        >
          <div className="flex-1">
            <Input 
              placeholder="Search by package name or vendor..." 
              leftIcon={<Search className="w-5 h-5" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 text-base"
            />
          </div>
          <Button variant="outline" className="h-14 px-6" leftIcon={<Filter className="w-5 h-5"/>}>
            Filters
          </Button>
        </motion.div>

        {/* Pricing Cards */}
        {filteredPackages.length === 0 && (
          <div className="text-center text-textPrimary/60 py-20 text-xl">
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
              className="relative rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-2 bg-surface/50 border border-white/10 hover:border-primary/50 group flex flex-col"
            >
              <div className="mb-4">
                <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2 block">
                  By {pkg.vendorName}
                </span>
                <h3 className="text-2xl font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors">{pkg.packageName}</h3>
                <p className="text-textPrimary/60 text-sm min-h-[3rem] line-clamp-2">{pkg.description || 'No description available.'}</p>
              </div>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-textPrimary">LKR {Number(pkg.price).toFixed(2)}</span>
                <span className="text-textPrimary/40 font-medium"> / pkg</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {/* Fallback feature list since real packages might not have detailed array features yet */}
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-textPrimary/40 group-hover:text-primary transition-colors" />
                  <span className="text-textPrimary/80">Premium quality service</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-textPrimary/40 group-hover:text-primary transition-colors" />
                  <span className="text-textPrimary/80">Dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-textPrimary/40 group-hover:text-primary transition-colors" />
                  <span className="text-textPrimary/80">Customizable options</span>
                </li>
              </ul>
              
              <Button 
                variant="outline" 
                className="w-full py-6 text-lg rounded-xl group-hover:bg-primary group-hover:text-textPrimary group-hover:border-primary transition-all"
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
