import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Home = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Track login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // ✅ Handle explore form
  const handleSearch = (e) => {
    e.preventDefault();
    const city = query.trim();
    if (!user) {
      alert("Please login to explore.");
      navigate("/login");
      return;
    }
    if (city) {
      navigate(`/explore?city=${encodeURIComponent(city)}`);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error", err);
      alert("Logout failed");
    }
  };

  const trendingCities = [
    "Goa",
    "Manali",
    "Tokyo",
    "Sydney",
    "Jaipur",
    "Agra",
    "Lonavla",
  ];

  const cityImages = {
    Goa: "/../goa.png",
    Manali: "/../manali.png",
    Tokyo: "/../tokyo.png",
    Sydney: "/../sydney.png",
    Jaipur: "/../jaipur.png",
    Agra: "/../agra.png",
    Lonavla: "/../lonavla.png",
  };

  return (
    <div className={styles.container}>
      {/* ✅ Navbar */}
      <header className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <span>🧭</span>
          <span className={styles.logoText}>Travlio</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link to={user ? "/" : "/login"}>My Trips</Link>
          {user ? (
            <>
              <span className={styles.userInfo}>👤 {user.displayName}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Where are you going next?</h1>
        <p className={styles.subtitle}>
          Discover real-time weather and curated travel tips for your dream
          destination.
        </p>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search city e.g. Paris"
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className={styles.button}>
            🔍 Explore Weather
          </button>
        </form>
      </section>

      {/* ✅ Trending */}
      <section className={styles.trending}>
        <h2>Trending</h2>
        <div className={styles.trendingScroll}>
          {trendingCities.map((city) => (
            <Link
              key={city}
              to={user ? `/explore?city=${encodeURIComponent(city)}` : "/login"}
              className={styles.cityCard}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  alert("Please login to explore this city.");
                  navigate("/login");
                }
              }}
            >
              <img src={cityImages[city] || "/fallback.jpg"} alt={city} />
              <span className={styles.cityName}>{city}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ✅ Testimonials */}
      <section className={styles.testimonials}>
        <h2>What fellow wanderers say</h2>
        <div className={styles.testimonialCards}>
          {[
            {
              quote:
                "The weather insights were spot-on and helped me pack exactly what I needed for Tokyo. Loved it!",
              name: "Ava Johnson",
              role: "Digital Nomad",
              img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
            },
            {
              quote:
                "Planning my Goa getaway was a breeze. The curated travel tips were super helpful.",
              name: "Lucas Fernandes",
              role: "Backpacker",
              img: "https://images.unsplash.com/photo-1552053831-71594a27632d",
            },
            {
              quote:
                "The ‘My Trips’ dashboard keeps everything organized. Perfect companion for frequent travelers.",
              name: "Priya Patel",
              role: "Travel Blogger",
              img: "https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9",
            },
          ].map((t, i) => (
            <div key={i} className={styles.testimonialCard}>
              <p>“{t.quote}”</p>
              <div className={styles.testimonialProfile}>
                <img src={t.img} alt={t.name} />
                <div>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.role}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <span className={styles.logoText}>Travlio</span>
            <p>
              Your trusted companion for seamless travel planning and up-to-date
              weather insights.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <div>
              <h4>Product</h4>
              <a href="/features">Features</a>
              <a href="/pricing">Pricing</a>
              <a href="/beta">Beta</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="/about">About Us</a>
              <a href="/blog">Blog</a>
              <a href="/contact">Contact</a>
            </div>
            <div>
              <h4>Follow</h4>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
        <p className={styles.footerBottom}>
          &copy; {new Date().getFullYear()} Travlio. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
