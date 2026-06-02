import React from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Globe, Phone, Mail, Star, Heart, Grid, Search } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const PRODUCTS = [
  { id: 1, name: 'Premium Gold Cutlery Set', price: 120.00, rating: 4.8, image: 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=400&q=80' },
  { id: 2, name: 'Silver Chafing Dishes', price: 75.00, rating: 4.4, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80' },
  { id: 3, name: 'Crystal Wine Glasses (x12)', price: 85.00, rating: 4.9, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80' },
  { id: 4, name: 'White Silk Chair Covers', price: 5.00, rating: 4.5, image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80' },
];

export const StoreProfile = () => {
  return (
    <div className="pt-20 pb-20 min-h-screen bg-background relative">
      
      {/* Cover Photo */}
      <div className="h-64 sm:h-80 w-full relative">
        <img src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80" alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative -mt-24">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-12">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-background overflow-hidden shrink-0 relative z-10 bg-surface flex items-center justify-center">
            <Store className="w-16 h-16 text-white/20" />
            {/* If they have a logo, it would go here */}
          </div>
          
          <div className="flex-1 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Luxe Dining</h1>
                <p className="text-white/60 mb-3">Premium catering equipment and luxury tableware rentals.</p>
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Colombo 03</span>
                  <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-yellow-400"/> 4.8 (142 Reviews)</span>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none h-12 text-red-400 border-red-400/50 hover:bg-red-400/10" leftIcon={<Heart className="w-4 h-4"/>}>
                  Save Store
                </Button>
                <Button className="flex-1 sm:flex-none h-12 px-8">
                  Contact Seller
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-white mb-2">About Us</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  Luxe Dining is Sri Lanka's premier provider of luxury event equipment. We specialize in supplying high-end cutlery, premium linens, and elegant tableware for weddings and corporate events.
                </p>
                <div className="space-y-3 text-sm text-white/70 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-white/40"/> luxedining.lk</div>
                  <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-white/40"/> +94 77 123 4567</div>
                  <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-white/40"/> contact@luxedining.lk</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm bg-primary/20 text-primary font-medium">All Products (142)</button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 transition-colors">Cutlery (45)</button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 transition-colors">Glassware (32)</button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 transition-colors">Linens (65)</button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Grid className="w-5 h-5"/> Storefront</h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" placeholder="Search this store..." className="w-full bg-surface/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS.map((product) => (
                <Card key={product.id} className="overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="h-40 relative overflow-hidden bg-surface">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-bold text-white">{product.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                      <button className="text-xs font-medium text-white/60 hover:text-white px-2 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">View Details</button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline">View Full Catalog</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
