import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon, MapPin, DollarSign, Upload, Info, Save, Trash2, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const EditService = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/vendor/service-listing" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 w-fit mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Edit Service
          </h1>
          <p className="text-slate-600">Update details for "Premium Wedding Videography".</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<EyeOff className="w-4 h-4"/>}>Unpublish</Button>
          <Button leftIcon={<Save className="w-4 h-4"/>}>Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <Input label="Service Title" defaultValue="Premium Wedding Videography" />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Category</label>
                <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer" defaultValue="photography">
                  <option value="photography">Photography & Videography</option>
                  <option value="venues">Venues & Spaces</option>
                  <option value="catering">Catering & Food</option>
                  <option value="entertainment">Entertainment & Music</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Detailed Description</label>
                <textarea 
                  rows="6" 
                  defaultValue="Our premium wedding videography package includes full-day coverage, drone footage (weather permitting), and a 5-7 minute cinematic highlight film. We use state-of-the-art 4K cameras to ensure your memories are preserved in the highest quality."
                  className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media & Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Cover Photo</label>
                <div className="w-full h-48 rounded-xl border border-slate-300 overflow-hidden relative group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-slate-900 font-bold flex items-center gap-2"><Upload className="w-5 h-5"/> Replace Cover</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Starting Price (Base Rate)" leftIcon={<DollarSign className="w-4 h-4"/>} defaultValue="2500" type="number" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Pricing Model</label>
                  <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer" defaultValue="fixed">
                    <option value="fixed">Fixed Package</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="custom">Custom Quote Required</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Service Area (Locations)</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    defaultValue="Los Angeles, San Diego, Santa Barbara"
                    className="w-full bg-surface/50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Sidebar Status/Danger Zone */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Listing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-sm">
                <span className="text-green-400 font-bold flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live & Visible
                </span>
                <p className="text-slate-600">This service is currently visible to customers in search results.</p>
              </div>
              <div className="pt-2">
                <p className="text-xs text-slate-500 flex justify-between">
                  <span>Created:</span>
                  <span className="text-slate-800">Jan 12, 2026</span>
                </p>
                <p className="text-xs text-slate-500 flex justify-between mt-1">
                  <span>Last Updated:</span>
                  <span className="text-slate-800">Oct 05, 2026</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">Permanently delete this service. This action cannot be undone and will remove it from all future search results.</p>
              <Button variant="outline" className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20" leftIcon={<Trash2 className="w-4 h-4"/>}>
                Delete Service
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
