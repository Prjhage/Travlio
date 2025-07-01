import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Explore.module.css";
import heroImg from "./../../assets/image1.png";
import { useTrip } from "../../store/TripContext";
import { auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

let leafletMap = null;

const Explore = () => {
  const navigate = useNavigate();
  const { setTripTitle, setUnplannedPlaces } = useTrip();
  const { search } = useLocation();
  const cityParam = new URLSearchParams(search).get("city") || "Paris";
  const city = cityParam.trim().toLowerCase();

  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [thingsToDo, setThingsToDo] = useState([]);
  const [loadingThings, setLoadingThings] = useState(true);

  const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;
  const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  useEffect(() => {
    document.getElementById("year").textContent = new Date().getFullYear();
    fetchWeather();
    fetchLatLonAndAttractions();
  }, [cityParam]);

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityParam}&units=metric&appid=${WEATHER_KEY}`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        setError(data.message);
        return;
      }
      setWeather(data);
      initMap(data.coord.lat, data.coord.lon);
    } catch (err) {
      setError("Failed to load weather data.");
    }
  };

  const fetchLatLonAndAttractions = async () => {
    try {
      const geoRes = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${cityParam}&apiKey=${GEOAPIFY_KEY}`
      );
      const geoData = await geoRes.json();
      if (!geoData.features.length) return;

      const { lat, lon } = geoData.features[0].properties;

      const placesRes = await fetch(
        `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${lon},${lat},5000&limit=6&apiKey=${GEOAPIFY_KEY}`
      );
      const placesData = await placesRes.json();

      const attractions = placesData.features.map((place, index) => ({
        id: index + 1,
        emoji: "📍",
        name: place.properties.name || "Unnamed place",
      }));

      setThingsToDo(
        attractions.length
          ? attractions
          : [{ id: 0, emoji: "😐", name: "No attractions found." }]
      );
    } catch (err) {
      console.error("Attractions fetch error:", err);
      setThingsToDo([
        { id: 0, emoji: "❌", name: "Failed to load attractions" },
      ]);
    } finally {
      setLoadingThings(false);
    }
  };

  const initMap = (lat, lon) => {
    if (leafletMap) {
      leafletMap.remove();
    }

    leafletMap = L.map("map", {
      zoomControl: true,
    }).setView([lat, lon], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(leafletMap);

    L.marker([lat, lon]).addTo(leafletMap).bindPopup("Destination").openPopup();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          L.marker([latitude, longitude])
            .addTo(leafletMap)
            .bindPopup("📍 You are here")
            .openPopup();

          const group = L.featureGroup([
            L.marker([lat, lon]),
            L.marker([latitude, longitude]),
          ]);
          leafletMap.fitBounds(group.getBounds(), { padding: [50, 50] });
        },
        () => {
          console.warn("User location access denied.");
        }
      );
    }

    leafletMap.zoomControl.setPosition("topright");
  };

  const handleAddToTrip = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setTripTitle(cityParam);
    setUnplannedPlaces(thingsToDo);
    navigate("/planner");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <span role="img" aria-label="navigation">
            🧭
          </span>
          <span className={styles.logoText}>Travlio</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link to="/">Home</Link>
          <Link to="/trip">My Trips</Link>
          {user ? (
            <>
              <span className={styles.userInfo}>
                👤 {user.displayName || user.email}
              </span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      {/* Hero Image */}
      <section className={styles.hero}>
        <img src={heroImg} alt="Hero Collage" className={styles.heroImg} />
        <div className={styles.overlay}></div>
        <div className={styles.heroText}>
          <h1 className={styles.cityName}>
            {weather && `${weather.name} ${getFlagEmoji(weather.sys.country)}`}
          </h1>
          {weather && (
            <p className={styles.weatherBrief}>
              {weather.weather[0].main} • {Math.round(weather.main.temp)}°C
            </p>
          )}
        </div>
      </section>

      {/* Weather & Map */}
      <main className={styles.main}>
        <div className={styles.weatherCard}>
          <h2 className={styles.sectionTitle}>☀️ Current Weather</h2>
          {!weather && !error && <p>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {weather && (
            <div className={styles.weather}>
              <div className={styles.weatherTop}>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Weather"
                />
                <div>
                  <p className={styles.temp}>
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p className={styles.desc}>
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>
              <div className={styles.weatherStats}>
                <div>💧 Humidity: {weather.main.humidity}%</div>
                <div>💨 Wind: {weather.wind.speed} m/s</div>
                <div>❄️ Min Temp: {Math.round(weather.main.temp_min)}°C</div>
                <div>🔥 Max Temp: {Math.round(weather.main.temp_max)}°C</div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.mapCard}>
          <h2 className={styles.sectionTitle}>🗺️ Map</h2>
          <div id="map" className={styles.map}></div>
        </div>
      </main>

      {/* Things To Do */}
      <section className={styles.todoSection}>
        <h2 className={styles.sectionTitle}>📋 Things to Do</h2>
        {loadingThings ? (
          <p>Loading things to do...</p>
        ) : (
          <ul className={styles.todoList}>
            {thingsToDo.map((item, idx) => (
              <li key={idx} className={styles.todoCard}>
                <span>{item.emoji}</span> <span>{item.name}</span>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.actionButtons}>
          <button className={styles.primaryButton} onClick={handleAddToTrip}>
            Add to My Trip
          </button>
          <button
            className={styles.outlineButton}
            onClick={() => alert("💡 Feature coming soon!")}
          >
            Save City
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        &copy; <span id="year"></span> Travlio
      </footer>
    </div>
  );
};

function getFlagEmoji(countryCode) {
  return [...countryCode.toUpperCase()]
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt()))
    .join("");
}

export default Explore;
