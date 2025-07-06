'use client';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { LoadingImage } from '@/components';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-4 border-1 border-amber-200">
          <div className="text-center mb-8">
            <Link href="/" className="flex align-items-center justify-content-center mb-6">
              <LoadingImage
                src="/icon-1.png"
                alt="RouteKeeper"
                width={50}
                height={50}
                className="w-12 h-12 mr-3"
                priority
              />
              <span className="text-2xl font-bold text-amber-900">RouteKeeper</span>
            </Link>
            <h1 className="text-4xl font-bold text-amber-900 mb-4 m-0">Terms of Service</h1>
            <p className="text-amber-700 m-0">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="flex flex-column gap-6">
            <section>
              <h2 className="text-2xl font-bold text-amber-900 mb-3 m-0">1. Acceptance of Terms</h2>
              <p className="text-amber-800 line-height-3 m-0">
                By accessing and using RouteKeeper, you accept and agree to be bound by the terms
                and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 mb-3 m-0">
                2. Description of Service
              </h2>
              <p className="text-amber-800 line-height-3 m-0">
                RouteKeeper is a mobile-first drive tracking application designed for truck drivers
                to track their drives, manage stops, and optimize routes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 mb-3 m-0">3. User Accounts</h2>
              <p className="text-amber-800 line-height-3 m-0">
                You are responsible for maintaining the confidentiality of your account and
                password. You agree to accept responsibility for all activities that occur under
                your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 mb-3 m-0">4. Privacy and Data</h2>
              <p className="text-amber-800 line-height-3 m-0">
                Your privacy is important to us. Please review our Privacy Policy, which also
                governs your use of the service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 mb-3 m-0">5. Acceptable Use</h2>
              <p className="text-amber-800 line-height-3 m-0">
                You agree not to use the service for any unlawful purpose or to solicit others to
                perform unlawful acts. You agree not to violate any international, federal,
                provincial, or state regulations, rules, laws, or local ordinances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 mb-3 m-0">6. Termination</h2>
              <p className="text-amber-800 line-height-3 m-0">
                We may terminate or suspend your account and bar access to the service immediately,
                without prior notice or liability, under our sole discretion, for any reason
                whatsoever.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 mb-3 m-0">
                7. Limitation of Liability
              </h2>
              <p className="text-amber-800 line-height-3 m-0">
                In no event shall RouteKeeper, nor its directors, employees, partners, agents,
                suppliers, or affiliates, be liable for any indirect, incidental, special,
                consequential, or punitive damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-900 mb-3 m-0">8. Contact Information</h2>
              <p className="text-amber-800 line-height-3 m-0">
                If you have any questions about these Terms of Service, please contact us at
                support@routekeeper.com
              </p>
            </section>
          </div>

          <div className="text-center mt-8 pt-6 border-top-1 border-amber-200">
            <Link href="/">
              <Button
                label="Back to Home"
                icon="pi pi-arrow-left"
                className="p-button-outlined text-cyan-600 hover:text-cyan-700 font-semibold"
              />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
