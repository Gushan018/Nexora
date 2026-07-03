import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, Heart, Share2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/common/PageLoader';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      // In the App.jsx, the route might not have the :id param currently
      // if it's not setup correctly, but we'll assume it's `/customer/product-details/:id`
      // or we can fallback to fetching if no ID provided.
      if (!id) return null;
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id
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

  const wishlistItem = wishlistItems.find(item => item.productId === parseInt(id));
  const isWishlisted = !!wishlistItem;

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/cart/add', {
        productId: parseInt(id),
        quantity: quantity
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      alert('Product added to cart!');
    },
    onError: (err) => {
      if (err.response?.status === 401) {
        alert('Please login to add items to cart.');
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'Failed to add to cart.');
      }
    }
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/wishlist/add', {
        productId: parseInt(id)
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist']);
      alert('Added to wishlist!');
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

  if (isLoading) return <PageLoader text="Loading product details..." />;
  
  if (!product) return <div className="pt-32 pb-20 text-center text-white">Product not found.</div>;

  const images = [
    product.imageUrl || 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=800&q=80',
    'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=800&q=80&grayscale',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-surface border border-white/10 relative group">
              <img src={images[activeImage]} alt={product.productName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all",
                    activeImage === i ? "border-primary opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-primary font-medium hover:underline cursor-pointer">{product.vendor?.businessName}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => isWishlisted ? removeFromWishlistMutation.mutate(wishlistItem.wishlistId) : addToWishlistMutation.mutate()}
                    disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50",
                      isWishlisted 
                        ? "text-red-500 border border-red-500/50 bg-red-500/10" 
                        : "bg-surface border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/50"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{product.productName}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span className="font-bold">4.8</span>
                </div>
                <span className="text-white/40">({product.reviews?.length || 0} reviews)</span>
                <span className="text-white/20">|</span>
                <span className="text-green-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> In Stock ({product.quantity})</span>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-white">LKR {Number(product.price).toFixed(2)}</span>
            </div>

            <p className="text-white/70 leading-relaxed mb-8">{product.description || 'No description provided.'}</p>

            <div className="mb-8 space-y-3">
              <h3 className="text-white font-bold mb-4">Key Details</h3>
              <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-white/80 text-sm">Vendor Location: {product.vendor?.location || 'N/A'}</p>
              </div>
              <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-white/80 text-sm">Available Quantity: {product.quantity}</p>
              </div>
            </div>

            <div className="mt-auto space-y-6 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 bg-surface rounded-xl border border-white/10 p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg hover:bg-white/10 text-white flex items-center justify-center">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-white">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))} className="w-10 h-10 rounded-lg hover:bg-white/10 text-white flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button 
                  className="flex-1 h-14 text-lg" 
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending}
                >
                  {addToCartMutation.isPending ? 'Adding...' : `Add to Cart - LKR ${(Number(product.price) * quantity).toFixed(2)}`}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface/50 border border-white/5 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Fast Delivery</h4>
                    <p className="text-xs text-white/50">Usually ships within 24 hours.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface/50 border border-white/5 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Buyer Protection</h4>
                    <p className="text-xs text-white/50">Full refund if not as described.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
