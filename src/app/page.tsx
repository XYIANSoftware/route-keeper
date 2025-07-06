'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{backgroundImage: 'url(/bg-1.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <i className="pi pi-truck text-6xl text-blue-600 mb-6 block"></i>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">RouteKeeper</h1>
            <p className="text-xl text-gray-600 mb-8">The mobile-first drive tracker for truckers</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/signup" 
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
            >
              <i className="pi pi-play mr-2"></i>
              Get Started
            </Link>
            <Link 
              href="/login" 
              className="inline-block px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center font-semibold"
            >
              <i className="pi pi-sign-in mr-2"></i>
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 