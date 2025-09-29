"use client";

import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import { debounce } from "lodash";
import { CircleAlert } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const SectionHeader = ({
  iconSrc = "/images/marketing-automation/star-icon.png",
  title,
}) => (
  <div className="flex items-center gap-2">
    <div className="flex size-8 items-center justify-center rounded-full shadow">
      <Image src={iconSrc} alt={"icon"} width={20} height={20} />
    </div>
    <strong className="text-muted-foreground">{title}</strong>
    <CircleAlert className="text-muted-foreground size-4" />
  </div>
);

const LocationSection = ({ locations, onLocationChange, apiKey }) => {
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
        const locations = data.results.slice(0, 6).map((place) => ({
          label: place.formatted_address,
          value: place.place_id,
          name: place.name,
          types: place.types,
          geometry: place.geometry,
        }));
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

  // Alternative free API option using OpenStreetMap
  const searchLocationsAlternative = async (query) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
          importance: place.importance,
        };
      });

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

  const debouncedSearch = useMemo(
    () => debounce(searchFunction, 300),
    [apiKey],
  );

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  // Get location type icon
  const getLocationIcon = (types) => {
    if (types?.includes("country")) return "🌍";
    if (types?.includes("administrative_area_level_1")) return "🏛️";
    if (types?.includes("locality") || types?.includes("sublocality"))
      return "🏙️";
    return "📍";
  };

  return (
    <label className="space-y-2">
      <SectionHeader title="Cities and Countries to Advertise" />
      <div className="relative">
        <Autocomplete
          multiple
          options={options}
          getOptionLabel={(option) => option.label || ""}
          loading={loading}
          value={locations}
          inputValue={inputValue}
          onInputChange={(event, newInputValue, reason) => {
            if (reason !== "reset") {
              setInputValue(newInputValue);
            }
          }}
          onChange={(event, newValue) => {
            onLocationChange?.(newValue);
          }}
          filterOptions={(x) => x}
          renderOption={(props, option) => (
            <li
              {...props}
              key={option.value}
              className="hover:bg-muted flex cursor-pointer items-center gap-3 border-b px-2 py-1 last:border-b-0"
            >
              <div className="flex flex-1 items-center gap-2">
                <span className="flex-shrink-0 text-gray-400">
                  {getLocationIcon(option.types)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {option.name}
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
              placeholder="Search for cities, states, or countries"
              variant="outlined"
              size="small"
              error={!!error}
              helperText={error}
              InputProps={{
                ...params.InputProps,
                className: "px-2 py-1",
                endAdornment: (
                  <div className="flex items-center">
                    {loading && <CircularProgress color="inherit" size={16} />}
                    {params.InputProps.endAdornment}
                  </div>
                ),
              }}
            />
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.value}
                label={option.name}
                size="small"
                className="m-1"
              />
            ))
          }
          isOptionEqualToValue={(option, val) => option?.value === val?.value}
          noOptionsText={
            inputValue.length < 2
              ? "Type at least 2 characters to search"
              : loading
                ? "Searching..."
                : "No locations found"
          }
          // PopperProps={{
          //   className: "shadow-lg border rounded-lg bg-white",
          //   placement: "bottom-start",
          // }}
          slotProps={{
            popper: {
              className: "shadow-lg border rounded-lg bg-white",
              placement: "bottom-start",
            },
          }}
        />
      </div>
    </label>
  );
};

export default LocationSection;
