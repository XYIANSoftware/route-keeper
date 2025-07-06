'use client';

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
    <section className="py-20 px-4 bg-gradient-to-br from-amber-100 to-amber-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
            Why Choose RouteKeeper?
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Professional tools designed specifically for truck drivers to optimize their routes and
            improve efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-amber-200/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div
                className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <i className={`${feature.icon} text-white text-2xl`}></i>
              </div>

              <h3 className="text-2xl font-bold text-amber-900 mb-4">{feature.title}</h3>

              <p className="text-amber-700 leading-relaxed">{feature.description}</p>

              <div className="mt-6 pt-4 border-t border-amber-200/50">
                <div className="flex items-center text-cyan-600 font-semibold">
                  <span>Learn more</span>
                  <i className="pi pi-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cyan accent line */}
        <div className="mt-16 flex justify-center">
          <div className="w-32 h-1 bg-cyan-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
