"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface Report {
  id: string;
  timestamp: any;
  type: string;
  [key: string]: any;
}

interface AccidentRateChartProps {
  reports: Report[];
}

export default function AccidentRateChart({ reports }: AccidentRateChartProps) {
  const data = useMemo(() => {
    const daysMap = new Map<string, number>();
    const today = new Date();
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      daysMap.set(dateStr, 0);
    }

    reports.forEach(report => {
      if (!report.timestamp) return;
      
      const date = report.timestamp.toDate ? report.timestamp.toDate() : new Date(report.timestamp);
      
      // Check if date is within last 7 days
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays <= 7) {
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (daysMap.has(dateStr)) {
          daysMap.set(dateStr, (daysMap.get(dateStr) || 0) + 1);
        }
      }
    });

    return Array.from(daysMap.entries()).map(([date, count]) => ({
      date: date.split(',')[0], // Just show "Mon Nov 28" -> "Mon" part or similar if needed, but let's keep it short. 
      // Actually, let's just show "Mon" or "Tue" for brevity on XAxis, but full date in tooltip.
      fullDate: date,
      count
    }));
  }, [reports]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-lg rounded-xl">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{payload[0].payload.fullDate}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
            {payload[0].value} Accidents
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 border border-gray-200/50 dark:border-gray-800/50">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Daily Accident Rate</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Number of reported accidents over the last 7 days
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-800" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
              ))}
            </Bar>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stopColor="#FF5757" stopOpacity={1}/>   {/* Light Red */}
<stop offset="100%" stopColor="#B80000" stopOpacity={1}/> {/* Dark Red */}




              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
