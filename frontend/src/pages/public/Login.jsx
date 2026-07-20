import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    const result = await login(email, password);
    if (result.success) {
      if (result.user.role === 'customer') {
        navigate('/customer/dashboard');
      } else if (result.user.role === 'company' || result.user.role === 'emc' || result.user.vendorType === 'EVENT_COMPANY') {
        navigate('/company/dashboard');
      } else if (result.user.role === 'seller') {
        navigate('/seller/dashboard');
      } else if (result.user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-40 pb-12">
      
      {/* Advanced Animated Background */}
      {/* Advanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -50, 0], x: [0, 30, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="w-full max-w-md relative z-10 px-4"
      >
        
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-serif text-white mb-2 drop-shadow-md"
          >
            Welcome back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 drop-shadow-sm"
          >
            Log in to your account to continue.
          </motion.p>
        </div>

        <div className="bg-[#0F172A]/90 border border-slate-700/80 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
          
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200 block">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-200 block">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-light transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-4" size="lg" rightIcon={!isLoading && <ArrowRight className="w-4 h-4"/>}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick Demo Login Badges */}
          <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Quick Demo Login by Member Role</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                type="button" 
                onClick={() => handleDemoLogin('sarah@example.com')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1E293B] text-slate-200 hover:bg-primary/20 hover:text-white border border-slate-700 transition-colors"
              >
                👤 Customer
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('vendor1@example.com')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1E293B] text-slate-200 hover:bg-primary/20 hover:text-white border border-slate-700 transition-colors"
              >
                🛠️ Service Provider
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('seller1@example.com')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1E293B] text-slate-200 hover:bg-primary/20 hover:text-white border border-slate-700 transition-colors"
              >
                📦 Seller
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('eventcompany@example.com')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1E293B] text-slate-200 hover:bg-primary/20 hover:text-white border border-slate-700 transition-colors"
              >
                🎪 Event Company
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('admin@example.com')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1E293B] text-slate-200 hover:bg-primary/20 hover:text-white border border-slate-700 transition-colors"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-slate-300 text-sm"
        >
          Don't have an account? <Link to="/register" className="text-primary hover:text-white font-bold transition-colors underline underline-offset-4">Sign up</Link>
        </motion.p>

      </motion.div>
    </div>
  );
};

