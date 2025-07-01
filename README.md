# 🌍 Travlio – Your Smart Travel Companion

**Travlio** is a modern travel planning web app that helps you search for destinations, check live weather, explore popular attractions, and create personalized trip itineraries with drag-and-drop ease.

Whether you're planning a quick getaway or a long vacation, Travlio helps you stay organized and inspired with real-time data and a beautiful UI.

---

## 🚀 Tech Stack

- **Frontend**: React.js (with Vite)
- **Styling**: CSS Modules
- **State Management**: React Context API
- **Authentication**: Firebase Auth (Email/Password & Google)
- **Database**: Firestore (Firebase Cloud Database)
- **Maps**: Leaflet.js + Geoapify Places API
- **Weather**: OpenWeatherMap API

---

## 📸 Screenshots

### 🔹 Home Page  
![Screenshot 2025-07-01 184618](https://github.com/user-attachments/assets/4f0da58d-95aa-482e-a853-1201166f990b)


### 🔹 Explore Page  

![Screenshot 2025-07-01 184932](https://github.com/user-attachments/assets/3b2d2ce5-ad5d-4b4f-8b2d-e33dfc7c1306)


### 🔹 Trip Planner  
![Screenshot 2025-07-01 185112](https://github.com/user-attachments/assets/d882ad6d-4be6-4526-9330-592d89a03e20)

---

## ✨ Key Features

- 🔐 Secure login with Firebase Auth
- 🌦️ Real-time weather data using OpenWeatherMap API
- 📍 Discover attractions near your destination via Geoapify API
- 🗺️ Interactive map with user & destination markers (Leaflet.js)
- ✍️ Trip planner with drag-and-drop itinerary builder
- 📂 Save and view trip plans from Firestore
- 📱 Fully responsive UI
- 💨 Logout + User Info Display
- 🔄 Live search with city auto-fill

---

## 📁 Folder Structure
```
Travlio/
├── public/
│ └── [Images, Icons, index.html]
├── src/
│ ├── assets/ # Static images and media
│ ├── components/
│ │ ├── homepage/ # Home component
│ │ ├── loginpage/ # Login/Register
│ │ ├── explorepage/ # City exploration
│ │ ├── planner/ # Itinerary planner
│ │ ├── trip/ # Saved trips
│ │ └── ProtectedRoute.jsx
│ ├── store/
│ │ └── TripContext.js # Global trip state
│ ├── firebase.js # Firebase setup
│ ├── App.jsx # App routes
│ └── main.jsx # React entry point
├── .env # Environment variables
└── README.md
```

## 🛠️ Getting Started (Workflow)

### 1. Clone the Repository

```
git clone https://github.com/Prjhage/travlio.git
cd travlio
```
### 2. Install Dependencies

```
npm install
```

### 3. Setup Environment Variables

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_WEATHER_KEY=your_openweather_api_key
VITE_GEOAPIFY_KEY=your_geoapify_api_key
```

### 4. Start the Development Server

```
npm run dev
```

### 🙌 Final Words
Travlio is designed to inspire wanderers, streamline travel planning, and bring joy to trip organization. We hope you enjoy using it as much as we enjoyed building it. 💙

Want to contribute or star the repo? We'd love your support! ⭐
Built by Prajwal Hage using love, logic, and lots of coffee. ☕

