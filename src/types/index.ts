// Database Types (matching Supabase schema)
export interface User {
  id: string;
  email: string;
  username: string;
  created_at?: string;
  updated_at?: string;
}

export interface Drive {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  start_latitude?: number;
  start_longitude?: number;
  end_latitude?: number;
  end_longitude?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Stop {
  id: string;
  drive_id: string;
  category: 'gas' | 'food' | 'rest' | 'maintenance' | 'other';
  notes?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export interface DriveWithStops extends Drive {
  stops: Stop[];
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  username: string;
  email: string;
  password: string;
}

export interface StopForm {
  category: Stop['category'];
  notes?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface AuthResponse {
  user: User | null;
  error?: string;
}

// Component Props Types
export interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export interface FormPasswordProps {
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

export interface FormDropdownProps {
  label: string;
  name: string;
  options: DropdownOption[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  itemTemplate?: (option: DropdownOption) => React.ReactNode;
  valueTemplate?: (option: DropdownOption) => React.ReactNode;
}

export interface FormTextareaProps {
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

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

// Utility Types
export interface DropdownOption {
  label: string;
  value: string | number;
  icon?: string;
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface DriveStats {
  totalDrives: number;
  totalDuration: number;
  totalStops: number;
  averageDriveTime: number;
  mostCommonStopType: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface DriveContextType {
  currentDrive: Drive | null;
  drives: Drive[];
  loading: boolean;
  startDrive: () => Promise<void>;
  stopDrive: () => Promise<void>;
  addStop: (category: Stop['category'], notes?: string) => Promise<void>;
}

// Route Types
export interface RouteParams {
  username: string;
  driveid?: string;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

// Theme Types
export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}
