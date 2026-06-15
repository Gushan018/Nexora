import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';

export const Terms = () => {
  return (
    <div className="pt-40 pb-12 container mx-auto px-6 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Terms</h1>
          <p className="text-white/60 mt-2">Information and details for Terms.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Terms Content</CardTitle>
            <CardDescription>Premium layout structure.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col items-center justify-center border border-white/5 rounded-xl bg-surface/30">
              <p className="text-white/40 mb-4">Detailed page content area.</p>
              <div className="flex gap-4">
                <div className="w-32 h-4 bg-white/5 rounded animate-pulse"></div>
                <div className="w-24 h-4 bg-white/5 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
