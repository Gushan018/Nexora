import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, MoreVertical, Edit3, Globe, EyeOff, LayoutTemplate } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const POSTS = [
  { id: 'BLG-124', title: 'Top 10 Wedding Venues for 2027', category: 'Inspiration', author: 'Marketing Team', status: 'Published', views: '12.4k', date: 'Oct 12, 2026' },
  { id: 'BLG-125', title: 'How to Price Your Catering Services', category: 'Vendor Tips', author: 'Vendor Success', status: 'Published', views: '4.2k', date: 'Oct 10, 2026' },
  { id: 'BLG-126', title: 'Platform Update: Instant Payouts', category: 'Announcements', author: 'Product Team', status: 'Draft', views: '-', date: 'Oct 24, 2026' },
];

export const BlogManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <LayoutTemplate className="w-7 h-7 text-primary" />
            Blog & Articles
          </h1>
          <p className="text-textPrimary/60">Manage content marketing, vendor resources, and platform announcements.</p>
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-7 h-7 text-primary" />
            Blog & Articles
          </h1>
          <p className="text-slate-600">Manage content marketing, vendor resources, and platform announcements.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Write Article</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-300">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Total Published</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">124</span>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">Total Published</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">124</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Total Monthly Views</h3>
=======
            <h3 className="text-sm font-medium text-slate-800 mb-2">Total Monthly Views</h3>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-primary">84.5k</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/60 mb-2">Active Authors</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-textPrimary">4</span>
=======
            <h3 className="text-sm font-medium text-slate-600 mb-2">Active Authors</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">4</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
<<<<<<< HEAD
            <h3 className="text-sm font-medium text-textPrimary/80 mb-2">Drafts</h3>
=======
            <h3 className="text-sm font-medium text-slate-800 mb-2">Drafts</h3>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-500">3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
<<<<<<< HEAD
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary/50 cursor-pointer">
=======
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full bg-surface border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50 cursor-pointer">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              <option>All Categories</option>
              <option>Inspiration</option>
              <option>Vendor Tips</option>
              <option>Announcements</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
<<<<<<< HEAD
              <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/50 bg-white/[0.02]">
=======
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                <th className="p-4 pl-6">Article Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Traffic</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {POSTS.map((post, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={`https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&q=80`} alt="Blog" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
                      </div>
                      <div className="flex flex-col max-w-[250px]">
<<<<<<< HEAD
                        <span className="font-bold text-textPrimary text-sm truncate">{post.title}</span>
                        <span className="text-xs text-textPrimary/50 mt-1">By {post.author} • {post.date}</span>
=======
                        <span className="font-bold text-slate-900 text-sm truncate">{post.title}</span>
                        <span className="text-xs text-slate-500 mt-1">By {post.author} • {post.date}</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
<<<<<<< HEAD
                    <span className="px-2.5 py-1 bg-surface border border-white/10 rounded-md text-xs text-textPrimary/70 font-medium">
=======
                    <span className="px-2.5 py-1 bg-surface border border-slate-300 rounded-md text-xs text-slate-700 font-medium">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full border",
                      post.status === 'Published' ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    )}>
                      {post.status === 'Published' ? <Globe className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {post.status}
                    </span>
                  </td>
<<<<<<< HEAD
                  <td className="p-4 font-bold text-textPrimary">{post.views}</td>
=======
                  <td className="p-4 font-bold text-slate-900">{post.views}</td>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" leftIcon={<Edit3 className="w-3.5 h-3.5"/>}>
                      Edit Draft
                    </Button>
<<<<<<< HEAD
                    <button className="p-2 text-textPrimary/40 hover:text-textPrimary hover:bg-white/10 rounded-lg transition-colors" title="Actions">
=======
                    <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors" title="Actions">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                      <MoreVertical className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
