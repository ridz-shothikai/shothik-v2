import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Grid,
  Badge,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SearchIcon from "@mui/icons-material/Search";
import PsychologyIcon from "@mui/icons-material/Psychology";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import SourceIcon from "@mui/icons-material/Source";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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
  const [aggregatedData, setAggregatedData] = useState({
    totalSources: 0,
    totalImages: 0,
    searchQueries: [],
    researchLoops: 0,
    messages: [],
    currentMessage: "",
  });

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
        const completed = new Set();
        for (let i = 0; i < stepIndex; i++) {
          completed.add(stepOrder[i]);
        }
        setCompletedSteps(completed);
      }

      // Aggregate data from all events
      const newAggregatedData = {
        totalSources: 0,
        totalImages: 0,
        searchQueries: [],
        researchLoops: 0,
        messages: [],
        currentMessage: "",
      };

      streamEvents.forEach((event) => {
        // Count sources from web_research events
        if (event.step === "web_research" && event.data?.sources_gathered) {
          newAggregatedData.totalSources += event.data.sources_gathered.length;
        }

        // Count images
        if (event.data?.images_found) {
          newAggregatedData.totalImages += event.data.images_found;
        }

        // Collect search queries
        if (
          event.data?.search_query &&
          !newAggregatedData.searchQueries.includes(event.data.search_query)
        ) {
          newAggregatedData.searchQueries.push(event.data.search_query);
        }

        // Count research loops
        if (event.step === "reflection") {
          newAggregatedData.researchLoops += 1;
        }

        // Collect messages
        if (
          event.data?.message &&
          event.data.message !== stepDescriptions[event.step]
        ) {
          newAggregatedData.messages.push({
            step: event.step,
            message: event.data.message,
            timestamp: event.timestamp,
          });
        }
      });

      // Set current streaming message
      if (latestEvent.data?.message) {
        newAggregatedData.currentMessage = latestEvent.data.message;
      }

      // For completed step, get final counts from the data
      if (latestEvent.step === "completed" && latestEvent.data) {
        newAggregatedData.totalSources =
          latestEvent.data.sources?.length || newAggregatedData.totalSources;
        newAggregatedData.totalImages =
          latestEvent.data.images?.length || newAggregatedData.totalImages;
        newAggregatedData.researchLoops =
          latestEvent.data.research_loops || newAggregatedData.researchLoops;
      }

      setAggregatedData(newAggregatedData);
    }
  }, [streamEvents]);

  if (!streamEvents || streamEvents.length === 0) {
    return null;
  }

  const latestEvent = streamEvents[streamEvents.length - 1];
  const currentStepName = latestEvent.step;
  const isCompleted = currentStepName === "completed";

  return (
    <Card sx={{ mb: 3, bgcolor: "#f8f9fa", border: "1px solid #e9ecef" }}>
      <CardContent>
        {/* Main Status Header */}
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
              {aggregatedData.currentMessage ||
                stepDescriptions[currentStepName] ||
                "Working on your request..."}
            </Typography>
          </Box>
          <Chip
            label={isCompleted ? "Completed" : "In Progress"}
            color={isCompleted ? "success" : "primary"}
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={isCompleted ? 100 : (currentStep + 1) * 16.67} // 6 steps = 100%
            sx={{
              height: 6,
              borderRadius: 3,
              "& .MuiLinearProgress-bar": {
                backgroundColor: isCompleted ? "#4caf50" : "#07B37A",
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            Step {currentStep + 1} of 6 •{" "}
            {Math.round(isCompleted ? 100 : (currentStep + 1) * 16.67)}%
            Complete
          </Typography>
        </Box>

        {/* Real-time Data Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                bgcolor: "white",
                borderRadius: 1,
              }}
            >
              <Badge
                badgeContent={aggregatedData.totalSources}
                color="primary"
                max={999}
              >
                <SourceIcon color="action" />
              </Badge>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Sources Found
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                bgcolor: "white",
                borderRadius: 1,
              }}
            >
              <Badge
                badgeContent={aggregatedData.totalImages}
                color="secondary"
                max={999}
              >
                <ImageIcon color="action" />
              </Badge>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Images Found
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                bgcolor: "white",
                borderRadius: 1,
              }}
            >
              <Badge
                badgeContent={aggregatedData.searchQueries.length}
                color="info"
                max={999}
              >
                <QueryBuilderIcon color="action" />
              </Badge>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Search Queries
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                bgcolor: "white",
                borderRadius: 1,
              }}
            >
              <Badge
                badgeContent={aggregatedData.researchLoops}
                color="warning"
                max={999}
              >
                <TrendingUpIcon color="action" />
              </Badge>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Research Loops
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Current Search Queries (if available) */}
        {aggregatedData.searchQueries.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Search Queries Generated:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {aggregatedData.searchQueries.slice(0, 3).map((query, index) => (
                <Chip
                  key={index}
                  label={query.length > 40 ? `${query.slice(0, 40)}...` : query}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
              {aggregatedData.searchQueries.length > 3 && (
                <Chip
                  label={`+${aggregatedData.searchQueries.length - 3} more`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: "0.7rem" }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Step-specific Information */}
        {currentStepName === "web_research" &&
          latestEvent.data?.sources_gathered && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "rgba(7, 179, 122, 0.1)",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong>Sources gathered this round:</strong>{" "}
                {latestEvent.data.sources_gathered.length}
              </Typography>
            </Box>
          )}

        {currentStepName === "queued" &&
          latestEvent.data?.position !== undefined && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "rgba(255, 193, 7, 0.1)",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong>Queue position:</strong> #
                {latestEvent.data.position + 1}
              </Typography>
            </Box>
          )}

        {isCompleted && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "rgba(76, 175, 80, 0.1)",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              color="success.main"
              fontWeight="medium"
            >
              ✓ Research completed successfully with{" "}
              {aggregatedData.totalSources} sources and{" "}
              {aggregatedData.totalImages} images
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Footer with metadata */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {latestEvent.researchId &&
              `ID: ${latestEvent.researchId.slice(-8)}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(latestEvent.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
