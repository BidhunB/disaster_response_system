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
- **Contact Information**: Optional contact details for follow-up
- **Instant Submission**: Real-time report submission with Firebase

### 🗺️ Interactive Mapping
- **Live Map View**: Real-time visualization of all emergency reports
- **Color-coded Markers**: Severity-based marker colors (Red=Critical, Orange=High, Yellow=Medium, Green=Low)
- **Rich Popups**: Detailed information including type, severity, description, location, and timestamp
- **Dynamic Centering**: Map automatically centers on reported incidents
- **Responsive Design**: Works on desktop and mobile devices

### 📊 Analytics Dashboard
- **Real-time Statistics**: Total reports, today's reports, weekly trends
- **Severity Breakdown**: Visual representation of emergency severity distribution
- **Disaster Type Analysis**: Most common emergency types with progress bars
- **Response Status Tracking**: Pending, In Progress, Resolved status tracking
- **Recent Activity Feed**: Latest emergency reports with status indicators

### 🔍 Advanced Filtering
- **Type-based Filtering**: Filter reports by disaster type
- **Real-time Updates**: Live filtering with instant map updates
- **Report Count Display**: Shows filtered vs total report counts

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Firebase Firestore (Real-time)
- **Mapping**: Leaflet with React-Leaflet
- **Deployment**: Vercel-ready

## 🚀 Getting Started

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
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── ReportForm.tsx
│   │   │   └── Statistics.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── firebase.ts
├── public/
├── package.json
└── README.md
```

## 🎯 Key Components

### ReportForm
- Handles emergency report submission
- GPS location detection
- Form validation and error handling
- Success feedback

### MapView
- Interactive map with real-time markers
- Color-coded severity indicators
- Rich popup information
- Dynamic map centering

### Statistics
- Real-time analytics dashboard
- Severity and type breakdowns
- Response status tracking
- Visual data representation

### Dashboard
- Comprehensive overview page
- Tabbed interface (Overview, Map, Reports)
- Detailed report table
- Recent activity feed

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Set up security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /reports/{document} {
         allow read, write: if true; // For development
       }
     }
   }
   ```

### Environment Variables
Create a `.env.local` file for production:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop browsers
- Mobile devices
- Tablet screens
- Touch interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker containers

## 🔒 Security Considerations

- **Input Validation**: All form inputs are validated
- **Location Privacy**: GPS location is only captured when explicitly requested
- **Data Protection**: Contact information is optional and encrypted
- **Rate Limiting**: Consider implementing rate limiting for report submissions

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

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

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for emergency response coordination**
