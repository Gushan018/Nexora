import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';

export const ShoppingCart = () => {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const res = await api.get('/cart');
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return { cartItems: [] };
        throw err;
      }
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: async (cartItemId) => {
      const res = await api.delete(`/cart/item/${cartItemId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to remove item.');
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }) => {
      const res = await api.put(`/cart/item/${cartItemId}`, { quantity });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update quantity.');
    }
  });

  const updateQuantity = (cartItemId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
  };

  const removeItem = (id) => {
    removeItemMutation.mutate(id);
  };

  const items = cart?.cartItems || [];

  const subtotal = items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + tax;

  if (isLoading) return <div className="pt-32 pb-20 text-center text-slate-900">Loading cart...</div>;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Your Cart</h1>
          <p className="text-slate-600">Review your items before checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-slate-300 rounded-2xl bg-surface/50">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/marketplace">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <Card key={item.cartItemId} className="overflow-hidden">
                  <CardContent className="p-0 flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-48 sm:h-auto bg-surface shrink-0">
                      <img src={item.product.imageUrl || 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=200&q=80'} alt={item.product.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-primary mb-1">Product ID: {item.productId}</p>
                          <h3 className="text-lg font-bold text-slate-900 leading-tight">{item.product.productName}</h3>
                        </div>
                        <button 
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-2"
                          disabled={removeItemMutation.isPending}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-4 bg-surface rounded-xl border border-slate-300 p-1">
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity, -1)} className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-900 flex items-center justify-center">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-slate-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity, 1)} className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-900 flex items-center justify-center">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xl font-bold text-slate-900">LKR {(Number(item.product.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 text-sm border-b border-slate-300 pb-6 mb-6">
                    <div className="flex justify-between text-slate-800">
                      <span>Subtotal ({items.length} items)</span>
                      <span>LKR {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-800">
                      <span>Estimated Tax (10%)</span>
                      <span>LKR {tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-800">
                      <span>Shipping</span>
                      <span className="text-green-400">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xl font-bold text-slate-900 mb-8">
                    <span>Total</span>
                    <span>LKR {total.toFixed(2)}</span>
                  </div>

                  <Link to="/customer/checkout">
                    <Button className="w-full h-14 text-lg group">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
