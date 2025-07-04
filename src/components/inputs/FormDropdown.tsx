'use client';

import { Dropdown } from 'primereact/dropdown';
import { ReactNode } from 'react';

interface DropdownOption {
  label: string;
  value: string | number;
  icon?: string;
}

interface FormDropdownProps {
  label: string;
  name: string;
  options: DropdownOption[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  itemTemplate?: (option: DropdownOption) => ReactNode;
  valueTemplate?: (option: DropdownOption) => ReactNode;
}

export function FormDropdown({
  label,
  name,
  options,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  itemTemplate,
  valueTemplate,
}: FormDropdownProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Dropdown
        id={name}
        name={name}
        value={value}
        onChange={e => onChange(e.value)}
        options={options}
        placeholder={placeholder}
        className={`w-full ${error ? 'p-invalid' : ''}`}
        disabled={disabled}
        itemTemplate={itemTemplate}
        valueTemplate={valueTemplate}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
