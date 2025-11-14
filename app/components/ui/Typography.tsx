import React from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextSize = 'large' | 'regular' | 'small' | 'mini' | 'micro';

export interface HeadingProps {
  level?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level = 'h1', children, className = '' }) => {
  const Tag = level;

  const styles = {
    h1: 'text-5xl font-black leading-none tracking-tight uppercase',
    h2: 'text-4xl font-black leading-tight tracking-tight uppercase',
    h3: 'text-3xl font-bold leading-tight tracking-wide uppercase',
    h4: 'text-2xl font-bold leading-snug uppercase',
    h5: 'text-xl font-bold leading-normal uppercase',
    h6: 'text-lg font-bold leading-normal uppercase',
  };

  return (
    <Tag className={`text-[var(--color-text-primary)] ${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
};

export interface TextProps {
  size?: TextSize;
  color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = ({
  size = 'regular',
  color = 'primary',
  weight = 'normal',
  children,
  className = '',
  as: Component = 'p',
}) => {
  const sizeStyles = {
    large: 'text-lg leading-relaxed',
    regular: 'text-base leading-relaxed',
    small: 'text-sm leading-normal',
    mini: 'text-xs leading-normal',
    micro: 'text-xs leading-snug',
  };

  const colorStyles = {
    primary: 'text-[var(--color-text-primary)]',
    secondary: 'text-[var(--color-text-secondary)]',
    tertiary: 'text-[var(--color-text-tertiary)]',
    quaternary: 'text-[var(--color-text-quaternary)]',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Component
      className={`${sizeStyles[size]} ${colorStyles[color]} ${weightStyles[weight]} ${className}`}
    >
      {children}
    </Component>
  );
};

