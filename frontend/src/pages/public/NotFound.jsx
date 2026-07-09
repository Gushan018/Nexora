import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-40 pb-12">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] font-black text-slate-900/[0.02] select-none tracking-tighter mix-blend-screen">
          404
        </div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-xl relative z-10 px-4 text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-surface/50 border border-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl backdrop-blur-md">
            <span className="text-3xl font-black text-slate-900">?!</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Page not found
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} size="lg" leftIcon={<ArrowLeft className="w-4 h-4"/>}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/')} size="lg" leftIcon={<Home className="w-4 h-4"/>}>
              Back to Home
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
