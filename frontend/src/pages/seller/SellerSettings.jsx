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
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Account Settings</h1>
        <p className="text-textPrimary/60 text-sm">Manage your account security and personal preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold text-textPrimary mb-2">Profile Information</h3>
          <p className="text-sm text-textPrimary/50">Update your account email and public persona.</p>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Input 
                label="Full Name" 
                defaultValue={user?.businessName} 
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input 
                label="Email Address" 
                defaultValue={user?.email} 
                disabled 
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <div className="pt-4">
                <Button isLoading={isLoading} leftIcon={<Save className="w-4 h-4"/>}>Update Profile</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-px bg-white/5 col-span-full" />

        <div className="md:col-span-1">
          <h3 className="text-lg font-bold text-textPrimary mb-2">Security</h3>
          <p className="text-sm text-textPrimary/50">Ensure your account is protected with a strong password.</p>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Current Password" type="password" leftIcon={<Lock className="w-4 h-4" />} />
              <Input label="New Password" type="password" leftIcon={<Shield className="w-4 h-4" />} />
              <Input label="Confirm New Password" type="password" leftIcon={<Shield className="w-4 h-4" />} />
              <div className="pt-2">
                <Button variant="outline">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
