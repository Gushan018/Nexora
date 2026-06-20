import React from 'react';
import { motion } from 'framer-motion';
import { Store, Camera, Edit2, MapPin, Globe, Star, Users, Briefcase, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';

export const VendorProfile = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            Vendor Profile
          </h1>
          <p className="text-white/60">Manage how customers see your business on Nexora.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Eye className="w-4 h-4"/>}>Preview Public Profile</Button>
          <Button leftIcon={<Edit2 className="w-4 h-4"/>}>Save Changes</Button>
        </div>
      </div>

      {/* Cover & Avatar Section */}
      <Card className="overflow-hidden border-none shadow-2xl relative bg-transparent">
        {/* Cover Photo */}
        <div className="h-64 w-full relative group cursor-pointer bg-surface">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white mb-2" />
            <span className="text-sm font-bold text-white">Change Cover Photo</span>
            <span className="text-xs text-white/60">Recommended: 1200x400px</span>
          </div>
        </div>

        {/* Avatar */}
        <div className="absolute left-8 bottom-[-40px] flex items-end gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-2xl bg-surface border-4 border-background flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80" 
                alt="Logo" 
                className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4">
                <Input label="Business Name" defaultValue="Lumiere Photography" />
                <Input label="Short Tagline" defaultValue="Capturing timeless moments for modern couples." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">About the Business</label>
                <textarea 
                  rows="6" 
                  className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  defaultValue="Lumiere Photography is a premium wedding and event photography studio based in California. With over 10 years of experience, our team specializes in candid, documentary-style captures blended with stunning editorial portraits. We believe every event has a unique story, and our goal is to preserve those memories in the most authentic way possible."
                />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Public Email" defaultValue="hello@lumierephoto.com" />
                <Input label="Public Phone" defaultValue="+1 (555) 987-6543" />
              </div>
              <Input label="Website" leftIcon={<Globe className="w-4 h-4"/>} defaultValue="https://lumierephoto.com" />
              <Input label="Physical Studio Address (Optional)" leftIcon={<MapPin className="w-4 h-4"/>} defaultValue="123 Arts District, Colombo, Sri Lanka 90013" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Status & Badges */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Top Rated Vendor</h3>
                  <p className="text-xs text-white/60">Maintained 4.8+ rating for 6 months</p>
                </div>
              </div>
              <Button className="w-full" variant="outline">View Badge Guidelines</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/60">
                    <Users className="w-4 h-4" /> <span className="text-sm">Profile Views (30d)</span>
                  </div>
                  <span className="font-bold text-white">1,245</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/60">
                    <Briefcase className="w-4 h-4" /> <span className="text-sm">Total Bookings</span>
                  </div>
                  <span className="font-bold text-white">84</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/60">
                    <Star className="w-4 h-4" /> <span className="text-sm">Average Rating</span>
                  </div>
                  <span className="font-bold text-yellow-400">4.9 / 5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-surface border border-white/10 rounded-full text-xs text-white">Photography</span>
                <span className="px-3 py-1 bg-surface border border-white/10 rounded-full text-xs text-white">Videography</span>
                <span className="px-3 py-1 bg-surface border border-white/10 rounded-full text-xs text-white">Drone Coverage</span>
              </div>
              <p className="text-xs text-white/40 mt-4 italic">Categories are derived from your active service listings.</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
