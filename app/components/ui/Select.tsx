'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  label,
  error,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const baseStyles = `
    relative px-4 py-3
    bg-[var(--color-bg-secondary)]
    border-2
    text-[var(--color-text-primary)]
    cursor-pointer
    transition-all duration-[var(--transition-quick)]
    flex items-center justify-between
    font-medium
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[var(--color-border-secondary)]'}
  `;

  const borderStyles = error
    ? 'border-[var(--color-status-red)]'
    : 'border-[var(--color-border-primary)]';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          {label}
        </label>
      )}
      <div ref={selectRef} className={fullWidth ? 'w-full' : ''}>
        <div
          className={`${baseStyles} ${borderStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={selectedOption ? '' : 'text-[var(--color-text-quaternary)]'}>
            {selectedOption?.label || placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && !disabled && (
          <div
            className={`
              absolute z-50 mt-2
              ${fullWidth ? 'w-full' : 'min-w-[200px]'}
              bg-[var(--color-bg-secondary)]
              border-2 border-[var(--color-border-primary)]
              shadow-[var(--shadow-medium)]
              max-h-60 overflow-auto
            `}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`
                  px-4 py-2
                  cursor-pointer
                  transition-colors duration-[var(--transition-quick)]
                  ${
                    option.value === selectedValue
                      ? 'bg-[var(--color-accent)] bg-opacity-20 text-[var(--color-accent)]'
                      : 'hover:bg-[var(--color-bg-quaternary)]'
                  }
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => !option.disabled && handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-[var(--color-status-red)]">{error}</p>}
    </div>
  );
};

export default Select;

