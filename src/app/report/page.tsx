"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ReportForm from "../components/ReportForm";
import FirebaseStatus from "../components/FirebaseStatus";
import Navbar from "../components/Navbar";
import BackgroundEffects from "../components/BackgroundEffects";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
});

export default function ReportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReports(data);
      setFilteredReports(data);
      setLoading(false);
    }, (error) => {
      console.error("Firebase connection error:", error);
      setLoading(false);
      // For development, show a helpful message
      if (error.code === 'permission-denied') {
        console.log("Firebase permissions error. This is normal if you haven't set up Firebase yet.");
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(report => report.type.toLowerCase().includes(filter.toLowerCase())));
    }
  }, [filter, reports]);

  const getStats = () => {
    const total = reports.length;
    const today = reports.filter(r => {
      const reportDate = new Date(r.timestamp.toDate ? r.timestamp.toDate() : r.timestamp);
      const today = new Date();
      return reportDate.toDateString() === today.toDateString();
    }).length;
    
    const types = [...new Set(reports.map(r => r.type))];
    
    return { total, today, types: types.length };
  };

  const stats = getStats();

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative">
      <BackgroundEffects />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Report Form */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <FirebaseStatus />
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Submit Report
                </h2>
                <ReportForm />
              </div>
            </div>
          </div>

          {/* Right Column - Map and Filters */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 mb-4 border border-gray-200/50 dark:border-gray-800/50">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filter:</h3>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="all">All Reports</option>
                  <option value="flood">Flood</option>
                  <option value="fire">Fire</option>
                  <option value="earthquake">Earthquake</option>
                  <option value="storm">Storm</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="traffic">Traffic Accident</option>
                  <option value="other">Other</option>
                </select>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredReports.length} of {reports.length}
                </span>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-200/50 dark:border-gray-800/50">
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
                  </div>
                </div>
              ) : (
                <MapView reports={filteredReports} />
              )}
            </div>
          </div>
          
        </div>
        {/* Recent Reports List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 mt-4 border border-gray-200/50 dark:border-gray-800/50">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Recent Reports
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredReports.slice(0, 8).map((report, index) => (
                  <div key={report.id || index} className="border-l-2 border-blue-500 pl-3 py-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{report.type}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{report.description}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(report.timestamp.toDate ? report.timestamp.toDate() : report.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                        {report.lat?.toFixed(3)}, {report.lng?.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredReports.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No reports found</p>
                )}
              </div>
            </div>
      </main>
    </div>
  );
}
