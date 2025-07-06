'use client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { LoadingImage } from '@/components/common/LoadingImage';

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
        {/* Logo and Title */}
        <div className="flex flex-column align-items-center mb-6">
          <div className="flex justify-content-center mb-4">
            <div className="relative">
              <LoadingImage
                src="/icon-1.png"
                alt="RouteKeeper"
                width={50}
                height={50}
                className="w-12 h-12 border-round-lg shadow-4 border-3 border-cyan-400"
                priority
              />
              <div className="absolute -top-2 -right-2 w-2rem h-2rem bg-cyan-400 border-circle flex align-items-center justify-content-center">
                <i className="pi pi-check text-white text-sm"></i>
              </div>
            </div>
          </div>

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

        {/* CTA Buttons */}
        <div className="flex flex-column sm:flex-row gap-3 justify-content-center mb-8">
          {authUser ? (
            <Link href={`/${authUser.username}/dashboard`}>
              <Button
                label="Go to Dashboard"
                icon="pi pi-home"
                size="large"
                className="p-button-primary bg-cyan-500 border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600 px-6 py-3 text-lg"
              />
            </Link>
          ) : (
            <>
              <Link href="/signup">
                <Button
                  label="Start Free Trial"
                  icon="pi pi-rocket"
                  size="large"
                  className="p-button-primary bg-cyan-500 border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600 px-6 py-3 text-lg"
                />
              </Link>
              <Link href="/login">
                <Button
                  label="Sign In"
                  icon="pi pi-sign-in"
                  outlined
                  size="large"
                  className="p-button-outlined border-cyan-400 text-cyan-400 hover:bg-cyan-400 px-6 py-3 text-lg"
                />
              </Link>
            </>
          )}
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

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-50 transform -translate-x-1/2 animate-bounce">
        <div className="w-2rem h-3rem border-2 border-cyan-400 border-round-3xl flex justify-content-center">
          <div className="w-1 h-1rem bg-cyan-400 border-round-3xl mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
