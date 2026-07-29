import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { api } from '../../utils/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      setSubmitted(true);
      if (res.data?.resetUrl) {
        // Automatically navigate to reset page after 1.5 seconds for smooth UX
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send reset link. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-40 pb-12">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset your password</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">Enter the email address associated with your account and we'll send you a link to reset your password.</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2 font-bold" size="lg" disabled={loading} rightIcon={<ArrowRight className="w-4 h-4"/>}>
                {loading ? 'Verifying Account...' : 'Send Reset Link'}
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Account Verified</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                Redirecting you to reset password page...
              </p>
              <Link to={`/reset-password?email=${encodeURIComponent(email)}`}>
                <Button className="w-full font-bold">Proceed to Reset Password</Button>
              </Link>
            </motion.div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
            <Link to="/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
