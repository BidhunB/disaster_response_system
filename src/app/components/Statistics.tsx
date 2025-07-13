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

  const StatCard = ({ title, value, subtitle, color }: {
    title: string;
    value: number;
    subtitle?: string;
    color: string;
  }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const topDisasterTypes = Object.entries(stats.typeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Reports"
          value={stats.total}
          subtitle="All time"
          color="border-blue-500"
        />
        <StatCard
          title="Today"
          value={stats.today}
          subtitle="New reports"
          color="border-green-500"
        />
        <StatCard
          title="This Week"
          value={stats.thisWeek}
          subtitle="Last 7 days"
          color="border-yellow-500"
        />
      </div>

      {/* Severity Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.severityCounts).map(([severity, count]) => (
            <div key={severity} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                severity === 'critical' ? 'bg-red-100 text-red-600' :
                severity === 'high' ? 'bg-orange-100 text-orange-600' :
                severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                <span className="text-lg font-bold">{count}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900 capitalize">{severity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Disaster Types */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Disasters</h3>
        <div className="space-y-3">
          {topDisasterTypes.map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-gray-700">{type}</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.statusCounts).map(([status, count]) => (
            <div key={status} className="text-center p-4 rounded-lg bg-gray-50">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                status === 'resolved' ? 'bg-green-100 text-green-600' :
                status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                <span className="text-sm font-bold">{count}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900 capitalize">
                {status.replace('_', ' ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics; 