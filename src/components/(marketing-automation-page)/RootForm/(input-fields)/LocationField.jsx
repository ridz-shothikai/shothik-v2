"use client";

import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { City, Country, State } from "country-state-city";
import "flag-icon-css/css/flag-icons.min.css";
import { useMemo, useState } from "react";

const LocationField = ({
  value,
  onChange,
  placeholder = "Select country, state, or city",
}) => {
  const [loading, setLoading] = useState(false);

  // Prepare country options
  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.isoCode,
      flag: c.isoCode.toLowerCase(),
      type: "country",
    }));
  }, []);

  // State + City options lazy-loaded based on selected country
  const [stateCityOptions, setStateCityOptions] = useState([]);

  const handleCountrySelect = (country) => {
    if (!country) return;

    setLoading(true);
    const states = State.getStatesOfCountry(country.value);

    const newOptions = states.flatMap((s) => {
      const cities = City.getCitiesOfState(country.value, s.isoCode);

      // Country + State
      const stateOption = {
        label: `${s.name}, ${country.label}`,
        value: `${country.value}-${s.isoCode}`,
        flag: country.flag,
        type: "state",
      };

      // Country + State + City
      const cityOptions = cities.map((city) => ({
        label: `${city.name}, ${s.name}, ${country.label}`,
        value: city.id,
        flag: country.flag,
        type: "city",
      }));

      return [stateOption, ...cityOptions];
    });

    setStateCityOptions(newOptions);
    setLoading(false);
  };

  // Combine options: country + state/city
  const combinedOptions = useMemo(() => {
    return [...countryOptions, ...stateCityOptions];
  }, [countryOptions, stateCityOptions]);

  console.log("Combined Options:", value);

  return (
    <div className="bg-card flex items-center rounded-full border shadow">
      {value?.flag && (
        <span
          className={`flag-icon inline-block size-6 px-4 flag-icon-${value.flag} ml-4 rounded-sm`}
        ></span>
      )}
      <Autocomplete
        options={combinedOptions}
        getOptionLabel={(option) => option.label}
        loading={loading}
        onChange={(event, newValue) => {
          onChange?.(newValue);
          if (newValue?.type === "country") handleCountrySelect(newValue);
        }}
        renderOption={(props, option) => (
          <li
            {...props}
            className="hover:bg-muted flex cursor-pointer items-center gap-2 px-2 py-1"
          >
            <span
              className={`flag-icon flag-icon-${option.flag} h-5 w-5 rounded-sm`}
            ></span>
            <span>{option.label}</span>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              className: "px-4 !py-2",
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        className="w-full"
        isOptionEqualToValue={(option, val) => option.value === val.value}
      />
    </div>
  );
};

export default LocationField;
