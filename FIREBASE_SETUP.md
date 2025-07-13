# 🔥 Firebase Setup Guide

This guide will help you set up Firebase for the Disaster Response System.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "disaster-response-system")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project, click the gear icon ⚙️
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "disaster-response-web")
6. Click "Register app"
7. Copy the configuration object

## Step 4: Update Firebase Configuration

Replace the placeholder values in `src/lib/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: 'your-actual-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};
```

## Step 5: Set Up Security Rules

In Firestore Database > Rules, update the security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{document} {
      allow read, write: if true; // For development - change for production
    }
  }
}
```

## Step 6: Environment Variables (Optional)

For production, create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

Then update `src/lib/firebase.ts` to use environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
```

## Step 7: Test the Setup

1. Run your development server: `npm run dev`
2. Open the application in your browser
3. Try submitting a test report
4. Check if the report appears in your Firestore database

## Production Security Rules

For production deployment, update the security rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{document} {
      allow read: if true; // Anyone can read reports
      allow write: if request.time < timestamp.date(2025, 1, 1); // Temporary write access
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - This usually means Firebase is being initialized multiple times
   - Check that you're not importing Firebase in multiple places

2. **"Missing or insufficient permissions"**
   - Check your Firestore security rules
   - Make sure you're in test mode for development

3. **"Network request failed"**
   - Check your internet connection
   - Verify your Firebase project is active
   - Check if your API key is correct

4. **Reports not appearing in real-time**
   - Make sure you have the correct collection name ("reports")
   - Check that your security rules allow read/write access

## Support

If you encounter issues:
1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [Next.js Firebase Integration Guide](https://nextjs.org/docs/authentication#firebase)
3. Create an issue in the project repository 