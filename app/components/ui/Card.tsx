import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, padding = 'md', hover = false, className = '', onClick }, ref) => {
    const baseStyles = `
      bg-[var(--color-bg-secondary)]
      border-2 border-[var(--color-border-primary)]
      transition-all duration-[var(--transition-regular)]
    `;

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hover
      ? `
        cursor-pointer
        hover:translate-x-[-3px] hover:translate-y-[-3px)]
        hover:shadow-[var(--shadow-medium)]
      `
      : '';

    const interactiveStyles = onClick ? 'cursor-pointer' : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${interactiveStyles} ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;

