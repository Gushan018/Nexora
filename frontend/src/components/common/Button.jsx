import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-premium text-white hover:shadow-[0_0_20px_rgba(91,124,250,0.4)] border border-transparent",
    secondary: "bg-surface text-white hover:bg-surface/80 border border-white/10 hover:border-white/20",
    outline: "bg-transparent text-white border border-white/20 hover:bg-white/5",
    ghost: "bg-transparent text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "p-2",
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';
