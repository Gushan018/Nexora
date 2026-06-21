import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Image as ImageIcon, MapPin, DollarSign, Upload, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const CreateService = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/vendor/service-listing" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 w-fit mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Create New Service
          </h1>
          <p className="text-slate-600">Define a new service offering to showcase to customers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Publish Service</Button>
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
              
              <Input label="Service Title" placeholder="e.g. Premium Wedding Videography" />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Category</label>
                <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                  <option value="" disabled selected>Select a category...</option>
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
                  placeholder="Describe what makes this service special..."
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
                <div className="w-full h-48 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group bg-surface/30">
                  <Upload className="w-8 h-8 text-slate-500 mb-3 group-hover:text-primary transition-colors" />
                  <p className="text-sm text-slate-900 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">1920x1080px (16:9) recommended</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800 flex justify-between">
                  <span>Gallery Images</span>
                  <span className="text-slate-500">0/10</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-slate-400 cursor-pointer bg-surface/30 transition-colors">
                      <Plus className="w-6 h-6 text-slate-300" />
                    </div>
                  ))}
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
                <Input label="Starting Price (Base Rate)" leftIcon={<DollarSign className="w-4 h-4"/>} placeholder="1500" type="number" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Pricing Model</label>
                  <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
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
                    placeholder="e.g. Los Angeles, San Diego, Orange County"
                    className="w-full bg-surface/50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Separate multiple locations with commas.</p>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Sidebar Help/Tips */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20 sticky top-24">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 text-lg">
                <Info className="w-5 h-5" /> Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-slate-800 leading-relaxed">
                <p><strong className="text-slate-900">Use High-Quality Photos:</strong> Listings with at least 5 high-resolution photos receive 60% more inquiries.</p>
                <p><strong className="text-slate-900">Be Transparent with Pricing:</strong> Even if you require custom quotes, providing a realistic "Starting at" price helps filter qualified leads.</p>
                <p><strong className="text-slate-900">Write a Clear Description:</strong> Clearly state what is included in the base rate and what costs extra.</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
