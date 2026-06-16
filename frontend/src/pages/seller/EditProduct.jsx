import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const EditProduct = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
        <p className="text-white/60">Update your preferences and details.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>Make sure your data is up to date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-white/80">First Name</label>
              <input type="text" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80">Last Name</label>
              <input type="text" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" defaultValue="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Email Address</label>
            <input type="email" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary" defaultValue="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Description</label>
            <textarea rows="4" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-4 border-t border-white/5">
            <Button variant="outline">Cancel</Button>
            <Button leftIcon={<Save className="w-4 h-4"/>}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
