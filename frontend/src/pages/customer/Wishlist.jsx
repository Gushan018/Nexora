import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { Link } from 'react-router-dom';
import { PageLoader } from '../../components/common/PageLoader';

export const Wishlist = () => {
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist/my');
      return res.data;
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/wishlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist']);
      queryClient.invalidateQueries(['customerDashboardStats']);
    }
  });

  if (isLoading) return <PageLoader text="Loading wishlist..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Wishlist</h1>
        <p className="text-slate-600 dark:text-slate-300">Saved items and services for your upcoming events.</p>
      </div>

      {wishlist?.length === 0 ? (
        <Card className="text-center py-12 border-slate-200 dark:border-white/10">
          <CardContent className="flex flex-col items-center">
            <Heart className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Start browsing the marketplace and vendors to save your favorites!</p>
            <Link to="/customer/marketplace">
              <Button className="font-bold">Explore Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlist?.map((item) => {
            const detail = item.product || item.service || item.package;
            const type = item.product ? 'Product' : item.service ? 'Service' : 'Package';
            
            return (
              <Card key={item.wishlistId} className="group overflow-hidden flex flex-col border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C2333]">
                <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                  <img src={detail?.imageUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80'} alt="Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90" />
                  <button 
                    onClick={() => removeMutation.mutate(item.wishlistId)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-slate-950 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-xs font-bold text-white rounded-full">
                    {type}
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{detail?.productName || detail?.serviceName || detail?.packageName}</h3>
                  <p className="text-sm text-primary mb-3 font-medium">{detail?.vendor?.businessName || 'Unknown Vendor'}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
                    <span className="font-bold text-slate-900 dark:text-white">LKR {Number(detail?.price || 0).toFixed(2)}</span>
                    <Link to={item.product ? `/customer/product-details/${item.productId}` : `/event-packages`}>
                      <Button variant="outline" size="sm" className="text-slate-900 dark:text-white border-slate-300 dark:border-slate-700">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

