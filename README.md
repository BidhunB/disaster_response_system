# 🚨 Disaster Response System

A real-time, crowdsourced emergency reporting and response coordination web application built with Next.js, React, Firebase, and Leaflet.

<p align="center">
  <a href="https://disaster-response-system-six.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-%F0%9F%9A%80-blue?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

## 🌟 Features

### 📱 Emergency Reporting
- **Real-time Location Detection**: Automatic GPS location capture
- **Multiple Disaster Types**: Fire, Flood, Earthquake, Storm, Medical Emergency, Traffic Accident, Power Outage, Gas Leak, Building Collapse
- **Severity Levels**: Low, Medium, High, Critical with color-coded indicators
- **Instant Submission**: Real-time report submission with Firebase
- **Image Upload**: (Planned) Support for attaching images to reports

### 🗺️ Interactive Mapping
- **Live Map View**: Real-time visualization of all emergency reports
- **Color-coded Markers**: Severity-based marker colors (Red=Critical, Orange=High, Yellow=Medium, Green=Low)
- **Rich Popups**: Detailed information including type, severity, description, location, and timestamp
- **Dynamic Centering**: Map automatically centers on reported incidents
- **Geospatial Querying**: Efficiently loads reports within a specific radius using `geofire-common`

### 🔐 Secure Authentication
- **Google Sign-In**: One-click login with Google
- **Email/Password**: Traditional account creation with strong password enforcement
- **Protected Routes**: Secure access to reporting and dashboard features
- **User Profiles**: Personalized experience with user avatars

### 🎓 User Onboarding
- **Guided Tour**: Interactive "game-like" walkthrough for new users
- **Spotlight Effect**: Highlights key features (Live Map, Report Button) to get users started quickly
- **Smart Persistence**: Remembers if a user has already seen the tour

### 📊 Analytics Dashboard
- **Real-time Statistics**: Total reports, today's reports, weekly trends
- **Severity Breakdown**: Visual representation of emergency severity distribution
- **Disaster Type Analysis**: Most common emergency types with progress bars
- **Response Status Tracking**: Pending, In Progress, Resolved status tracking
- **Recent Activity Feed**: Latest emergency reports with status indicators

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion (for Guided Tour and UI transitions)
- **Notifications**: React Hot Toast
- **Database**: Firebase Firestore (Real-time)
- **Authentication**: Firebase Auth
- **Mapping**: Leaflet with React-Leaflet
- **Geospatial**: Geofire Common
- **Charts**: Recharts
- **Deployment**: Vercel-ready

## � Firebase Services

The application relies heavily on Firebase for its backend infrastructure:

- **Authentication**: 
  - Google Sign-In provider
  - Email/Password authentication
  - Session management
- **Firestore Database**: 
  - Real-time event listeners for live updates
  - Geospatial querying using `geofire-common`
  - Scalable NoSQL structure for reports
- **Security Rules**: 
  - Protected writes to ensure data integrity
  - Public reads for transparency (configurable)

## �🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd disaster_response_system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a Firebase project and update `src/lib/firebase.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_DOMAIN',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_BUCKET',
     messagingSenderId: 'YOUR_SENDER_ID',
     appId: 'YOUR_APP_ID',
   };
   ```

4. **Set up Firestore Database**
   - Create a Firestore database in your Firebase project
   - Set up security rules for the `reports` collection
   - Enable real-time updates

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
disaster_response_system/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── animations/
│   │   │   ├── GuidedTour.tsx    # Interactive onboarding tour
│   │   │   ├── MapView.tsx       # Leaflet map component
│   │   │   ├── ReportForm.tsx    # Incident reporting form
│   │   │   └── Statistics.tsx    # Dashboard analytics
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── report/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── context/
│   │   └── AuthContext.tsx       # Authentication state management
│   ├── hooks/
│   │   └── useNotification.ts    # Custom notification hook
│   └── lib/
│       └── firebase.ts           # Firebase configuration
├── public/
├── package.json
└── README.md
```

## 🎯 Key Components

### GuidedTour
- Implements a "spotlight" effect using SVG masks and `framer-motion`.
- Guides users through the main navigation elements.

### ReportForm
- Handles emergency report submission
- GPS location detection
- Form validation and error handling

### MapView
- Interactive map with real-time markers
- Color-coded severity indicators
- Rich popup information

### Statistics
- Real-time analytics dashboard
- Severity and type breakdowns
- Response status tracking

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop browsers
- Mobile devices
- Tablet screens
- Touch interactions

## 🔒 Security Considerations

- **Input Validation**: All form inputs are validated
- **Location Privacy**: GPS location is only captured when explicitly requested
- **Data Protection**: Contact information is optional and encrypted
- **Rate Limiting**: Consider implementing rate limiting for report submissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Emergency Use

⚠️ **Important**: This system is designed for genuine emergency reporting. Please:
- Only submit reports for real emergencies
- Provide accurate information
- Include relevant contact details when possible
- Follow local emergency protocols

---

**Built with ❤️ for emergency response coordination**
