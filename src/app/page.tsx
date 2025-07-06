import Link from 'next/link';
import { Button } from 'primereact/button';
import { LoadingImage } from '@/components/common/LoadingImage';

export default function HomePage() {
  return (
    <>
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div>
            <i className="pi pi-truck hero-icon"></i>
            <h1 className="hero-title">RouteKeeper</h1>
            <p className="hero-subtitle">The mobile-first drive tracker for truckers</p>
      <section className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <LoadingImage
              src="/icon-1.png"
              alt="RouteKeeper"
              width={96}
              height={96}
              className="w-24 h-24 mx-auto mb-6"
            />
            <h1 className="text-5xl md:text-6xl font-extrabold text-surface-900 dark:text-surface-0 mb-4">
              RouteKeeper
            </h1>
            <p className="text-xl md:text-2xl text-surface-600 dark:text-surface-400 mb-8">
              The mobile-first drive tracker for truckers
            </p>
          </div>

          <div className="hero-buttons">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
            <Link href="/login">
              <Button label="Get Started" icon="pi pi-play" size="large" />
            </Link>
            <Link href="/login">
              <Button label="Sign In" icon="pi pi-sign-in" outlined size="large" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Why Choose RouteKeeper?</h2>
      <section className="py-16 px-4 bg-surface-0/90 dark:bg-surface-900/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-surface-900 dark:text-surface-0 mb-12">
            Why Choose RouteKeeper?
          </h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="pi pi-car"></i>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center px-4">
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-car text-2xl text-primary"></i>
              </div>
              <h3 className="feature-title">Track Drives</h3>
              <p className="feature-description">
                Start and stop drives with GPS tracking and automatic timing
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="pi pi-map-marker"></i>
              </div>
              <h3 className="feature-title">Manage Stops</h3>
              <p className="feature-description">
                Record gas stops, food breaks, rest periods, and maintenance
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="pi pi-mobile"></i>
              </div>
              <h3 className="feature-title">Mobile First</h3>
              <p className="feature-description">
                Designed for mobile use with responsive, touch-friendly interface
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="pi pi-shield"></i>
              </div>
              <h3 className="feature-title">Secure & Fast</h3>
              <p className="feature-description">
                Built with modern tech stack for security, speed, and reliability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Tracking?</h2>
          <p className="cta-description">
      <section className="py-16 px-4 bg-primary-50/90 dark:bg-primary-900/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-400 mb-8">
            Join thousands of truckers who trust RouteKeeper for their drive tracking needs
          </p>
          <Link href="/login">
            <Button label="Start Your Free Trial" icon="pi pi-rocket" size="large" />
          </Link>
        </div>
      </section>
    </>
  );
}
