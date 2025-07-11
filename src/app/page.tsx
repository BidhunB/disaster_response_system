// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import ReportForm from "./components/ReportForm";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
});

export default function Home() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    });

    return () => unsub();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Crowdsourced Disaster Response</h1>
      <ReportForm />
      <MapView reports={reports} />
    </main>
  );
}
