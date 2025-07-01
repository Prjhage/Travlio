import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Trip.module.css";
import {
  Trash2,
  ExternalLink,
  Briefcase,
  Search,
  ChevronDown,
  Plus,
  Package,
} from "lucide-react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Trip = () => {
  const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;

  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Fetch user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchTrips(u.uid);
    });
    return unsub;
  }, []);

  // Fetch trips from Firestore
  const fetchTrips = async (uid) => {
    try {
      const tripSnap = await getDocs(collection(db, "users", uid, "trips"));
      const tripList = [];
      for (const docSnap of tripSnap.docs) {
        const trip = { id: docSnap.id, ...docSnap.data() };
        // Attach weather info
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${trip.title}&units=metric&appid=${WEATHER_KEY}`
        );
        const weatherData = await res.json();
        if (weatherData.cod === 200) {
          trip.weather = {
            emoji: getWeatherEmoji(weatherData.weather[0].main),
            temp: Math.round(weatherData.main.temp),
          };
        }
        tripList.push(trip);
      }
      setTrips(tripList);
      setFilteredTrips(tripList);
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  const getWeatherEmoji = (main) => {
    const map = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
    };
    return map[main] || "🌍";
  };

  // Search filter
  useEffect(() => {
    const filtered = trips.filter((t) =>
      t.title?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTrips(filtered);
  }, [query, trips]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this trip?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "trips", id));
      const updated = trips.filter((t) => t.id !== id);
      setTrips(updated);
      setFilteredTrips(updated);
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };

  const handleSort = (type) => {
    let sorted = [...filteredTrips];
    if (type === "alpha") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (type === "recent") sorted.reverse();
    setFilteredTrips(sorted);
    setShowMenu(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <span>🧭</span>
          <span className={styles.logoText}>Travlio</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link to="/explore">Explore</Link>
          <Link to="/">Home</Link>
        </nav>
        {user && (
          <div className={styles.userSection}>
            <span className={styles.userEmail}>
              👤 {user.displayName || user.email}
            </span>
          </div>
        )}
      </header>

      <main className={styles.main}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            <Briefcase /> My Saved Trips
          </h1>
          <div className={styles.controls}>
            <div className={styles.searchGroup}>
              <Search className={styles.searchIcon} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search trips..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.sortGroup}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={styles.sortBtn}
              >
                Sort <ChevronDown size={16} />
              </button>
              {showMenu && (
                <ul className={styles.sortMenu}>
                  <li onClick={() => handleSort("alpha")}>Title (A-Z)</li>
                  <li onClick={() => handleSort("recent")}>Recently Added</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {filteredTrips.length ? (
          <section className={styles.tripGrid}>
            {filteredTrips.map((t) => (
              <article key={t.id} className={styles.card}>
                <header className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>{t.title}</h2>
                  <span className={styles.cardTemp}>
                    {t.weather?.emoji} {t.weather?.temp}°C <br />
                    {t.from} → {t.to}
                  </span>
                </header>
                <div className={styles.cardSummary}>
                  {t.days.map((day, idx) => (
                    <div key={idx}>
                      <strong>Day {day.day || idx + 1}:</strong>{" "}
                      {day.activities?.join(", ")}
                    </div>
                  ))}
                </div>
                <div className={styles.cardActions}>
                  <Link to={`/planner?trip=${t.id}`} className={styles.openBtn}>
                    <ExternalLink size={16} /> Open
                  </Link>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className={styles.deleteBtn}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className={styles.fallback}>
            <Package size={40} />
            <p>No trips saved yet.</p>
            <Link to="/planner" className={styles.planBtn}>
              <Plus size={16} /> Plan a Trip
            </Link>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Travlio
      </footer>
    </div>
  );
};

export default Trip;
