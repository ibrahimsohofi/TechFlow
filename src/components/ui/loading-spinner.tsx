'use client';

import React from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariants = cva(
  'animate-spin',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      variant: {
        default: 'text-primary',
        muted: 'text-muted-foreground',
        destructive: 'text-destructive',
        success: 'text-green-600',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  text?: string;
  showText?: boolean;
}

export function LoadingSpinner({
  size,
  variant,
  text = 'Loading...',
  showText = false,
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="status"
      aria-label={text}
      {...props}
    >
      <Loader2 className={cn(spinnerVariants({ size, variant }))} />
      {showText && (
        <span className="text-sm text-muted-foreground">
          {text}
        </span>
      )}
    </div>
  );
}

// Loading overlay for entire sections
export function LoadingOverlay({
  children,
  isLoading,
  text = 'Loading...',
  className,
  spinnerSize = 'lg',
  ...props
}: {
  children: React.ReactNode;
  isLoading: boolean;
  text?: string;
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size={spinnerSize} />
            <span className="text-sm font-medium text-muted-foreground">
              {text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline loading state for buttons
export function ButtonLoading({
  children,
  isLoading,
  loadingText,
  disabled,
  className,
  ...props
}: {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}

// Progress ring component
export function ProgressRing({
  progress,
  size = 'md',
  strokeWidth = 2,
  className,
  children,
}: {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const radius = (sizeMap[size] - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        className="transform -rotate-90"
        width={sizeMap[size]}
        height={sizeMap[size]}
      >
        {/* Background circle */}
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-300 ease-in-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// Status indicator with loading, success, and error states
export function StatusIndicator({
  status,
  size = 'md',
  text,
  className,
}: {
  status: 'loading' | 'success' | 'error' | 'idle';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}) {
  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <LoadingSpinner size={size} variant="default" />;
      case 'success':
        return <CheckCircle2 className={cn(spinnerVariants({ size, variant: 'success' }))} />;
      case 'error':
        return <AlertCircle className={cn(spinnerVariants({ size, variant: 'destructive' }))} />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (status) {
      case 'loading':
        return 'text-primary';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {getIcon()}
      {text && (
        <span className={cn('text-sm font-medium', getColor())}>
          {text}
        </span>
      )}
    </div>
  );
}

// Skeleton loader components
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Loading states for specific UI patterns
export function LoadingButton({
  isLoading,
  children,
  ...props
}: {
  isLoading: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button disabled={isLoading} {...props}>
      <div className="flex items-center gap-2">
        {isLoading && <LoadingSpinner size="sm" />}
        {children}
      </div>
    </button>
  );
}

export function LoadingCard({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (isLoading) {
    return (
      <div className={cn('p-6 space-y-4', className)}>
        <SkeletonCard />
      </div>
    );
  }

  return <>{children}</>;
}

// Export everything
export {
  LoadingSpinner as default,
  spinnerVariants,
};
