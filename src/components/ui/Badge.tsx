import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'amber' | 'rose' | 'slate' | 'indigo' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'slate',
  size = 'md',
  dot = false,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5'
  };

  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200/90',
    neutral: 'bg-slate-100/80 text-slate-600 border border-slate-200/70'
  };

  const dotColors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
    slate: 'bg-slate-500',
    neutral: 'bg-slate-400'
  };

  return (
    <span
      className={`inline-flex items-center font-medium leading-none whitespace-nowrap select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
