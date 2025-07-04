'use client';

import { ReactNode } from 'react';
import { PrimeReactProvider as PrimeProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-dark-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export function PrimeReactProvider({ children }: { children: ReactNode }) {
  return <PrimeProvider value={{ unstyled: false, pt: {} }}>{children}</PrimeProvider>;
}
