// app/components/ReportForm.tsx
"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const disasterTypes = [
  "Flood",
  "Fire",
  "Earthquake",
  "Storm",
  "Medical Emergency",
  "Traffic Accident",
  "Power Outage",
  "Gas Leak",
  "Building Collapse",
  "Other"
];

const severityLevels = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { value: "critical", label: "Critical", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" }
];

const ReportForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    severity: "medium",
    lat: "",
    lng: "",
    contactInfo: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
        let errorMessage = "Failed to get location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please allow location access in your browser settings or use manual coordinates.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please try again or use manual coordinates.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or use manual coordinates.";
            break;
          default:
            errorMessage = "Failed to get location. Please check your browser permissions or use manual coordinates.";
        }
        
        setLocationError(errorMessage);
        console.error("Geolocation error:", error);
        setLoadingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualLocation = () => {
    // Set a default location for testing (you can change these coordinates)
    setFormData((prev) => ({
      ...prev,
      lat: "20.5937", // Default to India center
      lng: "78.9629",
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const report = {
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      timestamp: new Date(),
      status: "pending"
    };

    try {
      await addDoc(collection(db, "reports"), report);
      setSubmitSuccess(true);
      setFormData({ 
        type: "", 
        description: "", 
        severity: "medium",
        lat: "", 
        lng: "",
        contactInfo: ""
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error: any) {
      console.error("Firebase Error:", error);
      
      if (error.code === 'permission-denied') {
        alert("Firebase permissions error. Please check your Firestore security rules. For development, you can use the test location button to simulate reports.");
      } else {
        alert("Error submitting report. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = formData.type && formData.description && formData.lat && formData.lng;

  return (
    <div className="space-y-6">
      {submitSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Report submitted successfully! Emergency responders have been notified.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Disaster Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Disaster Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            required
          >
            <option value="">Select disaster type</option>
            {disasterTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Severity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Severity Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {severityLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData({ ...formData, severity: level.value })}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.severity === level.value
                    ? level.color
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            placeholder="Provide detailed description of the emergency situation..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Information (Optional)
          </label>
          <input
            type="text"
            placeholder="Phone number or email for follow-up"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            value={formData.contactInfo}
            onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location *
          </label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loadingLocation}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingLocation ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting location...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  📍 Use My Current Location
                </div>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleManualLocation}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              🗺️ Use Test Location (For Development)
            </button>
          
          {locationError && (
            <p className="text-red-600 dark:text-red-400 text-sm">{locationError}</p>
          )}
          
          {formData.lat && formData.lng && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 dark:text-green-200 text-sm">
                  Location captured: {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lng).toFixed(4)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Report...
            </div>
          ) : (
            "🚨 Submit Emergency Report"
          )}
        </button>
      </form>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>⚠️ Only submit reports for genuine emergencies</p>
        <p>This information will be shared with emergency responders</p>
      </div>
    </div>
  );
};

export default ReportForm;
