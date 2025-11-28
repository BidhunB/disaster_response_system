"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BackgroundEffects from "../components/BackgroundEffects";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecialChar) return "Password must contain at least one special character.";
    return null;
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Successfully signed in with Google!");
    } catch (err) {
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        toast.error(passwordError);
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast.success("Account created successfully!");
      } else {
        await signInWithEmail(email, password);
        toast.success("Successfully signed in!");
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error("Email already in use. Please sign in instead.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        toast.error("Invalid email or password.");
      } else if (err.code === 'auth/weak-password') {
        toast.error("Password is too weak.");
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative flex flex-col">
      <BackgroundEffects />
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 relative z-10">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
              ⚡
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {isSignUp ? "Create an account" : "Sign in to ResQ"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Access real-time disaster reporting and response tools
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900 dark:text-white"
                />
                {isSignUp && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Must be at least 8 characters with uppercase, number, and special char.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              Sign in with Google
            </button>

            <div className="text-center mt-4">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
