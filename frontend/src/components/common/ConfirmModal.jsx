import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmation Required', 
  message = 'Are you sure you want to perform this action?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false 
}) => {
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full z-10 max-w-md bg-white dark:bg-[#151D2F] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
              isDanger ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
            )}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 pr-6">
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white leading-tight mb-1">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
            </div>
            <button 
              onClick={onClose} 
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-5 py-2 text-sm border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button 
              onClick={onConfirm}
              isLoading={isLoading}
              className={cn(
                "px-5 py-2 text-sm font-bold border-none",
                isDanger 
                  ? "bg-rose-600 hover:bg-rose-700 text-white" 
                  : "bg-amber-500 hover:bg-amber-600 text-slate-950"
              )}
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
