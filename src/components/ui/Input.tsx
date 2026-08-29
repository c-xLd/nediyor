import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-slate-900/90 text-slate-100 placeholder-slate-400 border text-sm rounded-xl px-4 py-3 min-h-[44px] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${
              leftIcon ? 'pl-11' : ''
            } ${rightIcon ? 'pr-11' : ''} ${
              error ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30' : 'border-slate-800 hover:border-slate-700'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
