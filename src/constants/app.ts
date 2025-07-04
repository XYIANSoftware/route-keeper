export const APP_CONFIG = {
  name: 'RouteKeeper',
  description: 'Mobile-first drive tracker for truckers',
  version: '1.2.1',
  url:
    process.env.NODE_ENV === 'production'
      ? 'https://route-keeper.netlify.app'
      : 'http://localhost:3000',
  supportEmail: 'support@routekeeper.app',
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: (username: string) => `/${username}/dashboard`,
  driveDetails: (username: string, driveId: string) => `/${username}/drives/${driveId}`,
} as const;

export const API_ENDPOINTS = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const;

export const GPS_CONFIG = {
  timeout: 10000,
  enableHighAccuracy: true,
  maximumAge: 300000, // 5 minutes
} as const;
