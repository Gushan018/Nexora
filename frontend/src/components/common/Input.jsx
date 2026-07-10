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
        <label className="text-sm font-medium text-gray-700 dark:text-white/90">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-white/40">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "flex w-full rounded-xl border border-gray-300 dark:border-white/10 bg-light-surface dark:bg-surface/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40",
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
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-white/40">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={cn("text-xs", error ? "text-red-500" : "text-gray-500 dark:text-white/60")}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
