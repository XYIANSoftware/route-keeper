'use client';

import { Button } from 'primereact/button';
import { useAuth } from '@/hooks';
import Link from 'next/link';

export function CTASection() {
  const { user: authUser } = useAuth();

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-amber-800 to-amber-900 rounded-3xl p-12 shadow-2xl border border-amber-200/20 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>

          {/* Cyan accent lines */}
          <div className="absolute top-8 left-8 w-24 h-1 bg-cyan-400 rounded-full opacity-60"></div>
          <div className="absolute bottom-8 right-8 w-32 h-1 bg-cyan-400 rounded-full opacity-60"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Tracking?
            </h2>

            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of truck drivers who trust RouteKeeper for their drive tracking needs.
              Start your free trial today and experience the difference.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-amber-100">
              <div className="flex items-center">
                <i className="pi pi-check-circle text-cyan-400 mr-2"></i>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <i className="pi pi-check-circle text-cyan-400 mr-2"></i>
                <span>Free 30-day trial</span>
              </div>
              <div className="flex items-center">
                <i className="pi pi-check-circle text-cyan-400 mr-2"></i>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional links */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-amber-700">
          <Link href="/help" className="hover:text-cyan-600 transition-colors">
            <Button label="Help & Support" icon="pi pi-question-circle" text />
          </Link>
          <Link href="/terms" className="hover:text-cyan-600 transition-colors">
            <Button label="Terms of Service" icon="pi pi-file" text />
          </Link>
          <Link href="/privacy" className="hover:text-cyan-600 transition-colors">
            <Button label="Privacy Policy" icon="pi pi-shield" text />
          </Link>
        </div>
      </div>
    </section>
  );
}
