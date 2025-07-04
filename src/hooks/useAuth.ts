import { useAuth as useAuthContext } from '@/providers/app-context';

export function useAuth() {
  return useAuthContext();
}
