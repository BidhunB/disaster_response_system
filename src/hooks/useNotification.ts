"use client";

import { useEffect, useState, useRef } from "react";
import { getToken } from "firebase/messaging";
import { messaging, db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, collection, query, where, onSnapshot, Timestamp, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import * as geofire from "geofire-common";
import toast from "react-hot-toast";

export function useNotification() {
    const { user } = useAuth();
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            setPermission(permission);

            if (permission === "granted") {
                toast.success("Notifications enabled!");

                if (messaging && user) {
                    try {
                        const token = await getToken(messaging, {
                            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                        });
                        if (token) {
                            await updateDoc(doc(db, "users", user.uid), { fcmToken: token });
                        }
                    } catch (e) {
                        console.log("FCM token not available (using local notifications only)");
                    }
                }
            }
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            toast.error("Failed to enable notifications.");
        }
    };

    const updateLocation = async () => {
        if (!user || !navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                lastLocationRef.current = { lat: latitude, lng: longitude };

                const hash = geofire.geohashForLocation([latitude, longitude]);

                try {
                    await setDoc(doc(db, "users", user.uid), {
                        location: {
                            lat: latitude,
                            lng: longitude,
                            geohash: hash,
                        },
                        lastLocationUpdate: new Date(),
                    }, { merge: true });
                } catch (error) {
                    console.error("Error updating location:", error);
                }
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    };

    // Listen for new reports and trigger local notifications
    useEffect(() => {
        if (!user || permission !== "granted") return;

        // Listen for reports from the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const q = query(
            collection(db, "reports"),
            where("timestamp", ">", fiveMinutesAgo),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const report = change.doc.data();
                    const userLoc = lastLocationRef.current;

                    if (userLoc && report.lat && report.lng && report.severity) {
                        const center: [number, number] = [report.lat, report.lng];
                        const userPoint: [number, number] = [userLoc.lat, userLoc.lng];

                        const distanceInKm = geofire.distanceBetween(userPoint, center);

                        let radiusInKm = 0.5;
                        switch (report.severity) {
                            case "low": radiusInKm = 0.5; break;
                            case "medium": radiusInKm = 2; break;
                            case "high": radiusInKm = 5; break;
                            case "critical": radiusInKm = 15; break;
                            case "catastrophic": radiusInKm = 50; break;
                        }

                        if (distanceInKm <= radiusInKm) {
                            new Notification(`Emergency Alert: ${report.type}`, {
                                body: `${report.severity.toUpperCase()} severity incident reported ${distanceInKm.toFixed(1)}km away.`,
                                icon: "/favicon.ico"
                            });

                            toast.error(`ALERT: ${report.type} reported nearby!`, { duration: 5000 });
                        }
                    }
                }
            });
        }, (error) => {
            console.error("NotificationHook: Error listening for reports:", error);
        });

        return () => unsubscribe();
    }, [user, permission]);

    // Automatically update location when user is logged in
    useEffect(() => {
        if (user) {
            updateLocation();
            const interval = setInterval(updateLocation, 15 * 60 * 1000); // 15 minutes
            return () => clearInterval(interval);
        }
    }, [user]);

    return { permission, requestPermission };
}
