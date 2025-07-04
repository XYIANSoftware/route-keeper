import Link from 'next/link';
import { Button } from 'primereact/button';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Image
              src="/icon-1.png"
              alt="RouteKeeper"
              width={96}
              height={96}
              className="w-24 h-24 mx-auto mb-6"
              style={{ width: 'auto', height: 'auto' }}
            />
            <h1 className="text-5xl md:text-6xl font-extrabold text-surface-900 dark:text-surface-0 mb-4">
              RouteKeeper
            </h1>
            <p className="text-xl md:text-2xl text-surface-600 dark:text-surface-400 mb-8">
              The mobile-first drive tracker for truckers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login">
              <Button
                label="Get Started"
                icon="pi pi-play"
                className="p-button-primary p-button-lg"
                size="large"
              />
            </Link>
            <Link href="/login">
              <Button
                label="Sign In"
                icon="pi pi-sign-in"
                className="p-button-outlined p-button-lg"
                size="large"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-surface-0/90 dark:bg-surface-900/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-surface-900 dark:text-surface-0 mb-12">
            Why Choose RouteKeeper?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-car text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-2">
                Track Drives
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                Start and stop drives with GPS tracking and automatic timing
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-map-marker text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-2">
                Manage Stops
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                Record gas stops, food breaks, rest periods, and maintenance
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-mobile text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-2">
                Mobile First
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                Designed for mobile use with responsive, touch-friendly interface
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-shield text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-2">
                Secure & Fast
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                Built with modern tech stack for security, speed, and reliability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary-50/90 dark:bg-primary-900/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-400 mb-8">
            Join thousands of truckers who trust RouteKeeper for their drive tracking needs
          </p>
          <Link href="/login">
            <Button
              label="Start Your Free Trial"
              icon="pi pi-rocket"
              className="p-button-primary p-button-lg"
              size="large"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
