import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-40 pb-12">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        
        <div className="text-center mb-8">

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset your password</h1>
          <p className="text-slate-600 max-w-sm mx-auto">Enter the email address associated with your account and we'll send you a link to reset your password.</p>
        </div>

        <div className="bg-surface/50 border border-slate-300 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" rightIcon={<ArrowRight className="w-4 h-4"/>}>
                Send Reset Link
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
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
              <p className="text-sm text-slate-600 mb-6">
                We've sent a password reset link to your email address. Please check your inbox and spam folder.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
                Didn't receive it? Try again
              </Button>
            </motion.div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-300 text-center">
            <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

