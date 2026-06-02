import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const ShoppingCart = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Premium Gold Cutlery Set (100 Pieces)',
      vendor: 'Luxe Dining',
      price: 120.00,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=200&q=80'
    },
    {
      id: 2,
      name: 'Silk Table Linens (10 Pack)',
      vendor: 'Event Elegance',
      price: 45.00,
      quantity: 5,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&q=80'
    }
  ]);

  const updateQuantity = (id, delta) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Your Cart</h1>
          <p className="text-white/60">Review your items before checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-surface/50">
            <ShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-white/60 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/marketplace">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0 flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-48 sm:h-auto bg-surface shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-primary mb-1">{item.vendor}</p>
                          <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-white/40 hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4 bg-surface rounded-xl border border-white/10 p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg hover:bg-white/10 text-white flex items-center justify-center">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg hover:bg-white/10 text-white flex items-center justify-center">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xl font-bold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
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
                  <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 text-sm border-b border-white/10 pb-6 mb-6">
                    <div className="flex justify-between text-white/80">
                      <span>Subtotal ({items.length} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Estimated Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Shipping</span>
                      <span className="text-green-400">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xl font-bold text-white mb-8">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
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
