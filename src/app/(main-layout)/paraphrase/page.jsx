import { Typography } from "@mui/material";
import React from "react";

export async function generateMetadata() {
  return {
    title: "Paraphrase || Shothik AI",
    description: "Paraphrase description",
  };
}

const Paraphrase = () => {
  return (
    <div>
      <Typography>paraphrase page</Typography>
    </div>
  );
};

export default Paraphrase;
