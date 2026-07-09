import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';

export const PrivacyPolicy = () => {
  return (
    <div className="pt-40 pb-12 container mx-auto px-6 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
<<<<<<< HEAD
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Privacy Policy</h1>
          <p className="text-textPrimary/60 mt-2">Information and details for Privacy Policy.</p>
=======
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-600 mt-2">Information and details for Privacy Policy.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy Content</CardTitle>
            <CardDescription>Premium layout structure.</CardDescription>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="h-64 flex flex-col items-center justify-center border border-white/5 rounded-xl bg-surface/30">
              <p className="text-textPrimary/40 mb-4">Detailed page content area.</p>
=======
            <div className="h-64 flex flex-col items-center justify-center border border-slate-200 rounded-xl bg-surface/30">
              <p className="text-slate-500 mb-4">Detailed page content area.</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              <div className="flex gap-4">
                <div className="w-32 h-4 bg-slate-100 rounded animate-pulse"></div>
                <div className="w-24 h-4 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
