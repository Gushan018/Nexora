import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, CheckCircle2, Store, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [accountType, setAccountType] = useState('customer'); // 'customer' or 'vendor'
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    businessName: '',
    vendorType: 'OTHER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (accountType === 'vendor') {
        const vendorData = {
          business_name: formData.businessName || `${formData.firstName} ${formData.lastName}'s Business`,
          email: formData.email,
          password: formData.password,
          vendor_type: formData.vendorType,
        };
        const res = await api.post('/auth/register/vendor', vendorData);
        alert(res.data.message || 'Vendor registered successfully.');
        navigate('/login');
      } else {
        const customerData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        };
        const res = await api.post('/auth/register/customer', customerData);
        
        // Auto login after successful register
        if (res.status === 201) {
          const loginRes = await login(formData.email, formData.password);
          if (loginRes.success) {
            navigate('/customer/dashboard');
          } else {
            navigate('/login');
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-40 pb-12">
      
      {/* Advanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -50, 0], x: [0, 30, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[40rem] h-[40rem] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="w-full max-w-xl relative z-10 px-4"
      >
        
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
<<<<<<< HEAD
            className="text-4xl font-serif text-textPrimary mb-2"
=======
            className="text-4xl font-serif text-slate-900 mb-2"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          >
            Join Event Nest
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
<<<<<<< HEAD
            className="text-textPrimary/60"
=======
            className="text-slate-600"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          >
            Create an account to start planning or selling.
          </motion.p>
        </div>

        <div className="bg-surface/40 border border-slate-300 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Account Type Selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setAccountType('customer')}
              className={cn(
                "p-4 rounded-xl border flex flex-col items-center text-center transition-all",
                accountType === 'customer' 
<<<<<<< HEAD
                  ? "bg-primary/20 border-primary text-textPrimary" 
                  : "bg-surface border-white/10 text-textPrimary/50 hover:bg-white/5"
=======
                  ? "bg-primary/20 border-primary text-slate-900" 
                  : "bg-surface border-slate-300 text-slate-500 hover:bg-slate-100"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
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
<<<<<<< HEAD
                  ? "bg-accent/20 border-accent text-textPrimary" 
                  : "bg-surface border-white/10 text-textPrimary/50 hover:bg-white/5"
=======
                  ? "bg-accent/20 border-accent text-slate-900" 
                  : "bg-surface border-slate-300 text-slate-500 hover:bg-slate-100"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
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
<<<<<<< HEAD
                <label className="text-sm font-medium text-textPrimary/80 block">First Name</label>
=======
                <label className="text-sm font-medium text-slate-800 block">First Name</label>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John" 
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-12 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
<<<<<<< HEAD
                <label className="text-sm font-medium text-textPrimary/80 block">Last Name</label>
=======
                <label className="text-sm font-medium text-slate-800 block">Last Name</label>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe" 
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
<<<<<<< HEAD
              <label className="text-sm font-medium text-textPrimary/80 block">Email Address</label>
=======
              <label className="text-sm font-medium text-slate-800 block">Email Address</label>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com" 
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-12 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
<<<<<<< HEAD
              <label className="text-sm font-medium text-textPrimary/80 block">Password</label>
=======
              <label className="text-sm font-medium text-slate-800 block">Password</label>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password" 
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-12 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              <div className="flex gap-1 pt-2">
                <div className="h-1 flex-1 bg-green-500 rounded-full" />
                <div className="h-1 flex-1 bg-green-500 rounded-full" />
                <div className="h-1 flex-1 bg-surface border border-slate-300 rounded-full" />
              </div>
<<<<<<< HEAD
              <p className="text-[10px] text-textPrimary/40">Must be at least 8 characters long</p>
=======
              <p className="text-[10px] text-slate-500">Must be at least 8 characters long</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5">
                <input 
                  id="terms" 
                  type="checkbox" 
                  required
                  className="w-4 h-4 rounded bg-surface border-slate-300 text-primary focus:ring-primary focus:ring-offset-surface"
                />
              </div>
<<<<<<< HEAD
              <label htmlFor="terms" className="text-xs text-textPrimary/60 leading-tight">
                By creating an account, you agree to Nexora's <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
=======
              <label htmlFor="terms" className="text-xs text-slate-600 leading-tight">
                By creating an account, you agree to Event Nest's <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              </label>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-6" size="lg" rightIcon={!isLoading && <ArrowRight className="w-4 h-4"/>}>
              {isLoading ? 'Creating Account...' : `Create ${accountType === 'vendor' ? 'Vendor' : 'Customer'} Account`}
            </Button>
          </form>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
<<<<<<< HEAD
          className="text-center mt-8 text-textPrimary/50 text-sm"
        >
          Already have an account? <Link to="/login" className="text-textPrimary hover:text-primary font-bold transition-colors underline underline-offset-4">Log in</Link>
=======
          className="text-center mt-8 text-slate-500 text-sm"
        >
          Already have an account? <Link to="/login" className="text-slate-900 hover:text-primary font-bold transition-colors underline underline-offset-4">Log in</Link>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </motion.p>

      </motion.div>
    </div>
  );
};
