import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Grid, Trash2, Edit2, Search, Filter, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const ALBUMS = [
  { id: 1, title: 'Beach Weddings 2025', count: 42, cover: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=500&q=80', status: 'Public' },
  { id: 2, title: 'Corporate Galas', count: 18, cover: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&q=80', status: 'Public' },
  { id: 3, title: 'Private Engagement Sessions', count: 56, cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', status: 'Private Link' },
  { id: 4, title: 'Drone Photography Showcase', count: 12, cover: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&q=80', status: 'Draft' },
];

export const GalleryManagement = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-primary" />
            Portfolio Gallery
          </h1>
          <p className="text-slate-600">Manage albums and photos showcased on your vendor profile.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Upload className="w-4 h-4"/>}>Quick Upload</Button>
          <Button leftIcon={<Plus className="w-4 h-4"/>}>New Album</Button>
        </div>
      </div>

      <div className="p-4 border-b border-slate-200 bg-surface/30 rounded-t-2xl flex flex-col sm:flex-row gap-4 justify-between mt-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search albums..." 
            className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4"/>}>Filter</Button>
          <div className="flex bg-surface border border-slate-300 rounded-lg p-1">
            <button className="p-1.5 bg-primary/20 text-primary rounded-md"><Grid className="w-4 h-4"/></button>
            <button className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md transition-colors"><ImageIcon className="w-4 h-4"/></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        
        {/* Upload Card */}
        <div className="h-[280px] rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group bg-surface/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Create Album</h3>
          <p className="text-xs text-slate-500 text-center px-6">Group related photos together for better organization.</p>
        </div>

        {/* Existing Albums */}
        {ALBUMS.map((album) => (
          <div key={album.id} className="h-[280px] rounded-2xl border border-slate-200 bg-surface/50 overflow-hidden group relative flex flex-col">
            <div className="h-40 w-full relative overflow-hidden shrink-0">
              <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              
              {/* Quick Actions Overlay */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-black/50 backdrop-blur-md rounded text-slate-900 hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 bg-black/50 backdrop-blur-md rounded text-slate-900 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <span className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold backdrop-blur-md uppercase tracking-wider",
                  album.status === 'Public' ? "bg-green-500/80 text-slate-900" :
                  album.status === 'Draft' ? "bg-slate-300 text-slate-900" :
                  "bg-yellow-500/80 text-slate-900"
                )}>
                  {album.status}
                </span>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between z-10 bg-surface/50 backdrop-blur-md">
              <div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-primary transition-colors">{album.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{album.count} items</p>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs">Manage Photos</Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

