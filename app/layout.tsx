import './globals.css';
import { PrimeReactProvider } from '@/lib/providers/primereact-provider';
import { AppContextProvider } from '@/lib/providers/app-context';

export const metadata = {
  title: 'RouteKeeper',
  description: 'Mobile-first drive tracker for truckers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <PrimeReactProvider>
          <AppContextProvider>{children}</AppContextProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
