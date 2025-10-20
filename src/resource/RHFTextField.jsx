import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

/**
 * New props:
 *  - restrict: "digits" | null   // opt-in input sanitization
 *  - (existing) inputProps: can pass as before
 */
export default function RHFTextField({
  name,
  helperText,
  endAdornment,
  startAdornment,
  readOnly,
  border = true,
  InputProps, // Accept InputProps directly
  inputProps: inputPropsFromProps = {},
  restrict = null, // <-- opt-in: "digits"
  type, // optional type passed from caller
  ...other
}) {
  const { control } = useFormContext();

  // Merge adornments into InputProps (same as before)
  const mergedInputProps = {
    ...InputProps, // InputProps from parent take precedence
    ...(endAdornment && { endAdornment }),
    ...(startAdornment && { startAdornment }),
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Normalize value so TextField never gets undefined
        const valueForInput = field.value ?? "";

        // Build a merged onChange that sanitizes when restrict === "digits",
        // but also calls any onChange passed via inputPropsFromProps.
        const callerOnChange = inputPropsFromProps.onChange;

        const handleChange = (e) => {
          let raw = e?.target?.value;

          // If caller passed numeric values (number) convert to string to sanitize correctly
          if (typeof raw !== "string" && raw != null) raw = String(raw);

          let sanitized = raw;

          if (restrict === "digits") {
            sanitized = (raw ?? "").replace(/[^0-9]/g, "");
            // If we want to show the raw user input but still block, we could
            // keep raw in display and only send sanitized to form value.
            // Here we sanitize both display and stored value for simplicity.
          }

          // Update react-hook-form value
          field.onChange(sanitized);

          // Also call caller's inputProps onChange if any (pass original event)
          if (typeof callerOnChange === "function") {
            try {
              callerOnChange(e);
            } catch (err) {
              // swallow to avoid breaking
              // (caller handler shouldn't break our form)
              // optional: console.warn(err)
            }
          }
        };

        // Merge inputProps safely (don't overwrite important ones)
        const mergedInputPropsForInput = {
          ...inputPropsFromProps,
          readOnly,
          // if caller already provided onChange, we've already stored it as callerOnChange
          // we should NOT include inputPropsFromProps.onChange here; we merged above.
          onChange: handleChange,
        };

        return (
          <TextField
            {...field}
            fullWidth
            value={valueForInput}
            error={!!error}
            helperText={error ? error?.message : helperText}
            InputProps={mergedInputProps}
            inputProps={mergedInputPropsForInput}
            type={type} // preserves caller expectation if they pass type
            slotProps={{
              inputLabel: { style: { color: error ? "red" : "inherit" } },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "inherit", // Use theme's text color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "primary.main", // Highlight color when focused
              },
              ...(border
                ? {}
                : {
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }),
            }}
            {...other}
          />
        );
      }}
    />
  );
}
