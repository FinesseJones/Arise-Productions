"use client";

import React from 'react';
import { cn } from '../lib/utils';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500';
  
  const variantStyles = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-surface-3 hover:bg-surface-4 text-contrast-primary',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'hover:bg-surface-3 text-contrast-primary',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-4k-sm',
    md: 'px-4 py-2 text-4k-base',
    lg: 'px-6 py-3 text-4k-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⟳</span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'subtle' | 'medium' | 'strong';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, elevation = 'medium', hover = false }) => {
  const elevationStyles = {
    subtle: 'shadow-subtle',
    medium: 'shadow-medium',
    strong: 'shadow-strong',
  };

  return (
    <div
      className={cn(
        'bg-surface-2 border border-gray-700 rounded-lg',
        elevationStyles[elevation],
        hover && 'hover:shadow-strong transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variantStyles = {
    default: 'bg-surface-3 text-contrast-primary',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  return (
    <span className={cn('px-2 py-1 rounded text-4k-xs font-medium', variantStyles[variant], className)}>
      {children}
    </span>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, label, className }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {label && <div className="text-4k-sm text-contrast-secondary mb-1">{label}</div>}
      <div className="w-full bg-surface-3 rounded-full h-2 overflow-hidden">
        <div
          className="bg-purple-600 h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-4k-xs text-contrast-muted mt-1 text-right">{percentage.toFixed(1)}%</div>
    </div>
  );
};

// Slider Component
interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  onChange,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && <div className="text-4k-sm text-contrast-secondary mb-1">{label}</div>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-purple-600"
      />
      <div className="text-4k-xs text-contrast-muted mt-1 text-right">{value}</div>
    </div>
  );
};

// Toggle Component
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, className }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-gray-600'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
      {label && <span className="text-4k-sm text-contrast-primary">{label}</span>}
    </div>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-4k-sm text-contrast-secondary mb-1">{label}</label>}
      <input
        className={cn(
          'w-full bg-surface-3 text-contrast-primary px-3 py-2 rounded border focus:outline-none focus:border-purple-500 transition-colors',
          error ? 'border-red-500' : 'border-gray-700',
          className
        )}
        {...props}
      />
      {error && <div className="text-4k-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};
