'use client';

import { Card } from 'primereact/card';
import Link from 'next/link';
import { LoadingImage } from '@/components/common/LoadingImage';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-2xl border border-amber-200/50">
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center space-x-3 mb-6">
              <LoadingImage
                src="/icon-1.png"
                alt="RouteKeeper"
                width={75}
                height={75}
                className="w-16 h-16 rounded-lg shadow-md"
                priority
              />
              <span className="text-2xl font-bold text-amber-900">RouteKeeper</span>
            </Link>
            <h1 className="text-4xl font-bold text-amber-900 mb-4">Terms of Service</h1>
            <p className="text-amber-700">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-amber max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                By accessing and using RouteKeeper, you accept and agree to be bound by the terms
                and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">2. Description of Service</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                RouteKeeper is a mobile-first drive tracking application designed for truck drivers
                to track their drives, manage stops, and optimize routes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">3. User Accounts</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                You are responsible for maintaining the confidentiality of your account and
                password. You agree to accept responsibility for all activities that occur under
                your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">4. Privacy and Data</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also
                governs your use of the service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">5. Acceptable Use</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                You agree not to use the service for any unlawful purpose or to solicit others to
                perform unlawful acts. You agree not to violate any international, federal,
                provincial, or state regulations, rules, laws, or local ordinances.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">6. Termination</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                We may terminate or suspend your account and bar access to the service immediately,
                without prior notice or liability, under our sole discretion, for any reason
                whatsoever.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                In no event shall RouteKeeper, nor its directors, employees, partners, agents,
                suppliers, or affiliates, be liable for any indirect, incidental, special,
                consequential, or punitive damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">8. Contact Information</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at
                support@routekeeper.com
              </p>
            </section>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-amber-200">
            <Link
              href="/"
              className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-semibold"
            >
              <i className="pi pi-arrow-left mr-2"></i>
              Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
