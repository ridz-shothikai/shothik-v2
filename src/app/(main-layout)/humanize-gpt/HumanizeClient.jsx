"use client";

import { Container } from "@mui/material";
import HumanizedContend from "../../../components/tools/humanize/HumanizedContend";
import ErrorBoundary from "../../../components/common/ErrorBoundary";

const HumanizeClient = () => {
  return (
      <ErrorBoundary>
        <HumanizedContend />
      </ErrorBoundary>
  );
};

export default HumanizeClient;
