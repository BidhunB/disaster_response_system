"use client";

import React from 'react';

interface Report {
  id: string;
  type: string;
  severity: string;
  timestamp: any;
  status: string;
}

interface StatisticsProps {
  reports: Report[];
}

const Statistics: React.FC<StatisticsProps> = ({ reports }) => {
  const getStats = () => {
    const total = reports.length;
    
    // Today's reports
    const today = reports.filter(r => {
      const reportDate = new Date(r.timestamp.toDate ? r.timestamp.toDate() : r.timestamp);
      const today = new Date();
      return reportDate.toDateString() === today.toDateString();
    }).length;
    
    // This week's reports
    const thisWeek = reports.filter(r => {
      const reportDate = new Date(r.timestamp.toDate ? r.timestamp.toDate() : r.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reportDate >= weekAgo;
    }).length;
    
    // Severity breakdown
    const severityCounts = reports.reduce((acc, report) => {
      const severity = report.severity || 'medium';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Type breakdown
    const typeCounts = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Status breakdown
    const statusCounts = reports.reduce((acc, report) => {
      const status = report.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      today,
      thisWeek,
      severityCounts,
      typeCounts,
      statusCounts
    };
  };

  const stats = getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Reports */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 border border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Reports</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Today's Reports */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 border border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Today</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.today}</p>
          </div>
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* This Week's Reports */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 border border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">This Week</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.thisWeek}</p>
          </div>
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Critical Reports */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 border border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Critical</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.severityCounts.critical || 0}</p>
          </div>
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 