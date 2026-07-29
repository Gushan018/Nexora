import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, Heart, Share2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

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

  useEffect(() => {
    if (product?.productName) {
      document.title = `${product.productName} | Event Nest`;
    }
  }, [product?.productName]);

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
  
  if (!product) return <div className="pt-32 pb-20 text-center text-slate-900">Product not found.</div>;

  const images = product.imageUrl 
    ? [product.imageUrl] 
    : ['https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=800&q=80'];

  const reviewsCount = product.reviews?.length || 0;
  const avgRating = reviewsCount > 0 
    ? (product.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviewsCount).toFixed(1)
    : null;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-surface border border-slate-300 relative group">
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
                        : "bg-surface border border-slate-300 text-slate-600 hover:text-red-400 hover:border-red-400/50"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="w-10 h-10 rounded-full bg-surface border border-slate-300 flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{product.productName}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className={cn("w-4 h-4", reviewsCount > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-white/30")} />
                  <span className="font-bold">{avgRating ? avgRating : 'New'}</span>
                </div>
                <span className="text-gray-500 dark:text-white/60">({reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'})</span>
                <span className="text-gray-300 dark:text-white/20">|</span>
                {product.quantity > 0 ? (
                  <span className="text-green-500 dark:text-green-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> In Stock ({product.quantity})</span>
                ) : (
                  <span className="text-red-500 dark:text-red-400 font-medium flex items-center gap-1"> Out of Stock</span>
                )}
              </div>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">LKR {Number(product.price).toFixed(2)}</span>
            </div>

            <p className="text-gray-600 dark:text-white/80 leading-relaxed mb-8">{product.description || 'No description provided.'}</p>

            <div className="mb-8 space-y-3">
              <h3 className="text-gray-900 dark:text-white font-bold mb-4">Key Details</h3>
              <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-gray-700 dark:text-white/80 text-sm">Vendor Location: {product.vendor?.location || 'N/A'}</p>
              </div>
              <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-gray-700 dark:text-white/80 text-sm">Available Quantity: {product.quantity}</p>
              </div>
            </div>

            <div className="mt-auto space-y-6 pt-8 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-300 dark:border-white/10 p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.quantity === 0} className="w-10 h-10 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 disabled:opacity-50 text-gray-900 dark:text-white flex items-center justify-center">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{product.quantity === 0 ? 0 : quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))} disabled={product.quantity === 0 || quantity >= product.quantity} className="w-10 h-10 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 disabled:opacity-50 text-gray-900 dark:text-white flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button 
                  className="flex-1 h-14 text-lg disabled:opacity-50" 
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending || product.quantity === 0}
                >
                  {product.quantity === 0 ? 'Out of Stock' : (addToCartMutation.isPending ? 'Adding...' : `Add to Cart - LKR ${(Number(product.price) * quantity).toFixed(2)}`)}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Fast Delivery</h4>
                    <p className="text-xs text-gray-500 dark:text-white/60">Usually ships within 24 hours.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500 dark:text-green-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Buyer Protection</h4>
                    <p className="text-xs text-gray-500 dark:text-white/60">Full refund if not as described.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Vendor's Other Offerings */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-white/10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">More from {product.vendor?.businessName}</h2>
          
          {product.vendor?.eventPackages?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Event Packages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {product.vendor.eventPackages.map(pkg => (
                  <Link key={pkg.packageId} to={`/customer/book-vendor/${pkg.vendorId}?packageId=${pkg.packageId}`} className="block group">
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary transition-colors bg-white dark:bg-slate-900">
                      <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary mb-2 line-clamp-1">{pkg.packageName}</h4>
                      <p className="text-primary font-medium">LKR {Number(pkg.price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {product.vendor?.products?.filter(p => p.productId !== product.productId).length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Other Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {product.vendor.products.filter(p => p.productId !== product.productId).map(p => (
                  <Link key={p.productId} to={`/customer/product-details/${p.productId}`} className="block group">
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary transition-colors bg-white dark:bg-slate-900 flex gap-4">
                      {p.imageUrl && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img src={p.imageUrl} alt={p.productName} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary mb-1 line-clamp-1">{p.productName}</h4>
                        <p className="text-primary font-medium text-sm">LKR {Number(p.price).toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer Reviews & Feedback Section */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-white/10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Feedback & Reviews</h2>
              <p className="text-sm text-gray-500 dark:text-white/60">Read what other event planners say about this item</p>
            </div>
            <Link to={`/customer/review-submission?productId=${product.productId}`}>
              <Button variant="outline" className="text-slate-900 dark:text-white border-slate-300 dark:border-slate-700">Write Full Review</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Review List */}
            <div className="space-y-4">
              {(!product.reviews || product.reviews.length === 0) ? (
                <div className="p-8 text-center text-gray-500 dark:text-white/60 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-white/10">
                  No feedback or reviews yet. Be the first to share your experience!
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.reviewId} className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                          {rev.customer?.name ? rev.customer.name.charAt(0) : 'C'}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{rev.customer?.name || 'Verified Buyer'}</span>
                      </div>
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn("w-3.5 h-3.5", s <= rev.rating ? "fill-yellow-400" : "text-gray-300 dark:text-white/20")} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{rev.comment || 'Great product!'}</p>
                    {rev.vendorReply && (
                      <div className="mt-3 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-slate-800 dark:text-slate-200">
                        <span className="font-bold text-primary block mb-1">Vendor Response:</span>
                        {rev.vendorReply}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Inline Review Writer */}
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-white/10 h-fit space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Leave Your Feedback</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rate this product and leave feedback for the seller.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star className={cn("w-8 h-8 transition-colors", star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-white/20")} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Comment</label>
                  <textarea
                    className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[100px]"
                    placeholder="Share your experience with this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    if (reviewRating === 0) {
                      alert('Please select a rating first.');
                      return;
                    }
                    if (!reviewComment.trim()) {
                      alert('Please write a comment.');
                      return;
                    }
                    
                    api.post('/reviews', { rating: reviewRating, comment: reviewComment, productId: product.productId })
                      .then(() => {
                        alert('Thank you! Your feedback has been submitted successfully.');
                        window.location.reload();
                      })
                      .catch((err) => alert(err.response?.data?.message || 'Failed to submit review. Please login as customer.'));
                  }}
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

