import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Image as ImageIcon, Store, MapPin, Phone, Globe, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const StoreManagement = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            Store Management
          </h1>
          <p className="text-slate-600">Customize your public marketplace storefront appearance and details.</p>
        </div>
        <Button leftIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>How customers will see your business on the marketplace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-32 h-32 rounded-2xl bg-surface border-2 border-dashed border-slate-400 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group shrink-0">
                  <ImageIcon className="w-8 h-8 text-slate-500 group-hover:text-primary mb-2" />
                  <span className="text-xs text-slate-600 font-medium">Upload Logo</span>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <Input label="Store Name" defaultValue="Luxe Dining" />
                  <Input label="Tagline" defaultValue="Premium catering equipment and luxury tableware rentals." />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-800">About Us / Store Description</label>
                <textarea 
                  rows="5" 
                  className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors"
                  defaultValue="Luxe Dining is Sri Lanka's premier provider of luxury event equipment. We specialize in supplying high-end cutlery, premium linens, and elegant tableware for weddings and corporate events."
                />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Location</CardTitle>
              <CardDescription>Where customers can reach you or pick up items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Public Email" type="email" defaultValue="contact@luxedining.lk" leftIcon={<Store className="w-5 h-5"/>} />
                <Input label="Public Phone" defaultValue="+94 77 123 4567" leftIcon={<Phone className="w-5 h-5"/>} />
              </div>
              <Input label="Website / Portfolio Link" defaultValue="https://luxedining.lk" leftIcon={<Globe className="w-5 h-5"/>} />
              <Input label="Store Address (Optional)" defaultValue="123 Gallery Road, Colombo 03" leftIcon={<MapPin className="w-5 h-5"/>} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Cover Photo</CardTitle>
              <CardDescription>Appears at the top of your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-40 rounded-xl bg-surface border-2 border-dashed border-slate-400 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80" alt="Cover" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon className="w-8 h-8 text-slate-900 mb-2" />
                  <span className="text-sm text-slate-900 font-medium">Change Cover</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-surface/30 cursor-pointer">
                <div>
                  <h4 className="text-slate-900 font-medium text-sm">Store Visibility</h4>
                  <p className="text-xs text-slate-500">Turn on to appear in search</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </label>
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-300 bg-surface/30 cursor-pointer">
                <div>
                  <h4 className="text-slate-900 font-medium text-sm">Accepting New Orders</h4>
                  <p className="text-xs text-slate-500">Allow customers to buy</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
