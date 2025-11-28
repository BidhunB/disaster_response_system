import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gray-50 dark:bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-9xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium mb-6 border border-red-200 dark:border-red-800">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            Live Emergency Response System
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
            Report disasters <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">instantly</span> 
            <br />
            Help your community <br/> respond<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600"> faster</span>.
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-9xl leading-relaxed">
            Real-time crowd-sourced disaster reporting. Connect with authorities and local communities to coordinate effective emergency response.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/report"
              id="tour-report-btn"
              className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transform hover:-translate-y-0.5"
            >
              Submit a Report
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              View Live Map
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 text-gray-500 dark:text-gray-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verified Reports
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Real-time Updates
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
