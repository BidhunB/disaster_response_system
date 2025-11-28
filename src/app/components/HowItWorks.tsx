export default function HowItWorks() {
  const steps = [
    {
      title: "Detect",
      description: "Spot an incident or hazard in your area. Stay vigilant and help keep your community safe.",
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: "Report",
      description: "Share basic details and your location instantly using our secure reporting form.",
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6 3 3 0 000 6zM5 19a2 2 0 012-2h6a2 2 0 012 2v1H5v-1z" />
        </svg>
      ),
    },
    {
      title: "Respond",
      description: "Data helps authorities and communities react faster to emergencies and save lives.",
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Our system streamlines the process of reporting and responding to emergencies, ensuring help arrives where it's needed most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 rounded-3xl transform transition-transform group-hover:-translate-y-2"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
