import { Typography } from "@mui/material";
import React from "react";

export async function generateMetadata() {
  return {
    title: "Humanize || Shothik AI",
    description: "Humanize description",
  };
}

const Humanize = () => {
  return (
    <div>
      <Typography>Humanize GPT page</Typography>
    </div>
  );
};

export default Humanize;
