import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Lock, User, Mail, Shield, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';

export const SellerSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Seller Settings</h1>
        <p className="text-slate-600">Update your preferences and details.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>Make sure your data is up to date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-800">First Name</label>
              <input type="text" className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-primary" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-800">Last Name</label>
              <input type="text" className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-primary" defaultValue="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-800">Email Address</label>
            <input type="email" className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-primary" defaultValue="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-800">Description</label>
            <textarea rows="4" className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-primary"></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-4 border-t border-slate-200">
            <Button variant="outline">Cancel</Button>
            <Button leftIcon={<Save className="w-4 h-4"/>}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
