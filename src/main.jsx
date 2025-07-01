import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Required for routing
import App from "./App.jsx";
import { TripProvider } from "./store/TripContext.jsx"; // ✅ Import your context provider
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TripProvider>
      {" "}
      {/* ✅ Wrap everything inside TripProvider */}
      <BrowserRouter>
        {" "}
        {/* ✅ Needed if using <Link>, <Route>, etc. */}
        <App />
      </BrowserRouter>
    </TripProvider>
  </StrictMode>
);
