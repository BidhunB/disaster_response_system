"use client";
import { useEffect, useState } from "react";

const getSystemTheme = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
};

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, set theme from localStorage or system
    const saved = localStorage.getItem("theme");
    const initial = saved || getSystemTheme();
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        aria-label="Toggle dark mode"
        className="ml-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition-colors"
      >
        ☀️ Light
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="ml-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
} 