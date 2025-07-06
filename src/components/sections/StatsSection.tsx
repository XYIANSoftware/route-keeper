'use client';

export function StatsSection() {
  const stats = [
    {
      number: '10,000+',
      label: 'Active Drivers',
      icon: 'pi pi-users',
      color: 'text-cyan-500',
    },
    {
      number: '500K+',
      label: 'Drives Tracked',
      icon: 'pi pi-car',
      color: 'text-amber-600',
    },
    {
      number: '99.9%',
      label: 'Uptime',
      icon: 'pi pi-shield',
      color: 'text-cyan-500',
    },
    {
      number: '24/7',
      label: 'Support',
      icon: 'pi pi-clock',
      color: 'text-amber-600',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-amber-800 to-amber-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>

      {/* Cyan accent lines */}
      <div className="absolute top-10 left-1/4 w-24 h-1 bg-cyan-400 rounded-full opacity-60"></div>
      <div className="absolute bottom-10 right-1/4 w-32 h-1 bg-cyan-400 rounded-full opacity-60"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Thousands of Drivers
          </h2>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Join the growing community of professional truck drivers who rely on RouteKeeper for
            their daily operations.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div
                  className={`w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <i className={`${stat.icon} ${stat.color} text-2xl`}></i>
                </div>

                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.number}
                </div>

                <div className="text-amber-100 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial preview */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center mr-4">
                <i className="pi pi-user text-white"></i>
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">Mike Johnson</div>
                <div className="text-amber-200 text-sm">Professional Truck Driver</div>
              </div>
            </div>

            <blockquote className="text-amber-100 text-lg italic">
              &ldquo;RouteKeeper has completely transformed how I track my drives. The mobile-first
              design makes it so easy to use while on the road, and the GPS tracking is incredibly
              accurate.&rdquo;
            </blockquote>

            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="pi pi-star-fill text-cyan-400"></i>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
