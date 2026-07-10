import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({
  className,
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
<<<<<<< HEAD
        <label className="text-sm font-medium text-textPrimary/90">
=======
        <label className="text-sm font-medium text-slate-800">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
<<<<<<< HEAD
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted/60">
=======
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
<<<<<<< HEAD
            "flex w-full rounded-xl border border-border/20 bg-surface/50 px-3 py-2 text-sm text-textPrimary placeholder:text-textPrimary/40",
=======
            "flex w-full rounded-xl border border-white/10 bg-surface/50 px-3 py-2.5 text-sm text-white placeholder:text-white/40",
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50",
            className
          )}
          {...props}
        />
        {rightIcon && (
<<<<<<< HEAD
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted/60">
=======
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
<<<<<<< HEAD
        <p className={cn("text-xs", error ? "text-red-400" : "text-muted/60")}>
=======
        <p className={cn("text-xs", error ? "text-red-400" : "text-slate-500")}>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
