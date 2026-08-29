import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/90 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
      <div>
        <Skeleton className="h-44 w-full rounded-xl mb-4" />
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
      <div className="pt-3.5 mt-4 border-t border-slate-100">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
};
