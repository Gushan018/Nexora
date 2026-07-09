import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl overflow-hidden bg-white dark:bg-surface/80 shadow-sm dark:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
<<<<<<< HEAD
    <div className={cn("px-6 py-4 border-b border-border/10", className)} {...props}>
=======
    <div className={cn("px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-white/5", className)} {...props}>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
<<<<<<< HEAD
    <h3 className={cn("text-lg font-semibold text-textPrimary", className)} {...props}>
=======
    <h3 className={cn("text-base sm:text-lg font-semibold text-gray-900 dark:text-white", className)} {...props}>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
      {children}
    </h3>
  );
};

export const CardDescription = ({ className, children, ...props }) => {
  return (
<<<<<<< HEAD
    <p className={cn("text-sm text-muted mt-1", className)} {...props}>
=======
    <p className={cn("text-sm text-gray-600 dark:text-white/60 mt-1", className)} {...props}>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
      {children}
    </p>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-4 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...props }) => {
  return (
<<<<<<< HEAD
    <div className={cn("px-6 py-4 border-t border-border/10 flex items-center", className)} {...props}>
=======
    <div className={cn("px-6 py-4 border-t border-gray-200 dark:border-white/5 flex items-center", className)} {...props}>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
      {children}
    </div>
  );
};
