import axios from "axios";
import { useEffect, useState } from "react";

const LOCATION_STORAGE_KEY = "user_location";
const LOCATION_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    if (typeof window === "undefined") return false;
    if (!window.localStorage) return false;

    // Test if localStorage is actually working
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocalStorage] = useState(isLocalStorageAvailable());

  useEffect(() => {
    const getStoredLocation = () => {
      if (!hasLocalStorage) return null;

      try {
        const stored = window.localStorage.getItem(LOCATION_STORAGE_KEY);
        if (!stored) return null;

        const { country, timestamp } = JSON.parse(stored);

        // Check if the stored location is still valid (less than 24 hours old)
        if (Date.now() - timestamp < LOCATION_EXPIRY_TIME) {
          return country;
        }

        // Clear expired location data
        window.localStorage.removeItem(LOCATION_STORAGE_KEY);
        return null;
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        // Clear potentially corrupted data
        if (hasLocalStorage) {
          window.localStorage.removeItem(LOCATION_STORAGE_KEY);
        }
        return null;
      }
    };

    const fetchLocationData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOLOCATION_KEY;
        if (!apiKey) {
          throw new Error("Google Geolocation API key is not configured");
        }

        const res = await axios.post(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`
        );

        if (!res.data?.location) {
          throw new Error("Invalid response from geolocation API");
        }

        const { lat, lng } = res.data.location;

        const locationRes = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );

        if (!locationRes.data?.results) {
          throw new Error("Invalid response from geocoding API");
        }

        const countryResult = locationRes.data.results.find((result) =>
          result.types.includes("country")
        );

        if (!countryResult?.formatted_address) {
          throw new Error("Country not found in geocoding response");
        }

        const country = countryResult.formatted_address.toLowerCase();

        // Store the location data if localStorage is available
        if (hasLocalStorage) {
          const locationData = {
            country,
            timestamp: Date.now(),
          };
          window.localStorage.setItem(
            LOCATION_STORAGE_KEY,
            JSON.stringify(locationData)
          );
        }

        return country;
      } catch (error) {
        console.error("Error fetching location data:", error);
        throw new Error(error.message || "Error fetching location data");
      }
    };

    const initializeLocation = async () => {
      try {
        // First try to get location from localStorage if available
        const storedLocation = getStoredLocation();
        if (storedLocation) {
          setLocation(storedLocation);
          setIsLoading(false);
          return;
        }

        // If no valid stored location, fetch new location
        const country = await fetchLocationData();
        setLocation(country);
      } catch (err) {
        setError(err.message);
        // If there's an error and we have a stored location, use it as fallback
        const storedLocation = getStoredLocation();
        if (storedLocation) {
          setLocation(storedLocation);
          setError("Using cached location due to error: " + err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only run in browser environment
    if (typeof window !== "undefined") {
      initializeLocation();
    }
  }, [hasLocalStorage]); // Add hasLocalStorage to dependencies

  return { location, error, isLoading };
};

export default useGeolocation;
