import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus, Search, MoreVertical, Edit2, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const CATEGORIES = [
  { id: 'CAT-01', name: 'Venues & Spaces', slug: 'venues-spaces', items: 450, status: 'Active', subcats: ['Indoor', 'Outdoor', 'Estates'] },
  { id: 'CAT-02', name: 'Photography & Video', slug: 'photography-video', items: 320, status: 'Active', subcats: ['Wedding', 'Corporate', 'Drone'] },
  { id: 'CAT-03', name: 'Catering & Food', slug: 'catering-food', items: 215, status: 'Active', subcats: ['Buffet', 'Plated', 'Food Trucks'] },
  { id: 'CAT-04', name: 'Entertainment', slug: 'entertainment', items: 150, status: 'Active', subcats: ['DJs', 'Live Bands', 'Performers'] },
  { id: 'CAT-05', name: 'Event Decor', slug: 'event-decor', items: 45, status: 'Draft', subcats: [] },
];

export const CategoryManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary" />
            Taxonomy & Categories
          </h1>
          <p className="text-white/60">Manage the hierarchical taxonomy that powers marketplace search.</p>
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Add Category</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: The Tree/List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Search categories..." 
                  className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
                />
              </div>
            </div>

            <div className="p-2">
              {CATEGORIES.map((cat, i) => (
                <div key={i} className="mb-2">
                  <div className="p-4 rounded-xl border border-white/5 bg-surface/50 hover:bg-surface transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="cursor-grab text-white/20 hover:text-white/60">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">{cat.name}</h4>
                          {cat.status === 'Draft' && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase rounded">Draft</span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">/{cat.slug} • {cat.items} listings</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" leftIcon={<Edit2 className="w-3.5 h-3.5"/>}>
                        Edit
                      </Button>
                      <button className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                  
                  {/* Render Subcategories inline if they exist */}
                  {cat.subcats.length > 0 && (
                    <div className="ml-10 pl-4 border-l-2 border-white/10 mt-2 space-y-2 relative">
                      {cat.subcats.map((sub, j) => (
                        <div key={j} className="p-3 rounded-lg border border-white/5 bg-surface/20 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="cursor-grab text-white/20 hover:text-white/60">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-white/80">{sub}</span>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded transition-colors">
                              <Edit2 className="w-3 h-3"/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Category Editor */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Edit Category</CardTitle>
              <CardDescription>Modify properties for "Venues & Spaces"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 block">Category Name</label>
                <input 
                  type="text" 
                  defaultValue="Venues & Spaces" 
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 block">URL Slug</label>
                <input 
                  type="text" 
                  defaultValue="venues-spaces" 
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5 pt-2">
                <label className="text-sm font-medium text-white/80 block">Featured Image</label>
                <div className="w-full h-32 rounded-xl bg-surface border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/40 hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
                  <Layers className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Upload Hero Image</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-surface/50 mt-4">
                <span className="text-sm font-medium text-white/80">Active in Marketplace</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <Button className="w-full mt-2" leftIcon={<CheckCircle2 className="w-4 h-4"/>}>Save Changes</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
