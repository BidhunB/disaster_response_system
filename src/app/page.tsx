import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import GuidedTour from "./components/GuidedTour";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <GuidedTour />
      <Navbar />
      <Hero />
      <HowItWorks />
      
      {/* Simple Footer */}
      <footer className="py-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 ResQ Disaster Response System
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
