import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Edit2, Trash2, GripVertical, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';

const PACKAGES = [
  { 
    id: 1, 
    name: 'Essential Coverage', 
    price: 1500, 
    popular: false,
    features: ['4 Hours of Coverage', '1 Lead Photographer', 'High-Res Digital Gallery', 'Standard Editing (100 Photos)']
  },
  { 
    id: 2, 
    name: 'Premium Full Day', 
    price: 3200, 
    popular: true,
    features: ['8 Hours of Coverage', '2 Photographers', 'High-Res Digital Gallery', 'Advanced Retouching (300 Photos)', 'Engagement Session Included']
  },
  { 
    id: 3, 
    name: 'Cinematic Ultimate', 
    price: 5500, 
    popular: false,
    features: ['12 Hours of Coverage', '2 Photographers + Drone Pilot', 'Next-Day Sneak Peeks', 'Premium Retouching (500+ Photos)', 'Custom Heirloom Album']
  },
];

export const PackageManagement = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pricing Packages</h1>
          <p className="text-white/60">Configure tiered pricing packages for your primary service.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4"/>}>Create New Tier</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        
        {PACKAGES.map((pkg) => (
          <Card key={pkg.id} className={cn(
            "relative transition-all duration-300 hover:-translate-y-1",
            pkg.popular ? "border-primary/50 shadow-[0_0_30px_rgba(91,124,250,0.15)] bg-primary/5" : "border-white/10"
          )}>
            {pkg.popular && (
              <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
                <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-white" /> Most Popular
                </span>
              </div>
            )}
            
            <CardContent className="p-6">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={cn("text-xl font-bold", pkg.popular ? "text-primary" : "text-white")}>
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold text-white">${pkg.price}</span>
                    <span className="text-sm text-white/40">/event</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 group cursor-pointer">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
                
                {/* Add Feature Mock */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Plus className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-primary font-medium">Add Feature</span>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}

        {/* Global Add-ons */}
        <div className="lg:col-span-3 mt-8">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center border-b border-white/5 pb-4">
              <CardTitle>Global Add-ons</CardTitle>
              <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4"/>}>Add Item</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {[
                  { name: 'Extra Hour of Coverage', price: '$250/hr' },
                  { name: 'Rush Editing (1 Week Delivery)', price: '$500 flat' },
                  { name: 'Drone Photography', price: '$350 flat' },
                ].map((addon, i) => (
                  <div key={i} className="p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-white/20 cursor-grab" />
                      <span className="font-medium text-white">{addon.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-accent">{addon.price}</span>
                      <button className="text-white/40 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
