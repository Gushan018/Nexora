import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, CheckCircle2, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const Register = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('customer'); // 'customer' or 'vendor'

  const handleRegister = (e) => {
    e.preventDefault();
    if(accountType === 'vendor') {
      navigate('/vendor/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-40 pb-12">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-xl relative z-10 px-4">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join Nexora</h1>
          <p className="text-white/60">Create an account to start planning or selling.</p>
        </div>

        <div className="bg-surface/50 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Account Type Selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setAccountType('customer')}
              className={cn(
                "p-4 rounded-xl border flex flex-col items-center text-center transition-all",
                accountType === 'customer' 
                  ? "bg-primary/20 border-primary text-white" 
                  : "bg-surface border-white/10 text-white/50 hover:bg-white/5"
              )}
            >
              <User className="w-6 h-6 mb-2" />
              <span className="font-bold text-sm">I'm a Customer</span>
              <span className="text-[10px] mt-1 opacity-80">Looking to book services</span>
            </button>
            <button
              onClick={() => setAccountType('vendor')}
              className={cn(
                "p-4 rounded-xl border flex flex-col items-center text-center transition-all",
                accountType === 'vendor' 
                  ? "bg-accent/20 border-accent text-white" 
                  : "bg-surface border-white/10 text-white/50 hover:bg-white/5"
              )}
            >
              <Store className="w-6 h-6 mb-2" />
              <span className="font-bold text-sm">I'm a Vendor</span>
              <span className="text-[10px] mt-1 opacity-80">Looking to sell services</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 block">First Name</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="John" 
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 block">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 block">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 block">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="password" 
                  placeholder="Create a strong password" 
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                />
              </div>
              
              {/* Password Strength Indicator */}
              <div className="flex gap-1 pt-2">
                <div className="h-1 flex-1 bg-green-500 rounded-full" />
                <div className="h-1 flex-1 bg-green-500 rounded-full" />
                <div className="h-1 flex-1 bg-surface border border-white/10 rounded-full" />
              </div>
              <p className="text-[10px] text-white/40">Must be at least 8 characters long</p>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5">
                <input 
                  id="terms" 
                  type="checkbox" 
                  required
                  className="w-4 h-4 rounded bg-surface border-white/10 text-primary focus:ring-primary focus:ring-offset-surface"
                />
              </div>
              <label htmlFor="terms" className="text-xs text-white/60 leading-tight">
                By creating an account, you agree to Nexora's <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <Button type="submit" className={cn("w-full mt-4", accountType === 'vendor' ? "bg-accent hover:bg-accent-hover text-white" : "bg-primary hover:bg-primary-hover")} size="lg" rightIcon={<ArrowRight className="w-4 h-4"/>}>
              Create {accountType === 'vendor' ? 'Vendor' : 'Customer'} Account
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-white/50 text-sm">
          Already have an account? <Link to="/login" className="text-white hover:text-primary font-medium transition-colors">Log in</Link>
        </p>

      </div>
    </div>
  );
};
