import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap select-none cursor-pointer';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[36px]',
      md: 'text-sm px-4 py-2 rounded-xl gap-2 min-h-[44px]',
      lg: 'text-base px-6 py-3 rounded-xl gap-2.5 min-h-[48px]'
    };

    const variantStyles = {
      primary:
        'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm shadow-indigo-200 hover:shadow-indigo-300',
      secondary:
        'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-sm',
      outline:
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 active:bg-slate-200',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 active:bg-slate-200',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
