import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

export default function RHFTextField({
  name,
  helperText,
  endAdornment,
  startAdornment,
  readOnly,
  border = true,
  InputProps, // Accept InputProps directly
  ...other
}) {
  const { control } = useFormContext();

  const mergedInputProps = {
    ...InputProps, // InputProps from parent take precedence
    ...(endAdornment && { endAdornment }),
    ...(startAdornment && { startAdornment }),
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={field.value ?? ""} // Ensures value is never undefined
          error={!!error}
          helperText={error ? error?.message : helperText}
          InputProps={mergedInputProps} // Pass merged InputProps
          inputProps={{ readOnly }} // Pass readOnly to native input
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
      )}
    />
  );
}
