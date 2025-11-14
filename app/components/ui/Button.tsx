import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-bold uppercase tracking-wider
      transition-all duration-[var(--transition-quick)]
      focus:outline-none focus:outline-offset-2 focus:outline-2 focus:outline-[var(--color-border-primary)]
      disabled:opacity-50 disabled:cursor-not-allowed
      border-2
      ${fullWidth ? 'w-full' : ''}
    `;

    const variantStyles = {
      primary: `
        bg-[var(--color-accent)] text-[var(--color-brand-text)]
        border-[var(--color-border-primary)]
        hover:translate-x-[-2px] hover:translate-y-[-2px]
        shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)]
      `,
      secondary: `
        bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]
        border-[var(--color-border-primary)]
        hover:translate-x-[-2px] hover:translate-y-[-2px)]
        shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)]
      `,
      ghost: `
        bg-transparent text-[var(--color-text-primary)]
        border-[var(--color-border-primary)]
        hover:bg-[var(--color-bg-tertiary)]
      `,
      danger: `
        bg-[var(--color-status-red)] text-[var(--color-brand-text)]
        border-[var(--color-bauhaus-black)]
        hover:translate-x-[-2px] hover:translate-y-[-2px)]
        shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)]
      `,
      success: `
        bg-[var(--color-status-green)] text-[var(--color-bauhaus-black)]
        border-[var(--color-bauhaus-black)]
        hover:translate-x-[-2px] hover:translate-y-[-2px)]
        shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)]
      `,
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span>{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

