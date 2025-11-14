import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const baseStyles = `
    inline-flex items-center gap-1.5
    font-bold uppercase tracking-wide
    border-2 border-[var(--color-border-primary)]
    transition-colors duration-[var(--transition-quick)]
  `;

  const variantStyles = {
    default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
    success: 'bg-[var(--color-status-green)] text-[var(--color-bauhaus-black)]',
    warning: 'bg-[var(--color-status-yellow)] text-[var(--color-bauhaus-black)]',
    error: 'bg-[var(--color-status-red)] text-[var(--color-bauhaus-white)]',
    info: 'bg-[var(--color-status-blue)] text-[var(--color-bauhaus-white)]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotColors = {
    default: 'bg-[var(--color-text-tertiary)]',
    success: 'bg-[var(--color-status-green)]',
    warning: 'bg-[var(--color-status-orange)]',
    error: 'bg-[var(--color-status-red)]',
    info: 'bg-[var(--color-status-blue)]',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export default Badge;

