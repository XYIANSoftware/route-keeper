'use client';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export function FeaturesSection() {
  const features = [
    {
      icon: 'pi pi-car',
      title: 'Track Drives',
      description: 'Start and stop drives with GPS tracking and automatic timing',
      color: 'bg-cyan-500',
    },
    {
      icon: 'pi pi-map-marker',
      title: 'Manage Stops',
      description: 'Record gas stops, food breaks, rest periods, and maintenance',
      color: 'bg-amber-500',
    },
    {
      icon: 'pi pi-mobile',
      title: 'Mobile First',
      description: 'Designed for mobile use with responsive, touch-friendly interface',
      color: 'bg-cyan-500',
    },
    {
      icon: 'pi pi-chart-bar',
      title: 'Analytics',
      description: 'View detailed analytics and insights about your driving patterns',
      color: 'bg-amber-500',
    },
    {
      icon: 'pi pi-shield',
      title: 'Secure & Fast',
      description: 'Built with modern tech stack for security, speed, and reliability',
      color: 'bg-cyan-500',
    },
    {
      icon: 'pi pi-clock',
      title: 'Real-time',
      description: 'Real-time tracking and updates with instant synchronization',
      color: 'bg-amber-500',
    },
  ];

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-amber-100 to-amber-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 m-0">
            Why Choose RouteKeeper?
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto m-0">
            Professional tools designed specifically for truck drivers to optimize their routes and
            improve efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-4 border-1 border-amber-200 hover:shadow-6 transition-all duration-300 group"
            >
              <div className="text-center p-4">
                <div
                  className={`w-4rem h-4rem ${feature.color} border-round-xl flex align-items-center justify-content-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <i className={`${feature.icon} text-white text-2xl`}></i>
                </div>

                <h3 className="text-2xl font-bold text-amber-900 mb-3 m-0">{feature.title}</h3>

                <p className="text-amber-700 line-height-3 mb-4 m-0">{feature.description}</p>

                <div className="pt-3 border-top-1 border-amber-200">
                  <Button
                    label="Learn more"
                    icon="pi pi-arrow-right"
                    className="p-button-text text-cyan-600 font-semibold group-hover:translate-x-1 transition-transform duration-300"
                    iconPos="right"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Cyan accent line */}
        <div className="flex justify-content-center mt-8">
          <div className="w-8rem h-1 bg-cyan-400 border-round"></div>
        </div>
      </div>
    </section>
  );
}
