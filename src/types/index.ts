export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
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

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface DriveContextType {
  currentDrive: Drive | null;
  drives: DriveWithStops[];
  loading: boolean;
  startDrive: () => Promise<void>;
  stopDrive: () => Promise<void>;
  addStop: (category: Stop['category'], notes?: string) => Promise<void>;
  loadDrives: () => Promise<void>;
}
