import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Star, ChevronDown, Heart } from 'lucide-react';
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
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={cn("pb-20 min-h-screen bg-background", !isDashboard ? "pt-32" : "pt-6")}>
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-textPrimary mb-4"
          >
            Event <span className="text-gradient">Marketplace</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-textPrimary/60 text-lg max-w-2xl"
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
                    : "bg-surface/50 border-white/5 text-textPrimary/60 hover:bg-surface hover:text-textPrimary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

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
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-textPrimary/40" />
            </div>
            <h3 className="text-xl font-semibold text-textPrimary mb-2">No products found</h3>
            <p className="text-textPrimary/60">Try adjusting your search or filters to find what you're looking for.</p>
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
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/50 transition-colors duration-500"
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
              "w-10 h-10 rounded-full flex items-center justify-center transition-all border disabled:opacity-50",
              isWishlisted 
                ? "bg-red-500/20 text-red-500 border-red-500/50" 
                : "bg-black/40 backdrop-blur-md text-white/80 border-white/10 hover:text-red-400 hover:bg-black/60"
            )}
          >
            <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white/90 border border-white/10">
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
            <h3 className="text-lg font-semibold text-textPrimary leading-tight mb-2 group-hover:text-primary transition-colors">
              {product.productName}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-textPrimary">LKR {Number(product.price).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-textPrimary font-medium">4.8</span>
          <span className="text-textPrimary/40">(12 reviews)</span>
        </div>
      </div>
    </div>
  );
};
