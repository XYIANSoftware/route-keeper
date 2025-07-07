'use client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useAuth } from '@/hooks';
import Link from 'next/link';
import { LoadingImage } from '@/components';

export function HeroSection() {
  const { user: authUser } = useAuth();

  return (
    <section className="flex flex-column align-items-center justify-content-center min-h-screen p-4 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>

      {/* Cyan accent lines */}
      <div className="absolute top-20 left-10 w-32 h-1 bg-cyan-400 border-round opacity-60"></div>
      <div className="absolute bottom-40 right-20 w-24 h-1 bg-cyan-400 border-round opacity-60"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-1 bg-cyan-400 border-round opacity-40"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Title */}
        <div className="flex flex-column align-items-center mb-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 line-height-2">
            RouteKeeper
          </h1>

          <p className="text-xl md:text-2xl text-amber-100 mb-6 max-w-3xl mx-auto line-height-3">
            Professional route tracking for truck drivers.
            <span className="text-cyan-300 font-semibold">
              {' '}
              Track drives, manage stops, and optimize your routes
            </span>{' '}
            with our mobile-first platform.
          </p>
        </div>



        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Card className="bg-white-alpha-10 border-white-alpha-20 text-center p-4">
            <div className="w-3rem h-3rem bg-cyan-400-alpha-20 border-round-lg flex align-items-center justify-content-center mb-3 mx-auto">
              <i className="pi pi-car text-cyan-400 text-xl"></i>
            </div>
            <h3 className="text-white font-semibold mb-2 m-0">GPS Tracking</h3>
            <p className="text-amber-100 text-sm m-0">
              Automatic drive tracking with precise GPS coordinates
            </p>
          </Card>

          <Card className="bg-white-alpha-10 border-white-alpha-20 text-center p-4">
            <div className="w-3rem h-3rem bg-cyan-400-alpha-20 border-round-lg flex align-items-center justify-content-center mb-3 mx-auto">
              <i className="pi pi-mobile text-cyan-400 text-xl"></i>
            </div>
            <h3 className="text-white font-semibold mb-2 m-0">Mobile First</h3>
            <p className="text-amber-100 text-sm m-0">
              Optimized for mobile use with touch-friendly interface
            </p>
          </Card>

          <Card className="bg-white-alpha-10 border-white-alpha-20 text-center p-4">
            <div className="w-3rem h-3rem bg-cyan-400-alpha-20 border-round-lg flex align-items-center justify-content-center mb-3 mx-auto">
              <i className="pi pi-shield text-cyan-400 text-xl"></i>
            </div>
            <h3 className="text-white font-semibold mb-2 m-0">Secure & Fast</h3>
            <p className="text-amber-100 text-sm m-0">
              Built with modern tech for security and performance
            </p>
          </Card>
        </div>
      </div>


    </section>
  );
}
