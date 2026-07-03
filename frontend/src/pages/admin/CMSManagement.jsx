import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, MoreVertical, Edit3, Globe, EyeOff, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const PAGES = [
  { id: 'PG-01', title: 'Terms of Service', slug: '/terms', type: 'Legal', status: 'Published', lastUpdated: 'Oct 12, 2026' },
  { id: 'PG-02', title: 'Privacy Policy', slug: '/privacy', type: 'Legal', status: 'Published', lastUpdated: 'Oct 12, 2026' },
  { id: 'PG-03', title: 'About Us', slug: '/about', type: 'Landing', status: 'Published', lastUpdated: 'Sep 05, 2026' },
  { id: 'PG-04', title: 'Vendor Guidelines', slug: '/vendor-guidelines', type: 'Support', status: 'Draft', lastUpdated: 'Oct 24, 2026' },
  { id: 'PG-05', title: 'Holiday 2026 Promo', slug: '/promo/holiday-26', type: 'Marketing', status: 'Draft', lastUpdated: 'Oct 25, 2026' },
];

export const CMSManagement = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layout className="w-7 h-7 text-primary" />
            Content Management (CMS)
          </h1>
          <p className="text-white/60">Create, edit, and publish static pages and legal documents.</p>
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Create New Page</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-2">Total Pages</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-white">42</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Published</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">38</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Drafts</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-yellow-500">4</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search pages by title or slug..." 
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>All Types</option>
              <option>Legal</option>
              <option>Landing</option>
              <option>Marketing</option>
              <option>Support</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-white/50 bg-white/[0.02]">
                <th className="p-4 pl-6">Page Title & Slug</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {PAGES.map((page, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface border border-white/5 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-white/40" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-base">{page.title}</span>
                        <a href="#" className="text-xs text-primary hover:underline">{page.slug}</a>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-surface border border-white/10 rounded-md text-xs text-white/70 font-medium">
                      {page.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full border",
                      page.status === 'Published' ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    )}>
                      {page.status === 'Published' ? <Globe className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {page.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/60">{page.lastUpdated}</td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" leftIcon={<Edit3 className="w-3.5 h-3.5"/>}>
                      Edit in Builder
                    </Button>
                    <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Actions">
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
