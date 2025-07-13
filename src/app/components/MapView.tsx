// MapView.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ reports }: { reports: any[] }) => {
  useEffect(() => {
    // This avoids any server-side import of leaflet internals
    import("leaflet").then((L) => {
      // This will only run on the client
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });
    });
  }, []);

  // Calculate map center based on reports
  const mapCenter = useMemo(() => {
    if (reports.length === 0) return [20.5937, 78.9629]; // Default to India center
    
    const totalLat = reports.reduce((sum, report) => sum + report.lat, 0);
    const totalLng = reports.reduce((sum, report) => sum + report.lng, 0);
    
    return [totalLat / reports.length, totalLng / reports.length];
  }, [reports]);

  // Get marker color based on severity
  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'; // red-600
      case 'high': return '#ea580c'; // orange-600
      case 'medium': return '#ca8a04'; // yellow-600
      case 'low': return '#16a34a'; // green-600
      default: return '#3b82f6'; // blue-600
    }
  };

  // Get disaster type icon
  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fire': return '🔥';
      case 'flood': return '🌊';
      case 'earthquake': return '🌋';
      case 'storm': return '⛈️';
      case 'medical emergency': return '🚑';
      case 'traffic accident': return '🚗';
      case 'power outage': return '⚡';
      case 'gas leak': return '💨';
      case 'building collapse': return '🏢';
      default: return '⚠️';
    }
  };

  return (
    <MapContainer 
      center={mapCenter as [number, number]} 
      zoom={reports.length > 0 ? 10 : 5} 
      style={{ height: "600px", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {reports.map((report, index) => (
        <CircleMarker
          key={report.id || index}
          center={[report.lat, report.lng]}
          radius={8}
          fillColor={getMarkerColor(report.severity)}
          color={getMarkerColor(report.severity)}
          weight={2}
          opacity={0.8}
          fillOpacity={0.6}
        >
          <Popup className="custom-popup">
            <div className="p-2 min-w-[250px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{getDisasterIcon(report.type)}</span>
                <h3 className="font-semibold text-gray-900">{report.type}</h3>
              </div>
              
              <div className="mb-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {report.severity?.toUpperCase() || 'MEDIUM'} SEVERITY
                </span>
              </div>
              
              <p className="text-gray-700 text-sm mb-2">{report.description}</p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>📍 {report.lat.toFixed(4)}, {report.lng.toFixed(4)}</p>
                <p>🕒 {new Date(report.timestamp.toDate ? report.timestamp.toDate() : report.timestamp).toLocaleString()}</p>
                {report.contactInfo && (
                  <p>📞 {report.contactInfo}</p>
                )}
                <p className={`inline-block px-2 py-1 rounded text-xs ${
                  report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  report.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Status: {report.status || 'pending'}
                </p>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapView;
