import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Power, Trash2, Edit2, Link as LinkIcon, ExternalLink, MoveUp, MoveDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const BANNERS = [
  { id: 'BNR-1', name: 'Holiday Sale 2026', type: 'Homepage Hero', link: '/promo/holiday', active: true, clicks: 12450, ctr: '8.4%', order: 1, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' },
  { id: 'BNR-2', name: 'Vendor Signup Push', type: 'Top Bar (Global)', link: '/vendor/signup', active: true, clicks: 3420, ctr: '2.1%', order: 2, image: null },
  { id: 'BNR-3', name: 'Summer Wedding Promo', type: 'Category: Venues', link: '/search?q=summer', active: false, clicks: 8400, ctr: '5.2%', order: 3, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80' },
];

export const BannerManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-primary" />
            Banner & Ad Management
          </h1>
          <p className="text-white/60">Configure global announcements, hero carousels, and promotional banners.</p>
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Create Banner</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Active Banners List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Placements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {BANNERS.map((banner, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-xl border transition-all",
                  banner.active ? "border-primary/30 bg-primary/5" : "border-white/5 bg-surface/50 opacity-60"
                )}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    
                    {/* Visual Preview */}
                    <div className="w-full sm:w-48 h-24 rounded-lg bg-surface border border-white/10 overflow-hidden shrink-0 relative flex items-center justify-center">
                      {banner.image ? (
                        <img src={banner.image} alt={banner.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-white/40 font-medium">Text Only Banner</span>
                      )}
                      {!banner.active && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-xs font-bold text-white tracking-widest uppercase">Inactive</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-lg">{banner.name}</h4>
                            <span className="px-2 py-0.5 bg-surface border border-white/10 rounded text-[10px] text-white/60">
                              {banner.type}
                            </span>
                          </div>
                          <a href="#" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                            <LinkIcon className="w-3 h-3" /> {banner.link} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        
                        {/* Order Controls */}
                        <div className="flex flex-col gap-1">
                          <button className="p-1 text-white/40 hover:text-white bg-surface rounded"><MoveUp className="w-3 h-3"/></button>
                          <button className="p-1 text-white/40 hover:text-white bg-surface rounded"><MoveDown className="w-3 h-3"/></button>
                        </div>
                      </div>
                      
                      {/* Stats & Actions */}
                      <div className="flex items-end justify-between mt-4 border-t border-white/5 pt-3">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-xs text-white/40 block">Total Clicks</span>
                            <span className="text-sm font-bold text-white">{banner.clicks.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-xs text-white/40 block">Avg. CTR</span>
                            <span className="text-sm font-bold text-green-400">{banner.ctr}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className={banner.active ? "text-yellow-500 border-yellow-500/20" : "text-green-400 border-green-400/20"}>
                            <Power className="w-4 h-4 mr-1.5"/> {banner.active ? 'Disable' : 'Enable'}
                          </Button>
                          <Button variant="outline" size="sm"><Edit2 className="w-4 h-4"/></Button>
                          <Button variant="outline" size="sm" className="text-red-400 hover:bg-red-400/10 border-red-400/20"><Trash2 className="w-4 h-4"/></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Quick Stats */}
        <div className="space-y-6">
          <Card className="border-white/5 bg-gradient-to-br from-surface to-surface/50">
            <CardHeader>
              <CardTitle>Banner Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Highest Converting</h4>
                <p className="font-bold text-white">Holiday Sale 2026</p>
                <p className="text-sm text-green-400">8.4% Click-Through Rate</p>
              </div>
              <div className="w-full h-px bg-white/5" />
              <div>
                <h4 className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Lowest Converting</h4>
                <p className="font-bold text-white">Vendor Signup Push</p>
                <p className="text-sm text-red-400">2.1% Click-Through Rate</p>
                <p className="text-xs text-white/40 mt-1 italic">Consider adding an image or changing copy.</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
