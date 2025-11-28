"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  targetId?: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
}

export default function GuidedTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const router = useRouter();

  const steps: Step[] = [
    {
      title: "Welcome to ResQ",
      description: "Your real-time disaster response companion. Let's take a quick tour.",
      position: "center",
    },
    {
      targetId: "tour-live-map",
      title: "Live Map",
      description: "See incidents happening around you in real-time.",
      position: "bottom",
    },
    {
      targetId: "tour-report-btn",
      title: "Report Incidents",
      description: "Spot a hazard? Report it instantly to help your community.",
      position: "bottom",
    },
    {
      targetId: "tour-login-btn",
      title: "Join Us",
      description: "Sign in to start reporting and accessing full features.",
      position: "bottom",
    },
  ];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenGuidedTour");
    if (!hasSeenTour) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updateRect = () => {
      const step = steps[currentStep];
      if (step.targetId) {
        const element = document.getElementById(step.targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Add some padding
          const padding = 8;
          setTargetRect({
            ...rect,
            left: rect.left - padding,
            top: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
            right: rect.right + padding,
            bottom: rect.bottom + padding,
            x: rect.x - padding,
            y: rect.y - padding,
          } as DOMRect);
        }
      } else {
        setTargetRect(null); // Center mode
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, [currentStep, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenGuidedTour", "true");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
      router.push("/login");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-hidden">
        {/* Spotlight Overlay */}
        <div className="absolute inset-0">
          {/* We use a clip-path or multiple divs to create the "hole". 
              Here, using a simple SVG mask is often smoother for rounded corners. */}
          <svg className="w-full h-full">
            <defs>
              <mask id="spotlight-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {targetRect ? (
                  <motion.rect
                    initial={false}
                    animate={{
                      x: targetRect.x,
                      y: targetRect.y,
                      width: targetRect.width,
                      height: targetRect.height,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    rx="12" // Rounded corners for the spotlight
                    fill="black"
                  />
                ) : (
                  // If no target (center step), maybe just darken everything? 
                  // Or let's just not mask anything out, effectively a modal.
                  // For "Welcome" step, we usually want a modal in center.
                  <rect x="0" y="0" width="0" height="0" fill="black" />
                )}
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.7)"
              mask="url(#spotlight-mask)"
            />
          </svg>
        </div>

        {/* Tooltip / Content Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            top: targetRect
              ? targetRect.bottom + 20 // Default below
              : "50%",
            left: targetRect
              ? targetRect.left + targetRect.width / 2
              : "50%",
            x: "-50%",
            y: targetRect ? 0 : "-50%",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="absolute w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800"
          style={{
            // Ensure it stays on screen (basic clamping could be added here if needed)
            maxWidth: "90vw",
          }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {steps[currentStep].title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-1">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? "w-6 bg-red-600"
                        : "w-1.5 bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-lg shadow-red-600/20 transition-colors"
                >
                  {currentStep === steps.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Skip button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
