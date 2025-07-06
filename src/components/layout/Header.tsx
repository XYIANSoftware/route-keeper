'use client';

import { Button } from 'primereact/button';
import { useAuth } from '@/providers/app-context';
import Link from 'next/link';
import { LoadingImage } from '@/components/common/LoadingImage';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="header" style={{ backgroundColor: 'rgba(27,20,11,255)', height: '50px' }}>
      <div className="header-container">
        <div className="header-logo">
          <img
            src="/icon-1.png"
            alt="RouteKeeper Logo"
            className="header-logo-icon"
            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
          />
          <span className="header-logo-text" style={{position: 'absolute', width: '100%', textAlign: 'center'}}>RouteKeeper</span>
        </div>
      </div>
    </header>
  );
}
