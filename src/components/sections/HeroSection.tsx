'use client';

import { Button } from 'primereact/button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { LoadingImage } from '@/components/common/LoadingImage';

export function HeroSection() {
  const { user: authUser } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
      </div>

      {/* Cyan accent lines */}
      <div className="absolute top-20 left-10 w-32 h-1 bg-cyan-400 rounded-full opacity-60"></div>
      <div className="absolute bottom-40 right-20 w-24 h-1 bg-cyan-400 rounded-full opacity-60"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-1 bg-cyan-400 rounded-full opacity-40"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <LoadingImage
                src="/icon-1.png"
                alt="RouteKeeper"
                width={120}
                height={120}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-2xl border-4 border-cyan-400/30"
                priority
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                <i className="pi pi-check text-white text-sm"></i>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            RouteKeeper
          </h1>

          <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional route tracking for truck drivers.
            <span className="text-cyan-300 font-semibold">
              {' '}
              Track drives, manage stops, and optimize your routes
            </span>{' '}
            with our mobile-first platform.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {authUser ? (
            <Link href={`/${authUser.username}/dashboard`}>
              <Button
                label="Go to Dashboard"
                icon="pi pi-home"
                size="large"
                className="p-button-primary bg-cyan-500 border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600 px-8 py-3 text-lg"
              />
            </Link>
          ) : (
            <>
              <Link href="/signup">
                <Button
                  label="Start Free Trial"
                  icon="pi pi-rocket"
                  size="large"
                  className="p-button-primary bg-cyan-500 border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600 px-8 py-3 text-lg"
                />
              </Link>
              <Link href="/login">
                <Button
                  label="Sign In"
                  icon="pi pi-sign-in"
                  outlined
                  size="large"
                  className="p-button-outlined border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 text-lg"
                />
              </Link>
            </>
          )}
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <i className="pi pi-car text-cyan-400 text-xl"></i>
            </div>
            <h3 className="text-white font-semibold mb-2">GPS Tracking</h3>
            <p className="text-amber-100 text-sm">
              Automatic drive tracking with precise GPS coordinates
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <i className="pi pi-mobile text-cyan-400 text-xl"></i>
            </div>
            <h3 className="text-white font-semibold mb-2">Mobile First</h3>
            <p className="text-amber-100 text-sm">
              Optimized for mobile use with touch-friendly interface
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <i className="pi pi-shield text-cyan-400 text-xl"></i>
            </div>
            <h3 className="text-white font-semibold mb-2">Secure & Fast</h3>
            <p className="text-amber-100 text-sm">
              Built with modern tech for security and performance
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
