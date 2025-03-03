import { Typography } from "@mui/material";
import Link from "next/link";
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
      <Typography>Humanize page</Typography>
      <Link href='/'>Home</Link>
      <br />
      <Link href='/paraphrase'>Paraphrase</Link>
      <br />
      <Link href='/grammar'>Grammar</Link>
      <br />
      <Link href='/humanize'>Humanize</Link>
    </div>
  );
};

export default Humanize;
