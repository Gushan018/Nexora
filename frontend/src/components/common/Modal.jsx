import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Card, CardContent } from './Card';

export const Modal = ({ isOpen, onClose, title, children }) => {
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md z-10"
          >
<<<<<<< HEAD
            <Card className="shadow-2xl bg-surface/95 backdrop-blur-xl">
              <div className="flex items-center justify-between p-6 border-b border-border/20">
                <h2 className="text-xl font-bold text-textPrimary">{title}</h2>
                <button onClick={onClose} className="p-2 text-muted hover:text-textPrimary transition-colors rounded-full hover:bg-textPrimary/5">
=======
            <Card className="border-slate-300 shadow-2xl bg-surface/95 backdrop-blur-xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-300">
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  <X className="w-5 h-5" />
                </button>
              </div>
              <CardContent className="p-6">
                {children}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
