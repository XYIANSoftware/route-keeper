'use client';

interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export function FormTextarea({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  rows = 3,
}: FormTextareaProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full p-3 border rounded-lg bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
