import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/homepage/Home";
import Login from "./components/loginpage/Login";
import Explore from "./components/explorepage/Explore";
import Planner from "./components/planner/Planner";
import Trip from "./components/trip/Trip";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/explore" element={<Explore />} />

      {/* Protected Routes */}
      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <Planner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trip"
        element={
          <ProtectedRoute>
            <Trip />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
