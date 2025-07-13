# 🔥 Firebase Configuration Guide

## Quick Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name: `disaster-response-system`
4. Enable Analytics (optional)
5. Create project

### 2. Enable Firestore
1. Click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location (closest to users)
5. Click "Done"

### 3. Get Configuration
1. Click gear icon ⚙️ (Project settings)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app: `disaster-response-web`
5. Copy config object

### 4. Update Configuration

**Option A: Direct Update (Quick)**
Replace values in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};
```

**Option B: Environment Variables (Recommended)**
Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 5. Set Security Rules
In Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{document} {
      allow read, write: if true; // Development only
    }
  }
}
```

### 6. Test Configuration
1. Run: `npm run dev`
2. Submit a test report
3. Check Firestore Database for the report

## Troubleshooting

### Common Issues:

**"Missing or insufficient permissions"**
- Check Firestore security rules
- Make sure you're in test mode
- Verify project ID is correct

**"Firebase App named '[DEFAULT]' already exists"**
- Check for duplicate Firebase imports
- Restart development server

**"Network request failed"**
- Check internet connection
- Verify API key is correct
- Check if project is active

### Production Security Rules

For production, update rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{document} {
      allow read: if true; // Anyone can read
      allow write: if request.time < timestamp.date(2025, 1, 1); // Temporary write
    }
  }
}
```

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Firebase Guide](https://nextjs.org/docs/authentication#firebase)
- Create issue in repository 