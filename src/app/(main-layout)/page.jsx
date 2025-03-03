import { Button, Card, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

export async function generateMetadata() {
  return {
    title: "Home || Shothik AI",
    description: "Home description",
  };
}

const Home = () => {
  return (
    <Card>
      <Typography>home page</Typography>
      <Link href='/paraphrase'>Paraphrase</Link>
      <br />
      <Link href='/grammar'>Grammar</Link>
      <br />
      <Link href='/humanize'>Humanize</Link>
      <Button>Button</Button>
    </Card>
  );
};

export default Home;
