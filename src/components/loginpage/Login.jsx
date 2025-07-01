import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase";

const Login = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("year").textContent = new Date().getFullYear();
  }, []);

  const handleSwitch = (form) => {
    setActiveForm(form);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/trip");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/trip");
    } catch (err) {
      setError("Could not register. Try a different email.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate("/trip");
    } catch (err) {
      setError("Google login failed.");
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
      navigate("/trip");
    } catch (err) {
      setError("GitHub login failed.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <a href="/" className={styles.logo}>
          🧭 <span className={styles.logoText}>Travlio</span>
        </a>
      </header>

      <main className={styles.main}>
        <div className={styles.authBox}>
          {/* LOGIN FORM */}
          {activeForm === "login" && (
            <form className={styles.form} onSubmit={handleLogin}>
              <h2 className={styles.title}>Login to Travlio</h2>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.primaryButton}>
                Login
              </button>
              <p className={styles.switchText}>
                Don’t have an account?{" "}
                <button type="button" onClick={() => handleSwitch("register")}>
                  Register
                </button>
              </p>
              <div className={styles.divider}>or continue with</div>
              <div className={styles.oauthButtons}>
                <button type="button" onClick={handleGoogleLogin}>
                  Google
                </button>
                
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeForm === "register" && (
            <form className={styles.form} onSubmit={handleRegister}>
              <h2 className={styles.title}>Create Your Travlio Account</h2>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.primaryButton}>
                Register
              </button>
              <p className={styles.switchText}>
                Already have an account?{" "}
                <button type="button" onClick={() => handleSwitch("login")}>
                  Login instead
                </button>
              </p>
              <div className={styles.divider}>or sign up with</div>
              <div className={styles.oauthButtons}>
                <button type="button" onClick={handleGoogleLogin}>
                  Google
                </button>
                
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        &copy; <span id="year"></span> Travlio
      </footer>
    </div>
  );
};

export default Login;
