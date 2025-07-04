'use client';

import { ReactNode } from 'react';
import { PrimeReactProvider as PrimeProvider } from 'primereact/api';
import 'primeicons/primeicons.css';

export function PrimeReactProvider({ children }: { children: ReactNode }) {
  return <PrimeProvider value={{ unstyled: true, pt: {} }}>{children}</PrimeProvider>;
}
