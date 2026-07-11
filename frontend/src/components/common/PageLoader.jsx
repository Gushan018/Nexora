import React from 'react';
import { motion } from 'framer-motion';

export const PageLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 min-h-[50vh] relative z-50">
      {/* Background ambient glow */}
      <div className="absolute w-32 h-32 bg-primary/20 blur-[50px] rounded-full animate-pulse pointer-events-none" />
      
      <div className="relative w-24 h-24 flex items-center justify-center mb-8">
        {/* Outer Ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle Ring */}
        <motion.div 
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-accent border-l-accent opacity-70"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner Ring */}
        <motion.div 
          className="absolute inset-4 rounded-full border border-transparent border-t-textPrimary/30 border-r-textPrimary/30 opacity-50"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* Center Core */}
        <motion.div 
          className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="text-gray-900 dark:text-white font-bold tracking-widest text-sm uppercase flex items-center gap-1 drop-shadow-md"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
        <motion.span 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
        >.</motion.span>
        <motion.span 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2, times: [0, 0.5, 1] }}
        >.</motion.span>
        <motion.span 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, times: [0, 0.5, 1] }}
        >.</motion.span>
      </motion.div>
    </div>
  );
};

