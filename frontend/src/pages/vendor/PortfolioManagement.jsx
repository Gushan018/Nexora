import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, GripVertical, Star, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const PORTFOLIO_ITEMS = [
  { id: 1, title: 'Grand Hyatt Wedding', category: 'Wedding Photography', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', featured: true },
  { id: 2, title: 'TechNova Corporate Gala', category: 'Event Coverage', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80', featured: false },
  { id: 3, title: 'Beachfront Engagement', category: 'Pre-Shoot', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', featured: false },
  { id: 4, title: 'Luxury Villa Reception', category: 'Wedding Photography', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80', featured: true },
];

export const PortfolioManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-primary" />
            Portfolio Showcase
          </h1>
          <p className="text-slate-600">Manage your past work. High-quality portfolios increase booking rates by 40%.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4"/>}>Add New Project</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured Projects</CardTitle>
          <CardDescription>Drag to reorder. These appear at the very top of your public profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {PORTFOLIO_ITEMS.map((item, i) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-surface/50 hover:bg-surface transition-colors group">
                <button className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing px-2">
                  <GripVertical className="w-5 h-5" />
                </button>
                
                <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 relative bg-black">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  {item.featured && (
                    <div className="absolute top-1 left-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.category}</p>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Preview">
                    <Eye className="w-4 h-4"/>
                  </button>
                  <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Dropzone */}
          <div className="mt-6 border-2 border-dashed border-slate-300 hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center bg-surface/30 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-slate-900 font-medium text-sm mb-1">Add another project</h4>
            <p className="text-xs text-slate-500">Upload high-res images to showcase your best work</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
