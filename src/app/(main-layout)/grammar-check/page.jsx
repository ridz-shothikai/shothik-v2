import { Typography } from "@mui/material";
import React from "react";

export async function generateMetadata() {
  return {
    title: "Grammar || Shothik AI",
    description: "Grammar description",
  };
}

const Grammar = () => {
  return (
    <div>
      <Typography>Grammar Check page</Typography>
    </div>
  );
};

export default Grammar;
