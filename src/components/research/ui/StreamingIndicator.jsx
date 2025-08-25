"use client";

import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SearchIcon from "@mui/icons-material/Search";
import PsychologyIcon from "@mui/icons-material/Psychology";
import EditIcon from "@mui/icons-material/Edit";

const stepIcons = {
  queued: <HourglassEmptyIcon />,
  generate_query: <PsychologyIcon />,
  web_research: <SearchIcon />,
  reflection: <PsychologyIcon />,
  finalize_answer: <EditIcon />,
  completed: <CheckCircleIcon />,
};

const stepLabels = {
  queued: "Queued",
  generate_query: "Generating Search Queries",
  web_research: "Web Research",
  reflection: "Analyzing Results",
  finalize_answer: "Finalizing Answer",
  completed: "Completed",
};

const stepDescriptions = {
  queued: "Your research request has been queued for processing",
  generate_query: "Creating optimized search queries for research",
  web_research: "Searching the web for relevant information",
  reflection: "Analyzing research results and identifying gaps",
  finalize_answer: "Composing and presenting the final research answer",
  completed: "Research has been completed successfully",
};

export default function StreamingIndicator({ streamEvents }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    if (streamEvents && streamEvents.length > 0) {
      const latestEvent = streamEvents[streamEvents.length - 1];
      const stepOrder = [
        "queued",
        "generate_query",
        "web_research",
        "reflection",
        "finalize_answer",
        "completed",
      ];
      const stepIndex = stepOrder.indexOf(latestEvent.step);

      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
        // Mark all previous steps as completed
        const completed = new Set();
        for (let i = 0; i < stepIndex; i++) {
          completed.add(stepOrder[i]);
        }
        setCompletedSteps(completed);
      }
    }
  }, [streamEvents]);

  if (!streamEvents || streamEvents.length === 0) {
    return null;
  }

  const latestEvent = streamEvents[streamEvents.length - 1];
  const currentStepName = latestEvent.step;

  return (
    <Card sx={{ mb: 3, bgcolor: "#f8f9fa", border: "1px solid #e9ecef" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ mr: 2 }}>
            {stepIcons[currentStepName] || <HourglassEmptyIcon />}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {latestEvent.data?.title ||
                stepLabels[currentStepName] ||
                "Processing..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {latestEvent.data?.message ||
                stepDescriptions[currentStepName] ||
                "Working on your request..."}
            </Typography>
          </Box>
          <Chip
            label="In Progress"
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Progress indicator */}
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={(currentStep + 1) * 20} // Assuming 5 main steps
            sx={{
              height: 6,
              borderRadius: 3,
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#07B37A",
              },
            }}
          />
        </Box>

        {/* Additional info for specific steps */}
        {currentStepName === "web_research" &&
          latestEvent.data?.sources_gathered && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Sources gathered: {latestEvent.data.sources_gathered.length}
              </Typography>
            </Box>
          )}

        {currentStepName === "queued" &&
          latestEvent.data?.position !== undefined && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Position in queue: {latestEvent.data.position + 1}
              </Typography>
            </Box>
          )}

        {/* Timestamp */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {latestEvent.researchId &&
              `Research ID: ${latestEvent.researchId.slice(-8)}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(latestEvent.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
