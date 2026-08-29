import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'highlight';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/90 text-slate-900 shadow-sm',
    interactive:
      'bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 text-slate-900 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md',
    highlight:
      'bg-gradient-to-b from-white to-slate-50 border border-indigo-200 text-slate-900 shadow-sm shadow-indigo-100'
  };

  return (
    <div
      className={`rounded-2xl p-5 md:p-6 backdrop-blur-sm ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-lg font-semibold tracking-tight text-slate-900 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-sm text-slate-500 mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`mt-5 pt-4 border-t border-slate-100 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
