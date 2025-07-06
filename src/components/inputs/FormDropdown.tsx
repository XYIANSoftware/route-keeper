'use client';

import { Dropdown } from 'primereact/dropdown';
import { FormDropdownProps } from '@/types';

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
