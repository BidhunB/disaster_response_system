// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import ReportForm from "./components/ReportForm";
import FirebaseStatus from "./components/FirebaseStatus";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
});

export default function Home() {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚨 Disaster Response System
              </h1>
              <p className="text-gray-600 mt-1">
                Crowdsourced emergency reporting and response coordination
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Reports</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{stats.today}</div>
                <div className="text-sm text-gray-500">Today</div>
              </div>
              <a
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                📊 Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Report Form */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <FirebaseStatus />
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  📝 Submit Emergency Report
                </h2>
                <ReportForm />
              </div>
            </div>
          </div>

          {/* Right Column - Map and Filters */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Reports:</h3>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <span className="text-sm text-gray-600">
                  Showing {filteredReports.length} of {reports.length} reports
                </span>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : (
                <MapView reports={filteredReports} />
              )}
            </div>

            {/* Recent Reports List */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Recent Reports
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredReports.slice(0, 10).map((report, index) => (
                  <div key={report.id || index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{report.type}</h4>
                        <p className="text-sm text-gray-600">{report.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(report.timestamp.toDate ? report.timestamp.toDate() : report.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {report.lat?.toFixed(4)}, {report.lng?.toFixed(4)}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredReports.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No reports found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
