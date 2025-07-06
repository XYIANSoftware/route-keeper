'use client';

import { Card } from 'primereact/card';
import Link from 'next/link';
import { LoadingImage } from '@/components';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-8">
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
            <h1 className="text-4xl font-bold text-amber-900 mb-4">Privacy Policy</h1>
            <p className="text-amber-700">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-amber max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">1. Information We Collect</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an
                account, use our services, or contact us for support.
              </p>
              <ul className="list-disc list-inside text-amber-800 ml-4">
                <li>Account information (username, email, password)</li>
                <li>Drive tracking data (GPS coordinates, timestamps)</li>
                <li>Stop information (location, category, notes)</li>
                <li>Usage analytics and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services,
                including:
              </p>
              <ul className="list-disc list-inside text-amber-800 ml-4">
                <li>Providing drive tracking and route optimization</li>
                <li>Personalizing your experience</li>
                <li>Communicating with you about your account</li>
                <li>Analyzing usage patterns to improve our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">3. Data Security</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                We implement appropriate security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">4. Data Sharing</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third
                parties without your consent, except as described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">5. Your Rights</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                You have the right to access, update, or delete your personal information. You can
                manage your account settings or contact us for assistance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">6. Cookies and Tracking</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience and analyze usage
                patterns. You can control cookie settings through your browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">7. Children&apos;s Privacy</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">9. Contact Us</h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us at
                privacy@routekeeper.com
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
