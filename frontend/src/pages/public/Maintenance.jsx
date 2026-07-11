import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Wrench, Clock } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Maintenance = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[200px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-2xl relative z-10 px-4 text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-8">
            <Settings className="w-24 h-24 text-primary animate-[spin_10s_linear_infinite]" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-surface rounded-full flex items-center justify-center border border-slate-300 shadow-xl">
              <Wrench className="w-6 h-6 text-slate-900" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            We're upgrading Event Nest.
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            The marketplace is currently down for scheduled maintenance to improve performance and add new features. We'll be back online shortly.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-surface/50 border border-slate-300 backdrop-blur-md">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-slate-800">Estimated downtime: 45 minutes</span>
          </div>

          <div className="mt-12">
            <a href="mailto:support@nexora.com" className="text-sm text-primary hover:underline font-medium">
              Need urgent help? Contact Support
            </a>
          </div>

        </motion.div>

      </div>
    </div>
  );
};

