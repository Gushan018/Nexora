import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingCart, Star, ChevronDown, Heart, X } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { PageLoader } from '../../components/common/PageLoader';
import { useAuth } from '../../context/AuthContext';

// No mock data needed here anymore

const CATEGORIES = ['All', 'Decor', 'Catering', 'Entertainment', 'Venue Supplies', 'Lighting'];

export const Marketplace = ({ isDashboard = false }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const { user } = useAuth();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    }
  });

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!user) return [];
      const res = await api.get('/wishlist/my');
      return res.data;
    },
    enabled: !!user
  });
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || (p.category?.categoryName || 'Uncategorized') === activeCategory;
    const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMinPrice = minPrice === '' || Number(p.price) >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || Number(p.price) <= Number(maxPrice);
    
    // Average rating calculation
    const avgRating = p.reviews?.length ? p.reviews.reduce((acc, curr) => acc + curr.rating, 0) / p.reviews.length : 0;
    const matchesRating = minRating === '' || avgRating >= Number(minRating);

    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
    if (sortBy === 'name-asc') return a.productName.localeCompare(b.productName);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className={cn("pb-20 min-h-screen bg-background", !isDashboard ? "pt-32" : "pt-6")}>
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            Event <span className="text-gradient">Marketplace</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg max-w-2xl"
          >
            Discover and purchase premium supplies, decor, and equipment for your next unforgettable event.
          </motion.p>
        </div>

        {/* Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 mb-10"
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
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block shrink-0" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "h-12 px-6 rounded-xl font-medium transition-all whitespace-nowrap border shrink-0",
                  activeCategory === cat 
                    ? "bg-primary/20 border-primary text-primary" 
                    : "bg-surface border-slate-200 text-slate-600 hover:border-primary/50 hover:text-primary"
                )}
              >
                {cat}
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
              className="overflow-hidden mb-10"
            >
              <div className="p-6 bg-surface/50 border border-slate-200 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900">Advanced Filters</h3>
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
                    <label className="block text-sm font-medium text-slate-600 mb-2">Minimum Rating</label>
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

        {isLoading ? (
          <PageLoader text="Loading products..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.productId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} wishlistItems={wishlistItems} />
              </motion.div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}

      </div>
    </div>
  );
};

const ProductCard = ({ product, wishlistItems = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const wishlistItem = wishlistItems.find(item => item.productId === product.productId);
  const isWishlisted = !!wishlistItem;

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/wishlist/add', {
        productId: product.productId
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to add to wishlist.');
    }
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (wishlistId) => {
      const res = await api.delete(`/wishlist/${wishlistId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to remove from wishlist.');
    }
  });

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlistMutation.mutate(wishlistItem.wishlistId);
    } else {
      addToWishlistMutation.mutate();
    }
  };

  return (
    <div 
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 hover:border-primary/50 transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/customer/product-details/${product.productId}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=500&q=80'} 
          alt={product.productName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleWishlistToggle}
            disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all border disabled:opacity-50 shadow-sm",
              isWishlisted 
                ? "bg-red-50 text-red-500 border-red-200" 
                : "bg-white/90 backdrop-blur-md text-slate-400 border-white hover:text-red-500 hover:bg-white"
            )}
          >
            <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#0f172a] border border-white shadow-sm tracking-wide">
            {product.category?.categoryName || 'Uncategorized'}
          </span>
        </div>
        
        {/* Quick Add Overlay */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button 
            className="w-full" 
            leftIcon={<ShoppingCart className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              // Logic to quick add to cart could go here later
              navigate(`/customer/product-details/${product.productId}`);
            }}
          >
            Quick Add
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-primary mb-1 font-medium">{product.vendor?.businessName}</p>
            <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-2 group-hover:text-primary transition-colors">
              {product.productName}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-slate-900">LKR {Number(product.price).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-slate-900 font-medium">4.8</span>
          <span className="text-slate-500">(12 reviews)</span>
        </div>
      </div>
    </div>
  );
};

