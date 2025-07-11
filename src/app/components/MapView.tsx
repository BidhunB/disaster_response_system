// MapView.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {reports.map((r, i) => (
        <Marker key={i} position={[r.lat, r.lng]}>
          <Popup>
            <strong>{r.type}</strong>
            <br />
            {r.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
