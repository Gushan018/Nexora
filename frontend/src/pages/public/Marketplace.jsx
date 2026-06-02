import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Star, ChevronDown, Heart } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';

// Mock Data
const PRODUCTS = [
  { id: 1, name: 'Premium Gold Cutlery Set', category: 'Catering', price: 120, rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=500&q=80', vendor: 'Luxe Dining' },
  { id: 2, name: 'Crystal Chandelier Tent', category: 'Decor', price: 1500, rating: 4.9, reviews: 56, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80', vendor: 'Event Elegance' },
  { id: 3, name: 'Professional DJ Set & Lights', category: 'Entertainment', price: 850, rating: 4.7, reviews: 342, image: 'https://images.unsplash.com/photo-1571266028243-cb40f5616b37?w=500&q=80', vendor: 'SoundWave' },
  { id: 4, name: 'Floral Archway Centerpiece', category: 'Decor', price: 450, rating: 5.0, reviews: 89, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', vendor: 'Bloom Designs' },
  { id: 5, name: 'Vintage Photo Booth', category: 'Entertainment', price: 300, rating: 4.6, reviews: 210, image: 'https://images.unsplash.com/photo-1516280440502-36a5bb3b1ce1?w=500&q=80', vendor: 'Memories Inc' },
  { id: 6, name: 'Artisan Wedding Cake (3 Tier)', category: 'Catering', price: 650, rating: 4.9, reviews: 178, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&q=80', vendor: 'Sweet Treats' },
];

const CATEGORIES = ['All', 'Decor', 'Catering', 'Entertainment', 'Venue Supplies', 'Lighting'];

export const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            Event <span className="text-gradient">Marketplace</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl"
          >
            Discover and purchase premium supplies, decor, and equipment for your next unforgettable event.
          </motion.p>
        </div>

        {/* Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          <div className="flex-1">
            <Input 
              placeholder="Search products, vendors, or categories..." 
              leftIcon={<Search className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Button variant="outline" className="h-12 whitespace-nowrap" leftIcon={<Filter className="w-4 h-4" />}>
              Filters
            </Button>
            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "h-12 px-6 rounded-xl font-medium transition-all whitespace-nowrap border",
                  activeCategory === cat 
                    ? "bg-primary/20 border-primary text-primary" 
                    : "bg-surface/50 border-white/5 text-white/60 hover:bg-surface hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-white/60">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}

      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/50 transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute top-4 right-4">
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-red-400 hover:bg-black/60 transition-all border border-white/10">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white/90 border border-white/10">
            {product.category}
          </span>
        </div>
        
        {/* Quick Add Overlay */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button className="w-full" leftIcon={<ShoppingCart className="w-4 h-4" />}>
            Quick Add
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-primary mb-1 font-medium">{product.vendor}</p>
            <h3 className="text-lg font-semibold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-white">${product.price}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-white font-medium">{product.rating}</span>
          <span className="text-white/40">({product.reviews} reviews)</span>
        </div>
      </div>
    </div>
  );
};
