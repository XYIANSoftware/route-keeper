import './globals.css';
import { PrimeReactProvider, AppContextProvider } from '@/providers';
import { Header } from '@/components';
import { DebugAuth } from '@/components/DebugAuth';

export const metadata = {
  title: {
    default: 'RouteKeeper - Mobile Drive Tracker for Truckers',
    template: '%s | RouteKeeper',
  },
  description:
    'Mobile-first web application for truck drivers to track drives, stops, and routes with GPS coordinates and comprehensive analytics.',
  keywords: [
    'truck driver',
    'drive tracker',
    'GPS tracking',
    'route management',
    'stop tracking',
    'fleet management',
    'mobile app',
  ],
  authors: [{ name: 'RouteKeeper Team' }],
  creator: 'RouteKeeper',
  publisher: 'RouteKeeper',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://routekeeper.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://routekeeper.app',
    title: 'RouteKeeper - Mobile Drive Tracker for Truckers',
    description:
      'Mobile-first web application for truck drivers to track drives, stops, and routes with GPS coordinates and comprehensive analytics.',
    siteName: 'RouteKeeper',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RouteKeeper - Mobile Drive Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RouteKeeper - Mobile Drive Tracker for Truckers',
    description:
      'Mobile-first web application for truck drivers to track drives, stops, and routes with GPS coordinates and comprehensive analytics.',
    images: ['/og-image.jpg'],
    creator: '@routekeeper',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-1.png" />
        <link rel="apple-touch-icon" href="/icon-1.png" />
        <meta name="theme-color" content="#7c2d12" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen">
        <PrimeReactProvider>
          <AppContextProvider>
            <Header />
            <main>{children}</main>
            <DebugAuth />
          </AppContextProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
