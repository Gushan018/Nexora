import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Star, ChevronDown, CheckSquare, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const AdvancedSearch = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-7 h-7 text-primary" />
            Discover Vendors & Venues
          </h1>
          <p className="text-white/60">Find exactly what you need with our advanced filters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Service Category</h3>
                <div className="space-y-2 text-sm text-white/60">
                  {['Venues', 'Photography', 'Catering', 'Entertainment', 'Decor'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                      <input type="checkbox" className="accent-primary" /> {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <h3 className="text-sm font-bold text-white">Price Range</h3>
                <input type="range" min="0" max="10000" className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-white/40">
                  <span>LKR 0</span>
                  <span>LKR 10,000+</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <h3 className="text-sm font-bold text-white">Location</h3>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type="text" placeholder="City or zip code" className="w-full bg-surface border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <h3 className="text-sm font-bold text-white">Minimum Rating</h3>
                <div className="flex gap-2">
                  {[4, 4.5, 5].map(rating => (
                    <button key={rating} className="flex items-center gap-1 px-2 py-1 bg-surface border border-white/10 rounded-lg text-sm text-white hover:border-primary transition-colors">
                      {rating} <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search for 'Beachfront Venues'..." 
              className="w-full bg-surface/50 border border-white/10 rounded-xl pl-14 pr-4 py-4 text-lg text-white focus:outline-none focus:border-primary transition-colors" 
            />
            <Button className="absolute right-2 top-2 bottom-2" variant="primary">Search</Button>
          </div>

          <div className="flex justify-between items-center text-sm text-white/60">
            <span>Showing 42 results</span>
            <div className="flex items-center gap-2">
              Sort by: 
              <select className="bg-transparent text-white border-none outline-none font-medium cursor-pointer">
                <option>Recommended</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(item => (
              <Card key={item} className="overflow-hidden hover:border-primary/50 transition-colors group cursor-pointer flex flex-col">
                <div className="h-48 bg-surface relative">
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-400"/> Featured
                  </div>
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/> 4.9
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors">Grand Azure Resort</h3>
                    <p className="text-sm text-white/60 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5" /> Kandy, Sri Lanka
                    </p>
                    <p className="text-sm text-white/70 line-clamp-2">
                      A breathtaking beachfront venue perfect for sunset ceremonies and grand receptions.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-end">
                    <div>
                      <span className="text-xs text-white/40 block">Starting from</span>
                      <span className="font-bold text-white">LKR 4,500</span>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="outline">Load More Results</Button>
          </div>
        </div>

      </div>
    </div>
  );
};
