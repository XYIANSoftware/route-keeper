'use client';

import { InputText } from 'primereact/inputtext';
import { ReactNode } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <InputText
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${error ? 'p-invalid' : ''}`}
          disabled={disabled}
        />
        {icon && <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{icon}</div>}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
