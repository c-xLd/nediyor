import React from 'react';
import { SearchX, HelpCircle, PackageOpen, ArrowRight } from 'lucide-react';
import { Button } from './Button.js';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'package' | 'help';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Sonuç bulunamadı',
  description = 'Aradığınız kriterlere uygun veri bulunamadı.',
  icon = 'search',
  actionLabel,
  onAction,
  className = ''
}) => {
  const icons = {
    search: <SearchX className="w-10 h-10 text-slate-400" />,
    package: <PackageOpen className="w-10 h-10 text-slate-400" />,
    help: <HelpCircle className="w-10 h-10 text-slate-400" />
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-white border border-slate-200 shadow-sm my-4 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-500">
        {icons[icon]}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="md"
          onClick={onAction}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
