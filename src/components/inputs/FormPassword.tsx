'use client';

import { Password } from 'primereact/password';

interface FormPasswordProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  toggleMask?: boolean;
  feedback?: boolean;
}

export function FormPassword({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  toggleMask = true,
  feedback = false,
}: FormPasswordProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Password
        id={name}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${error ? 'p-invalid' : ''}`}
        disabled={disabled}
        toggleMask={toggleMask}
        feedback={feedback}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
