import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, Sparkles } from 'lucide-react';

export interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  confidenceScore?: number;
  className?: string;
  showLabel?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  maxScore = 10,
  size = 'md',
  confidenceScore,
  className = '',
  showLabel = true
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  const dimensions = {
    sm: { size: 80, stroke: 6, text: 'text-xl', label: 'text-[10px]' },
    md: { size: 130, stroke: 9, text: 'text-3xl sm:text-4xl', label: 'text-xs' },
    lg: { size: 160, stroke: 12, text: 'text-4xl sm:text-5xl', label: 'text-sm' }
  }[size];

  const radius = (dimensions.size - dimensions.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color scheme based on score
  const getColorScheme = (val: number) => {
    if (val >= 8.0) {
      return {
        gradientStart: '#10b981', // emerald-500
        gradientEnd: '#059669',   // emerald-600
        glow: 'rgba(16, 185, 129, 0.15)',
        textColor: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        label: 'Mükemmel'
      };
    }
    if (val >= 6.5) {
      return {
        gradientStart: '#f59e0b', // amber-500
        gradientEnd: '#d97706',   // amber-600
        glow: 'rgba(245, 158, 11, 0.15)',
        textColor: 'text-amber-600',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        label: 'İyi / Dengeli'
      };
    }
    return {
      gradientStart: '#f43f5e', // rose-500
      gradientEnd: '#e11d48',   // rose-600
      glow: 'rgba(244, 63, 94, 0.15)',
      textColor: 'text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Dikkat Edilmeli'
    };
  };

  const scheme = getColorScheme(score);
  const gradientId = `score-gauge-gradient-${Math.round(score * 10)}`;

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30 transition-opacity"
          style={{ background: scheme.glow }}
        />

        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90 origin-center"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={scheme.gradientStart} />
              <stop offset="100%" stopColor={scheme.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Content Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-baseline"
          >
            <span className={`font-black font-['Space_Grotesk'] tracking-tight ${dimensions.text} ${scheme.textColor}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-slate-400 font-semibold text-xs ml-0.5">/10</span>
          </motion.div>

          {size !== 'sm' && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-0.5">
              Konsensüs
            </span>
          )}
        </div>
      </div>

      {/* Label and Confidence Indicator */}
      {showLabel && (
        <div className="mt-3 flex flex-col items-center gap-1">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${scheme.badgeBg}`}>
            {scheme.label}
          </span>
          {confidenceScore !== undefined && (
            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              %{confidenceScore} Güvenilirlik
            </span>
          )}
        </div>
      )}
    </div>
  );
};
