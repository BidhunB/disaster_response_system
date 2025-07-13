"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const FirebaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    checkFirebaseConnection();
  }, []);

  const checkFirebaseConnection = async () => {
    try {
      // Try to read from Firestore
      const querySnapshot = await getDocs(collection(db, "reports"));
      setStatus('connected');
      setErrorMessage('');
    } catch (error: any) {
      setStatus('error');
      if (error.code === 'permission-denied') {
        setErrorMessage('Firebase permissions error. Check your Firestore security rules.');
      } else if (error.code === 'unavailable') {
        setErrorMessage('Firebase service unavailable. Check your internet connection.');
      } else {
        setErrorMessage(`Firebase error: ${error.message}`);
      }
    }
  };

  const testWrite = async () => {
    try {
      const testReport = {
        type: "Test",
        description: "Firebase connection test",
        severity: "low",
        lat: 0,
        lng: 0,
        timestamp: new Date(),
        status: "test"
      };

      const docRef = await addDoc(collection(db, "reports"), testReport);
      setTestResult(`✅ Test successful! Document ID: ${docRef.id}`);
      
      // Clean up test document after 5 seconds
      setTimeout(() => {
        setTestResult('');
      }, 5000);
    } catch (error: any) {
      setTestResult(`❌ Test failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Firebase Connection Status</h3>
      
      <div className="space-y-4">
        {/* Status Indicator */}
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            status === 'connected' ? 'bg-green-500' :
            status === 'error' ? 'bg-red-500' :
            'bg-yellow-500 animate-pulse'
          }`}></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {status === 'connected' ? 'Connected to Firebase' :
             status === 'error' ? 'Firebase Error' :
             'Checking connection...'}
          </span>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-red-800 dark:text-red-200 text-sm">{errorMessage}</p>
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">
              See FIREBASE_CONFIG.md for setup instructions
            </p>
          </div>
        )}

        {/* Test Button */}
        {status === 'connected' && (
          <div className="space-y-2">
            <button
              onClick={testWrite}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              🧪 Test Firebase Write
            </button>
            {testResult && (
              <p className="text-sm text-gray-700 dark:text-gray-300">{testResult}</p>
            )}
          </div>
        )}

        {/* Setup Instructions */}
        {status === 'error' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
            <h4 className="text-blue-900 dark:text-blue-200 font-medium mb-2">Quick Setup:</h4>
            <ol className="text-blue-800 dark:text-blue-300 text-sm space-y-1">
              <li>1. Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
              <li>2. Create a new project</li>
              <li>3. Enable Firestore Database</li>
              <li>4. Set security rules to test mode</li>
              <li>5. Update src/lib/firebase.ts with your config</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseStatus; 