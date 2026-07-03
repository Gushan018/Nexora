import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Star, ShoppingCart, Search } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { cn } from '../../utils/cn';

const PRODUCTS = [
  { id: 1, name: 'Premium Gold Cutlery Set (100 Pieces)', price: 120.00, rating: 4.8, image: 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=400&q=80', vendor: 'Luxe Dining' },
  { id: 2, name: 'White Silk Chair Covers', price: 5.00, rating: 4.5, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80', vendor: 'Event Elegance' },
  { id: 3, name: 'Crystal Centerpieces (x10)', price: 250.00, rating: 4.9, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80', vendor: 'Bloom Floral' },
  { id: 4, name: 'LED Uplights (x4)', price: 450.00, rating: 4.7, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', vendor: 'SoundWave DJs' },
  { id: 5, name: 'Rustic Wooden Arch', price: 300.00, rating: 4.6, image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80', vendor: 'Decor Masters' },
  { id: 6, name: 'Silver Chafing Dishes', price: 75.00, rating: 4.4, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80', vendor: 'Luxe Dining' },
];

export const CategoryView = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Category Header */}
        <div className="mb-8">
          <div className="text-sm text-white/40 mb-4 flex items-center gap-2">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-primary font-medium">Decor & Rentals</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Decor & Rentals</h1>
          <p className="text-white/60 max-w-2xl">Browse our extensive collection of event decorations, furniture rentals, and atmospheric lighting to make your venue unforgettable.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-64 shrink-0 space-y-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input type="text" placeholder="Search in category..." className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors" />
            </div>

            <Card className="bg-surface/30">
              <CardContent className="p-5 space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">Price Range</h3>
                  <div className="flex gap-2 items-center mb-4">
                    <input type="number" placeholder="Min" className="w-full bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none" />
                    <span className="text-white/40">-</span>
                    <input type="number" placeholder="Max" className="w-full bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none" />
                  </div>
                  <input type="range" min="0" max="1000" className="w-full accent-primary" />
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-white font-medium mb-3">Sub-Categories</h3>
                  <div className="space-y-2">
                    {['Centerpieces', 'Linens & Chair Covers', 'Lighting', 'Archways & Backdrops', 'Signage'].map(sub => (
                      <label key={sub} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-white/20 text-primary bg-surface focus:ring-primary/50" />
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-white font-medium mb-3">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2].map(rating => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="rating" className="w-4 h-4 border-white/20 text-primary bg-surface focus:ring-primary/50" />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3.5 h-3.5", i < rating ? "fill-yellow-400 text-yellow-400" : "text-white/20")} />
                          ))}
                          <span className="text-xs text-white/50 ml-1">& Up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-white/60 text-sm">Showing <span className="text-white font-medium">142</span> products</p>
              <button className="flex items-center gap-2 text-sm text-white/80 bg-surface border border-white/10 rounded-lg px-4 py-2 hover:bg-white/5 transition-colors">
                Sort by: Featured <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {PRODUCTS.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden group hover:border-primary/50 transition-colors h-full flex flex-col cursor-pointer">
                    <div className="h-48 relative overflow-hidden bg-surface">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-white">{product.rating}</span>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                        <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/80 transition-colors">
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-primary font-medium mb-1">{product.vendor}</p>
                      <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="mt-auto">
                        <span className="text-xl font-bold text-white">LKR {product.price.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">Load More Products</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
