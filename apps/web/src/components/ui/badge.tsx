import React from 'react';

export interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'default' | 'destructive' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-indigo-100 text-indigo-700',
    default: 'bg-indigo-100 text-indigo-700',
    secondary: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    destructive: 'bg-red-100 text-red-700',
    info: 'bg-sky-100 text-sky-700',
    outline: 'border border-gray-200 text-gray-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  const activeVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${activeVariant} ${sizeStyles[size]} ${className}`}
    >
      {children || label}
    </span>
  );
};
