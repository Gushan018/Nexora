import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-40 pb-12">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        
        <div className="text-center mb-8">

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create new password</h1>
          <p className="text-slate-600 max-w-sm mx-auto">Your new password must be different from previous used passwords.</p>
        </div>

        <div className="bg-surface/50 border border-slate-300 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800 block">New Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    className="w-full bg-black/40 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-300"
                  />
                </div>
                {/* Password Strength Indicator */}
                <div className="flex gap-1 pt-2">
                  <div className="h-1 flex-1 bg-green-500 rounded-full" />
                  <div className="h-1 flex-1 bg-green-500 rounded-full" />
                  <div className="h-1 flex-1 bg-green-500 rounded-full" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    className="w-full bg-black/40 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" rightIcon={<ArrowRight className="w-4 h-4"/>}>
                Reset Password
              </Button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Password Reset</h3>
              <p className="text-sm text-slate-600 mb-6">
                Your password has been successfully reset. Redirecting you to login...
              </p>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};

