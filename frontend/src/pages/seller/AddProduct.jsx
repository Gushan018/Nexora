import React from 'react';
import { motion } from 'framer-motion';
import { PackagePlus, Upload, Tag, DollarSign, List, Layers, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const AddProduct = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PackagePlus className="w-7 h-7 text-primary" />
            Add New Product
          </h1>
          <p className="text-white/60">List a new physical item on your marketplace storefront.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">Save Draft</Button>
          <Button className="flex-1 sm:flex-none" leftIcon={<Save className="w-4 h-4" />}>Publish Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input 
                label="Product Name" 
                placeholder="e.g. Premium Gold Cutlery Set (100 Pieces)" 
                leftIcon={<Tag className="w-5 h-5" />}
              />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/90">Description</label>
                <textarea 
                  rows="6" 
                  className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Describe your product in detail..."
                />
                <p className="text-xs text-white/40 mt-1 text-right">0 / 2000 characters</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <List className="w-4 h-4 text-white/60" /> Category
                  </label>
                  <select className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                    <option value="">Select Category</option>
                    <option value="catering">Catering Supplies</option>
                    <option value="decor">Decorations</option>
                    <option value="lighting">Lighting & AV</option>
                    <option value="furniture">Furniture</option>
                  </select>
                </div>
                <Input 
                  label="Available Stock" 
                  type="number"
                  placeholder="0" 
                  leftIcon={<Layers className="w-5 h-5" />}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                  label="Regular Price" 
                  type="number"
                  placeholder="0.00" 
                  leftIcon={<DollarSign className="w-5 h-5" />}
                />
                <Input 
                  label="Sale Price (Optional)" 
                  type="number"
                  placeholder="0.00" 
                  leftIcon={<DollarSign className="w-5 h-5 text-green-400" />}
                />
              </div>
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-sm text-primary font-medium flex items-center justify-between">
                  Estimated Platform Fee (5%): <span>-LKR 0.00</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
              <CardDescription>First image will be the cover.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-xl h-48 flex flex-col items-center justify-center bg-surface/30 hover:bg-surface/50 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Upload className="w-6 h-6 text-white/40 group-hover:text-primary" />
                </div>
                <p className="text-sm text-white/60 font-medium text-center px-4">Click or drag images here</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-lg bg-surface border border-white/10 flex items-center justify-center">
                    <span className="text-white/20 text-xs">Slot {i}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded bg-surface border-white/20 text-primary focus:ring-primary/50 focus:ring-offset-background" defaultChecked />
                <span className="text-sm text-white/80">Standard Delivery (3-5 days)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded bg-surface border-white/20 text-primary focus:ring-primary/50 focus:ring-offset-background" />
                <span className="text-sm text-white/80">Express Delivery (Next day)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded bg-surface border-white/20 text-primary focus:ring-primary/50 focus:ring-offset-background" />
                <span className="text-sm text-white/80">Local Pickup Allowed</span>
              </label>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
