// TripContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [tripTitle, setTripTitle] = useState(() => {
    return localStorage.getItem("tripTitle") || "My Trip";
  });

  const [unplannedPlaces, setUnplannedPlaces] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("unplannedPlaces")) || [];
    } catch {
      return [];
    }
  });

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem("tripTitle", tripTitle);
  }, [tripTitle]);

  useEffect(() => {
    localStorage.setItem("unplannedPlaces", JSON.stringify(unplannedPlaces));
  }, [unplannedPlaces]);

  return (
    <TripContext.Provider
      value={{ tripTitle, setTripTitle, unplannedPlaces, setUnplannedPlaces }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used inside TripProvider");
  }
  return context;
};
