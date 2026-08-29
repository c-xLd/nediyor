import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button.js';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Bir Hata Oluştu',
  message = 'Veriler yüklenirken geçici bir sorun meydana geldi. Lütfen tekrar deneyin.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-rose-50/70 border border-rose-200 my-4 shadow-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center mb-4 text-rose-600">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-rose-900 mb-1.5">{title}</h3>
      <p className="text-sm text-rose-700/80 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="md"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Tekrar Dene
        </Button>
      )}
    </div>
  );
};
