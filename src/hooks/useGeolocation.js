"use client";

import { useEffect, useState } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);

      try {
        console.log("Fetching location from API...");

        const response = await fetch("/api/geolocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("API response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          throw new Error(errorData.error || "Failed to fetch location");
        }

        const data = await response.json();
        console.log("Location data received:", data);

        setLocation(data.location);
      } catch (err) {
        console.error("Geolocation error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { location, error, isLoading };
};

export default useGeolocation;
