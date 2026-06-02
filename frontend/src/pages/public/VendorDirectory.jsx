import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';

const VENDORS = [
  { id: 1, name: 'Elite Photography Studio', category: 'Photography', rating: 4.9, reviews: 312, location: 'Colombo, LK', verified: true, image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500&q=80', description: 'Award-winning wedding and corporate event photography.' },
  { id: 2, name: 'Luxe Dining Catering', category: 'Catering', rating: 4.8, reviews: 189, location: 'Kandy, LK', verified: true, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80', description: 'Premium multi-cuisine catering for high-end events.' },
  { id: 3, name: 'SoundWave DJs', category: 'Entertainment', rating: 4.6, reviews: 87, location: 'Galle, LK', verified: false, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80', description: 'Professional DJ setups, lighting, and sound engineering.' },
  { id: 4, name: 'Bloom Floral Designs', category: 'Decor', rating: 5.0, reviews: 45, location: 'Colombo, LK', verified: true, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', description: 'Bespoke floral arrangements and venue styling.' },
];

export const VendorDirectory = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="pt-40 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Vendor <span className="text-gradient">Directory</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl"
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
          {VENDORS.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 border border-white/5 hover:border-primary/50 transition-all duration-300 group cursor-pointer flex flex-col sm:flex-row gap-6"
            >
              <div className="w-full sm:w-40 h-40 shrink-0 rounded-xl overflow-hidden bg-surface relative">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {vendor.verified && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1 shadow-lg" title="Verified Vendor">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">
                      {vendor.category}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{vendor.name}</h3>
                  </div>
                </div>
                
                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                  {vendor.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-white/80">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{vendor.rating}</span>
                      <span className="text-white/40">({vendor.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <MapPin className="w-4 h-4" />
                      {vendor.location}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 hover:bg-primary/20 hover:text-primary">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
