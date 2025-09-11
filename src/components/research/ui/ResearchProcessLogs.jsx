"use client";

import React, { useState, useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  Paper,
  Stack,
  Badge,
  LinearProgress,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  timelineItemClasses,
} from "@mui/lab";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Search as SearchIcon,
  Psychology as PsychologyIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Source as SourceIcon,
  QueryBuilder as QueryBuilderIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore,
  ExpandLess,
  OpenInNew,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
  AutorenewOutlined,
} from "@mui/icons-material";

const stepIcons = {
  queued: HourglassEmptyIcon,
  generate_query: PsychologyIcon,
  web_research: SearchIcon,
  reflection: TrendingUpIcon,
  finalize_answer: EditIcon,
  image_search: ImageIcon,
  completed: CheckCircleIcon,
};

const stepLabels = {
  queued: "Queued",
  generate_query: "Query Generation",
  web_research: "Web Research",
  reflection: "Analysis & Reflection",
  finalize_answer: "Finalizing Answer",
  image_search: "Image Search",
  completed: "Completed",
};

const stepColors = {
  queued: "warning",
  generate_query: "info",
  web_research: "primary",
  reflection: "secondary",
  finalize_answer: "success",
  image_search: "info",
  completed: "success",
};

const ProcessStepItem = ({ event, isLast, isActive = false }) => {
  const [showSources, setShowSources] = useState(false);
  const [showQueries, setShowQueries] = useState(false);

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Unknown source";
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const StepIcon = stepIcons[event.step] || QueryBuilderIcon;
  const stepColor = stepColors[event.step] || "primary";

  const renderStepContent = () => {
    switch (event.step) {
      case "queued":
        return (
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {event.data.position !== undefined
                ? `Position in queue: #${event.data.position + 1}`
                : "Processing request..."}
            </Typography>
            {isActive && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress size="small" />
              </Box>
            )}
          </Box>
        );

      case "generate_query":
        if (event.data.search_query) {
          return (
            <Box sx={{ ml: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography variant="subtitle2" color="text.primary">
                  Generated Queries ({event.data.search_query.length}):
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowQueries(!showQueries)}
                  aria-label="toggle queries"
                >
                  {showQueries ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              <Collapse in={showQueries}>
                <Stack spacing={1}>
                  {event.data.search_query.map((query, idx) => (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: "rgba(25, 118, 210, 0.04)",
                        border: "1px solid rgba(25, 118, 210, 0.12)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="primary.main">
                        "{query}"
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          );
        } else {
          return (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {event.data.message || "Generating search queries..."}
              </Typography>
              {isActive && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress size="small" />
                </Box>
              )}
            </Box>
          );
        }

      case "web_research":
        if (event.data.sources_gathered) {
          return (
            <Box sx={{ ml: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography variant="subtitle2" color="text.primary">
                  Sources Found: {event.data.sources_gathered.length}
                </Typography>
                {event.data.sources_gathered.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={() => setShowSources(!showSources)}
                    aria-label="toggle sources"
                  >
                    {showSources ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </Box>
              <Collapse in={showSources}>
                <List
                  dense
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                >
                  {event.data.sources_gathered
                    .slice(0, 5)
                    .map((source, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          pl: 0,
                          borderBottom:
                            idx <
                            Math.min(4, event.data.sources_gathered.length - 1)
                              ? "1px solid"
                              : "none",
                          borderColor: "divider",
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: "0.75rem",
                              bgcolor: "primary.main",
                            }}
                          >
                            {getDomainFromUrl(source.url)
                              .charAt(0)
                              .toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {source.title || "Untitled Source"}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {getDomainFromUrl(source.url)}
                            </Typography>
                          }
                        />
                        <IconButton
                          size="small"
                          onClick={() => window.open(source.url, "_blank")}
                          aria-label="open source"
                        >
                          <OpenInNew fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  {event.data.sources_gathered.length > 5 && (
                    <ListItem sx={{ justifyContent: "center", pt: 1 }}>
                      <Chip
                        label={`+${
                          event.data.sources_gathered.length - 5
                        } more sources`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </ListItem>
                  )}
                </List>
              </Collapse>
            </Box>
          );
        } else {
          return (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {event.data.message || "Searching web sources..."}
              </Typography>
              {isActive && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress size="small" />
                </Box>
              )}
            </Box>
          );
        }

      case "reflection":
        if (event.data.knowledge_gap || event.data.follow_up_queries) {
          return (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Analysis complete.{" "}
                {event.data.is_sufficient
                  ? "Research sufficient."
                  : "Additional research needed."}
              </Typography>

              {event.data.knowledge_gap && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: "rgba(255, 193, 7, 0.08)",
                    border: "1px solid rgba(255, 193, 7, 0.2)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    color="warning.main"
                  >
                    Knowledge Gap Identified:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.data.knowledge_gap}
                  </Typography>
                </Paper>
              )}

              {event.data.follow_up_queries &&
                event.data.follow_up_queries.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      color="text.primary"
                    >
                      Follow-up Queries ({event.data.follow_up_queries.length}):
                    </Typography>
                    <Stack spacing={1}>
                      {event.data.follow_up_queries.map((query, idx) => (
                        <Paper
                          key={idx}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: "rgba(156, 39, 176, 0.04)",
                            border: "1px solid rgba(156, 39, 176, 0.12)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" color="secondary.main">
                            "{query}"
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
            </Box>
          );
        } else {
          return (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {event.data.message || "Analyzing research results..."}
              </Typography>
              {isActive && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress size="small" />
                </Box>
              )}
            </Box>
          );
        }

      case "image_search":
        return (
          <Box sx={{ ml: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {event.data.images_found !== undefined ? (
                event.data.images_found > 0 ? (
                  <>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2" color="success.main">
                      Found {event.data.images_found} images
                    </Typography>
                  </>
                ) : (
                  <>
                    <ErrorIcon color="warning" fontSize="small" />
                    <Typography variant="body2" color="warning.main">
                      {event.data.message || "No images found"}
                    </Typography>
                  </>
                )
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    {event.data.message || "Searching for images..."}
                  </Typography>
                  {isActive && (
                    <Box sx={{ ml: 1 }}>
                      <AutorenewOutlined
                        fontSize="small"
                        sx={{ animation: "spin 1s linear infinite" }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        );

      case "finalize_answer":
        return (
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {event.data.message || "Composing final answer..."}
            </Typography>
            {isActive && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress size="small" />
              </Box>
            )}
          </Box>
        );

      case "completed":
        if (
          event.data.sources ||
          event.data.research_loops ||
          event.data.search_queries
        ) {
          return (
            <Box sx={{ ml: 2 }}>
              <Typography
                variant="body2"
                color="success.main"
                sx={{ mb: 1, fontWeight: 500 }}
              >
                Research completed successfully!
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {event.data.sources_count && (
                  <Chip
                    icon={<SourceIcon />}
                    label={`${event.data.sources_count} sources`}
                    size="small"
                    color="primary"
                    variant="filled"
                  />
                )}
                {event.data.research_loops && (
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={`${event.data.research_loops} research loops`}
                    size="small"
                    color="secondary"
                    variant="filled"
                  />
                )}
                {event.data.search_queries && (
                  <Chip
                    icon={<SearchIcon />}
                    label={`${event.data.search_queries.length} queries`}
                    size="small"
                    color="info"
                    variant="filled"
                  />
                )}
              </Stack>
            </Box>
          );
        } else {
          return (
            <Box sx={{ ml: 2 }}>
              <Typography
                variant="body2"
                color="success.main"
                sx={{ fontWeight: 500 }}
              >
                Research completed successfully!
              </Typography>
            </Box>
          );
        }

      default:
        return (
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {event.data.message || event.data.title || "Processing..."}
            </Typography>
            {isActive && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress size="small" />
              </Box>
            )}
          </Box>
        );
    }
  };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={stepColor}
          sx={{
            p: 1,
            ...(isActive && {
              animation: "pulse 1.5s ease-in-out infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            }),
          }}
        >
          <StepIcon fontSize="small" />
        </TimelineDot>
        {!isLast && <TimelineConnector sx={{ bgcolor: "grey.300" }} />}
      </TimelineSeparator>
      <TimelineContent>
        <Card
          variant="outlined"
          sx={{
            mb: 2,
            transition: "all 0.2s ease-in-out",
            ...(isActive && {
              boxShadow: 2,
              borderColor: `${stepColor}.main`,
            }),
            "&:hover": {
              boxShadow: 2,
            },
          }}
        >
          <CardContent sx={{ pb: "16px !important" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Box sx={{ flex: 1, mr: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {event.data.title || stepLabels[event.step]}
                </Typography>
                {renderStepContent()}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 0.5,
                }}
              >
                {event.timestamp && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" color="disabled" />
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(event.timestamp)}
                    </Typography>
                  </Box>
                )}
                {isActive && (
                  <Chip
                    label="Active"
                    size="small"
                    color={stepColor}
                    variant="filled"
                    sx={{ minWidth: 60 }}
                  />
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </TimelineContent>
    </TimelineItem>
  );
};

// Main component
const ResearchProcessLogs = ({
  streamEvents = [],
  researches = [],
  isStreaming = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const processedData = useMemo(() => {
    if (!streamEvents || streamEvents.length === 0) return null;

    // Group events by step type and extract relevant data
    const steps = [];
    const sourceCount = { total: 0 };
    const queryCount = { total: 0 };
    let researchLoops = 0;

    // Track the current active step
    let activeStepIndex = -1;

    streamEvents.forEach((event, index) => {
      // Count sources
      if (event.data?.sources_gathered) {
        sourceCount.total += event.data.sources_gathered.length;
      }
      if (event.data?.sources_count) {
        sourceCount.total = event.data.sources_count;
      }

      // Count queries
      if (event.data?.search_query) {
        queryCount.total += event.data.search_query.length;
      }
      if (event.data?.search_queries) {
        queryCount.total += event.data.search_queries.length;
      }

      // Count research loops
      if (event.data?.research_loops) {
        researchLoops = event.data.research_loops;
      }

      // Determine if this is the active step
      if (isStreaming && event.step !== "completed") {
        activeStepIndex = index;
      }

      steps.push({
        ...event,
        isActive: isStreaming && index === activeStepIndex,
      });
    });

    return {
      steps,
      summary: {
        totalSources: sourceCount.total,
        totalQueries: queryCount.total,
        researchLoops,
        isComplete: steps.some((s) => s.step === "completed"),
        duration:
          steps.length > 1
            ? new Date(steps[steps.length - 1].timestamp) -
              new Date(steps[0].timestamp)
            : 0,
      },
    };
  }, [streamEvents, isStreaming]);

  const formatDuration = (duration) => {
    if (!duration) return "";
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  if (!processedData || processedData.steps.length === 0) {
    return null;
  }

  const { steps, summary } = processedData;

  return (
    <Box sx={{ mb: 3 }}>
      <Accordion
        expanded={isExpanded}
        onChange={() => setIsExpanded(!isExpanded)}
        sx={{
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            bgcolor: "background.default",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SearchIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Research Process
              </Typography>
              {isStreaming && (
                <Chip
                  label="In Progress"
                  size="small"
                  color="primary"
                  variant="filled"
                  icon={
                    <AutorenewOutlined
                      sx={{ animation: "spin 1s linear infinite" }}
                    />
                  }
                />
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
              {summary.totalSources > 0 && (
                <Chip
                  label={`${summary.totalSources} sources`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {summary.totalQueries > 0 && (
                <Chip
                  label={`${summary.totalQueries} queries`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
              {summary.researchLoops > 0 && (
                <Chip
                  label={`${summary.researchLoops} loops`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
              {summary.duration > 0 && (
                <Chip
                  label={formatDuration(summary.duration)}
                  size="small"
                  color="default"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 2 }}>
          <Timeline
            // position="right"
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
            }}
          >
            {steps.map((event, index) => (
              <ProcessStepItem
                key={`${event.step}-${event.timestamp}-${index}`}
                event={event}
                isLast={index === steps.length - 1}
                isActive={event.isActive}
              />
            ))}
          </Timeline>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ResearchProcessLogs;
