import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DarkModeToggle from "./components/DarkModeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Disaster Response System - Crowdsourced Emergency Reports",
  description: "Real-time crowdsourced disaster reporting and response coordination system",
  keywords: "disaster response, emergency reporting, crowdsourcing, crisis management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen dark:bg-gray-900 dark:text-gray-100`}
      >
        
        {children}
      </body>
    </html>
  );
}
