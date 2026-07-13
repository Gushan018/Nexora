import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MailCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const EmailVerification = () => {
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Simulate API call for verification
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-40 pb-12">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        
        <div className="text-center mb-8">

        </div>

        <div className="bg-surface/50 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {verifying ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 space-y-6"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
              <div>
                <h2 className="text-xl font-bold text-textPrimary mb-2">Verifying your email...</h2>
                <p className="text-sm text-textPrimary/60">Please wait while we confirm your account.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto border border-green-500/20">
                <MailCheck className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-textPrimary mb-2">Email Verified!</h2>
                <p className="text-sm text-textPrimary/60">
                  Thank you for verifying your email address. Your account is now fully active.
                </p>
              </div>
              <Button onClick={() => navigate('/login')} className="w-full" size="lg" rightIcon={<ArrowRight className="w-4 h-4"/>}>
                Continue to Login
              </Button>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
