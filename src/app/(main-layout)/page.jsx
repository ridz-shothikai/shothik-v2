"use client";

import { Button, Card, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import useSnackbar from "../../hooks/useSnackbar";

// export async function generateMetadata() {
//   return {
//     title: "Home || Shothik AI",
//     description: "Home description",
//   };
// }

const Home = () => {
  const snakbar = useSnackbar();

  return (
    <Card>
      <Typography>home page</Typography>
      <Link href='/paraphrase'>Paraphrase</Link>
      <br />
      <Link href='/grammar'>Grammar</Link>
      <br />
      <Link href='/humanize'>Humanize</Link>
      <Button onClick={() => snakbar("hello world!", { variant: "success" })}>
        Success
      </Button>
      <Button onClick={() => snakbar("hello world!", { variant: "warning" })}>
        Warning
      </Button>
      <Button onClick={() => snakbar("hello world!", { variant: "info" })}>
        Info
      </Button>
      <Button onClick={() => snakbar("hello world!", { variant: "error" })}>
        Error
      </Button>
    </Card>
  );
};

export default Home;
