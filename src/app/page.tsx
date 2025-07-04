import Link from 'next/link';
import { Button } from 'primereact/button';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div>
            <i className="pi pi-truck hero-icon"></i>
            <h1 className="hero-title">RouteKeeper</h1>
            <p className="hero-subtitle">The mobile-first drive tracker for truckers</p>
          </div>

          <div className="hero-buttons">
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
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Why Choose RouteKeeper?</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="pi pi-car"></i>
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
    </>
  );
}
