import { Typography } from "@mui/material";
import Link from "next/link";
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

export default Paraphrase;
