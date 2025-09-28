"use client";

import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import "flag-icon-css/css/flag-icons.min.css";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

const LocationField = ({
  value,
  onChange,
  placeholder = "Search for cities, states, or countries",
  apiKey,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Google Places API search function
  const searchLocations = async (query) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using Google Places API Text Search
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query,
        )}&type=locality|administrative_area_level_1|country&key=${apiKey}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const data = await response.json();

      if (data.status === "OK") {
        const locations = data.results.slice(0, 6).map((place) => {
          const addressComponents = place.formatted_address.split(", ");
          const countryCode = getCountryCode(place.address_components);

          return {
            label: place.formatted_address,
            value: place.place_id,
            name: place.name,
            types: place.types,
            geometry: place.geometry,
            countryCode: countryCode?.toLowerCase(),
            shortName: place.name,
          };
        });

        setOptions(locations);
      } else {
        throw new Error(data.error_message || "API Error");
      }
    } catch (err) {
      console.error("Location search error:", err);
      setError(err.message);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract country code
  const getCountryCode = (addressComponents) => {
    return addressComponents?.find((component) =>
      component.types.includes("country"),
    )?.short_name;
  };

  // Debounced search to avoid too many API calls
  const debouncedSearch = useMemo(
    () => debounce(searchLocations, 300),
    [apiKey],
  );

  useEffect(() => {
    debouncedSearch(inputValue);

    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  // Get location type icon
  const getLocationIcon = (types) => {
    if (types.includes("country")) return "🌍";
    if (types.includes("administrative_area_level_1")) return "🏛️";
    if (types.includes("locality") || types.includes("sublocality"))
      return "🏙️";
    return "📍";
  };

  // Alternative free API option using REST Countries + OpenStreetMap
  const searchLocationsAlternative = async (query) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using Nominatim (OpenStreetMap) API - Free alternative
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&limit=6&addressdetails=1&accept-language=en`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const data = await response.json();

      const locations = data.map((place) => {
        const address = place.address || {};
        const countryCode = address.country_code?.toUpperCase();

        // Build display name based on available components
        let displayName = place.display_name;
        if (address.city || address.town || address.village) {
          const locality = address.city || address.town || address.village;
          const state = address.state;
          const country = address.country;
          displayName = [locality, state, country].filter(Boolean).join(", ");
        }

        return {
          label: displayName,
          value: place.place_id,
          name:
            place.name ||
            address.city ||
            address.town ||
            address.village ||
            address.country,
          types: [place.type, place.class],
          geometry: {
            location: {
              lat: parseFloat(place.lat),
              lng: parseFloat(place.lon),
            },
          },
          countryCode: countryCode?.toLowerCase(),
          shortName:
            place.name || address.city || address.town || address.village,
          importance: place.importance,
        };
      });

      // Sort by importance if available
      locations.sort((a, b) => (b.importance || 0) - (a.importance || 0));

      setOptions(locations);
    } catch (err) {
      console.error("Location search error:", err);
      setError(err.message);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Use alternative search if no API key provided
  const searchFunction = apiKey ? searchLocations : searchLocationsAlternative;

  const debouncedSearchFinal = useMemo(
    () => debounce(searchFunction, 300),
    [apiKey],
  );

  useEffect(() => {
    debouncedSearchFinal(inputValue);

    return () => {
      debouncedSearchFinal.cancel();
    };
  }, [inputValue, debouncedSearchFinal]);

  return (
    <div className="relative">
      <div className="bg-card flex items-center rounded-md border shadow">
        {value?.address?.country_code && (
          <span
            key={value?.country_code}
            className={`flag-icon flag-icon-${value?.country_code} h-5 w-5 rounded-sm`}
          ></span>
        )}

        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.label || ""}
          loading={loading}
          value={value}
          inputValue={inputValue}
          onInputChange={(event, newInputValue, reason) => {
            if (reason !== "reset") {
              setInputValue(newInputValue);
            }
          }}
          onChange={(event, newValue) => {
            onChange?.(newValue);
          }}
          filterOptions={(x) => x}
          renderOption={(props, option) => (
            <li
              {...props}
              key={option.value}
              className="hover:bg-muted flex cursor-pointer items-center gap-3 border-b px-2 py-1 last:border-b-0"
            >
              <div className="flex flex-1 items-center gap-2">
                {option?.address?.country_code ? (
                  <span
                    key={option?.value}
                    className={`flag-icon flag-icon-${option?.address?.country_code} h-5 w-5 rounded-sm`}
                  ></span>
                ) : (
                  <span className="flex-shrink-0 text-gray-400">
                    {getLocationIcon(option.types)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {option.shortName}
                  </div>
                  <div className="text-muted-foreground truncate text-xs">
                    {option.label}
                  </div>
                </div>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              variant="standard"
              size="small"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                className: "px-4 py-2 flex-1",
                endAdornment: (
                  <div className="flex items-center">
                    {loading && <CircularProgress color="inherit" size={16} />}
                    {params.InputProps.endAdornment}
                  </div>
                ),
              }}
            />
          )}
          className="flex-1"
          isOptionEqualToValue={(option, val) => option?.value === val?.value}
          noOptionsText={
            inputValue.length < 3
              ? "Type at least 3 characters to search"
              : loading
                ? "Searching..."
                : "No locations found"
          }
          PopperProps={{
            className: "shadow-lg border rounded-lg bg-white",
            placement: "bottom-start",
          }}
        />
      </div>
    </div>
  );
};

export default LocationField;
