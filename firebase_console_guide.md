# Firebase Console Route Map & Configuration Guide

This guide will help you configure the Firebase Console for the new Notification System and fix the Google Auth issue on your Vercel deployment.

## 1. Fix Google Auth on Vercel

If Google Sign-In works locally but fails on Vercel, it's usually because the Vercel domain hasn't been authorized in Firebase.

1.  Go to the **[Firebase Console](https://console.firebase.google.com/)**.
2.  Select your project: **disaster-response-system** (or your project name).
3.  Navigate to **Authentication** > **Settings** > **Authorized domains**.
4.  Click **Add domain**.
5.  Enter your Vercel deployment domain (e.g., `your-project.vercel.app`).
6.  Click **Add**.

## 2. Configure Cloud Messaging (Optional)

To enable the browser to request notification permissions properly, we still use the FCM SDK, although the alerts are triggered locally.

1.  In the Firebase Console, go to **Project settings** (gear icon).
2.  Click on the **Cloud Messaging** tab.
3.  Scroll down to the **Web configuration** section.
4.  Under **Web Push certificates**, click **Generate key pair**.
5.  **Copy the Key Pair** (this is your VAPID Key).
6.  You will need to add this key to your environment variables in Vercel and your local `.env` file as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.

## 3. Firestore Indexes (Important)

The notification system listens for *new* reports. This query might require a composite index in Firestore.

If you see an error in the browser console saying "The query requires an index", simply **click the link in the error message**. It will take you directly to the Firebase Console to create the index automatically.

The query is roughly: `Collection: reports, Fields: timestamp (DESC)`.

## 4. No Billing Required

Since we moved to a client-side notification system, **you do NOT need the Blaze plan**. You can stay on the free **Spark** plan.
