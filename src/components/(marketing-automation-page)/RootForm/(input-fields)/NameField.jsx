"use client";

import { TextField } from "@mui/material";

const NameField = ({ value, onChange, placeholder = "Your project name" }) => {
  return (
    <div className="bg-card rounded-full border shadow">
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          className: "px-4 !py-2",
        }}
        fullWidth
      />
    </div>
  );
};

export default NameField;
