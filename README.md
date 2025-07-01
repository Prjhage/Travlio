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


### 🔹 Explore Page  


### 🔹 Trip Planner  


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


