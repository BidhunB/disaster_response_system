// app/components/ReportForm.tsx
"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    lat: "",
    lng: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const handleGetLocation = () => {
    setLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        }));
        setLoadingLocation(false);
      },
      (error) => {
        setLocationError("Failed to get location.");
        console.error("Geolocation error:", error);
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const report = {
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "reports"), report);
      alert("Report submitted!");
      setFormData({ type: "", description: "", lat: "", lng: "" });
    } catch (error) {
      alert("Error submitting report.");
      console.error("Firebase Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        placeholder="Disaster Type"
        className="border p-2 rounded"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      />
      <textarea
        placeholder="Description"
        className="border p-2 rounded"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <div className="flex gap-2 items-center">
       
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loadingLocation}
          className="bg-blue-500 text-white px-2 py-1 rounded "
        >
          {loadingLocation ? "Locating..." : "📍 Use My Location"}
        </button>
      </div>

      {locationError && <p className="text-red-500">{locationError}</p>}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        disabled={!formData.lat || !formData.lng}
      >
        Submit Report
      </button>
    </form>
  );
};

export default ReportForm;
