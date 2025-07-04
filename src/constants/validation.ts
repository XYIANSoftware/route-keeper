export const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    minLength: 6,
    maxLength: 128,
  },
  notes: {
    maxLength: 500,
  },
} as const;

export const ERROR_MESSAGES = {
  username: {
    required: 'Username is required',
    minLength: 'Username must be at least 3 characters',
    maxLength: 'Username must be less than 30 characters',
    pattern: 'Username can only contain letters, numbers, underscores, and hyphens',
  },
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 6 characters',
    maxLength: 'Password must be less than 128 characters',
  },
  notes: {
    maxLength: 'Notes must be less than 500 characters',
  },
  general: {
    required: 'This field is required',
    networkError: 'Network error. Please try again.',
    unknownError: 'An unexpected error occurred.',
  },
} as const;
