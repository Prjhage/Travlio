import React, { useEffect, useState } from "react";
import Sortable from "sortablejs";
import styles from "./Planner.module.css";
import { useTrip } from "../../store/TripContext";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Planner = () => {
  const { tripTitle, setTripTitle, unplannedPlaces } = useTrip();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [days, setDays] = useState([[]]);
  const [user, setUser] = useState(null);

  // Track logged-in user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsub;
  }, []);

  useEffect(() => {
    makeSortable("unplanned");
    days.forEach((_, idx) => makeSortable(`day-${idx}`));
  }, [days]);

  const makeSortable = (id) => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains("sortable-enabled")) {
      Sortable.create(el, {
        group: "planner",
        animation: 150,
        ghostClass: styles.ghost,
      });
      el.classList.add("sortable-enabled");
    }
  };

  const addDay = () => setDays((prev) => [...prev, []]);
  const deleteDay = (index) =>
    setDays((prev) => prev.filter((_, i) => i !== index));
  const addPlaceholder = (index) => {
    const updated = [...days];
    updated[index].push("");
    setDays(updated);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout.");
    }
  };

  const saveTrip = async () => {
    if (!user) {
      alert("Please login to save your trip.");
      return;
    }

    const plannedDays = days.map((_, idx) => {
      const el = document.getElementById(`day-${idx}`);
      const activities = [...el.querySelectorAll("li")]
        .map((li) => {
          const input = li.querySelector("input");
          return input?.value || li.textContent.trim();
        })
        .filter(Boolean);

      return {
        day: idx + 1,
        activities,
      };
    });

    const tripData = {
      title: tripTitle,
      from: fromDate,
      to: toDate,
      days: plannedDays,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "users", user.uid, "trips"), tripData);
     
      window.location.href = "/trip";
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Failed to save trip. Try again.");
    }
  };

  const clearAll = () => {
    if (window.confirm("Clear all itinerary?")) {
      setDays([]);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🧭</span>
          <span className={styles.logoText}>Travlio</span>
        </a>
        <nav className={styles.navLinks}>
          <a href="/explore" className={styles.navLink}>
            Explore
          </a>
          <a href="/trip" className={styles.navLink}>
            Trips
          </a>
        </nav>

        {user && (
          <div className={styles.userSection}>
            <span className={styles.userEmail}>
              👤 {user.displayName || user.email}
            </span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <main className={styles.main}>
        <section className={`${styles.section} ${styles.visible}`}>
          <div className={styles.sectionTitleRow}>
            <input
              className={styles.tripTitleInput}
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              placeholder="Trip Title"
            />
          </div>
          <div className={styles.dateControls}>
            <div className={styles.dateInputGroup}>
              <label className={styles.dateInputLabel}>From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.dateInputGroup}>
              <label className={styles.dateInputLabel}>To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          </div>
        </section>

        <section className={styles.plannerGrid}>
          <div className={styles.unplannedColumn}>
            <h2 className={styles.sectionTitle}>Unplanned</h2>
            <ul id="unplanned" className={styles.placeList}>
              {unplannedPlaces.length > 0 ? (
                unplannedPlaces.map((place, idx) => (
                  <li key={idx} className={styles.placeItem}>
                    <span>{place.emoji}</span>
                    <span>{place.name || place.title}</span>
                  </li>
                ))
              ) : (
                <li>No attractions added yet. Explore to add.</li>
              )}
            </ul>
          </div>

          <div className={styles.daysContainer}>
            {days.map((day, idx) => (
              <div key={idx} className={styles.dayCard}>
                <div className={styles.dayHeader}>
                  <h3 className={styles.dayTitle}>
                    <span className={styles.dayNumber}>Day {idx + 1}</span>
                  </h3>
                  <button
                    className={styles.deleteDayBtn}
                    onClick={() => deleteDay(idx)}
                  >
                    ❌
                  </button>
                </div>
                <ul id={`day-${idx}`} className={styles.dayList}>
                  {day.map((_, i) => (
                    <li key={i} className={styles.placeItem}>
                      <span>📍</span>
                      <input
                        type="text"
                        defaultValue=""
                        placeholder="New activity..."
                        className={styles.placeholderInput}
                      />
                    </li>
                  ))}
                </ul>
                <button
                  className={styles.addPlaceBtn}
                  onClick={() => addPlaceholder(idx)}
                >
                  ➕ Add Placeholder
                </button>
              </div>
            ))}
            <button className={styles.addDayBtn} onClick={addDay}>
              ➕ Add Day
            </button>
          </div>
        </section>

        <section className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.primaryAction}`}
            onClick={saveTrip}
          >
            Save Trip
          </button>
          <button className={styles.actionBtn} onClick={clearAll}>
            Clear All
          </button>
        </section>
      </main>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Travlio
      </footer>
    </div>
  );
};

export default Planner;
