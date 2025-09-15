"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Stack,
  Card,
  CardContent,
  Divider,
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
import useTitleSx from "./useTittleSx";

/**
 * Timeline UI with clickable sources and a "shine" animation on the last message title.
 *
 * Props:
 *  - streamEvents: array of SSE event objects
 *  - researches: optional meta info
 *  - isStreaming: boolean
 */

const STEP_LABELS = {
  queued: "Queued",
  generate_query: "Query generation",
  web_research: "Web research",
  reflection: "Analysis & reflection",
  finalize_answer: "Finalizing answer",
  image_search: "Image search",
  completed: "Completed",
};

const defaultFormatTime = (ts) => {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(ts);
  }
};

const shortText = (text, n = 220) => {
  if (!text) return "";
  const s = String(text).trim();
  return s.length > n ? s.slice(0, n) + "…" : s;
};

const aggregateFromEvents = (events = []) => {
  const summary = { totalSources: 0, totalQueries: 0, researchLoops: 0 };
  const aggregatedSources = [];
  const queries = [];
  events.forEach((ev) => {
    if (ev?.data?.sources_gathered && Array.isArray(ev.data.sources_gathered)) {
      aggregatedSources.push(...ev.data.sources_gathered);
    }
    if (ev?.data?.sources && Array.isArray(ev.data.sources)) {
      aggregatedSources.push(...ev.data.sources);
    }
    if (ev?.data?.sources_count) {
      summary.totalSources = Math.max(
        summary.totalSources,
        ev.data.sources_count
      );
    }
    if (ev?.data?.search_query && Array.isArray(ev.data.search_query)) {
      queries.push(...ev.data.search_query);
    }
    if (ev?.data?.search_queries && Array.isArray(ev.data.search_queries)) {
      queries.push(...ev.data.search_queries);
    }
    if (ev?.data?.research_loops) {
      summary.researchLoops = Math.max(
        summary.researchLoops,
        ev.data.research_loops
      );
    }
  });

  // dedupe by url/title if possible
  const uniqueSources = [];
  const seen = new Set();
  aggregatedSources.forEach((s) => {
    const key = (s.url || s.title || JSON.stringify(s)).toString();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSources.push(s);
    }
  });

  summary.totalSources = Math.max(summary.totalSources, uniqueSources.length);
  summary.totalQueries = queries.length;

  return { summary, uniqueSources, queries };
};

const ProcessTimelineItem = ({ ev, isLast, isActive }) => {
  const stepLabel = STEP_LABELS[ev.step] || ev.step || "Step";
  const timestamp = ev.timestamp ? defaultFormatTime(ev.timestamp) : "";
  const messageCandidates = [
    ev.data?.message,
    ev.data?.title,
    ev.data?.text,
    ev.data?.output,
    ev.data?.description,
  ];
  const message = messageCandidates.find(Boolean) || null;

  const badges = [];
  if (ev.data?.sources_gathered?.length)
    badges.push(`${ev.data.sources_gathered.length} sources`);
  if (ev.data?.sources_count) badges.push(`${ev.data.sources_count} sources`);
  if (ev.data?.search_query?.length)
    badges.push(`${ev.data.search_query.length} queries`);
  if (ev.data?.search_queries?.length)
    badges.push(`${ev.data.search_queries.length} queries`);
  if (ev.data?.images_found !== undefined)
    badges.push(`${ev.data.images_found} images`);
  // if (ev.data?.position !== undefined) badges.push(`#${ev.data.position + 1}`);

  // Title SX: apply shine overlay only when this is the last timeline item
  const titleSx = {
    position: "relative",
    overflow: "hidden",
    display: "inline-block",
    // ensure text is above the shine
    zIndex: 1,
    ...(isLast && {
      // pseudo-element used for the moving white glow
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-140%",
        width: "140%",
        height: "100%",
        // semi-transparent white band in the middle
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 45%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.65) 55%, rgba(255,255,255,0) 100%)",
        transform: "skewX(-20deg)",
        pointerEvents: "none",
        animation: "shineMove 1800ms linear infinite",
        mixBlendMode: "screen",
      },
      // keyframes for the shine
      "@keyframes shineMove": {
        "0%": { left: "-140%" },
        "100%": { left: "140%" },
      },
    }),
  };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            width: 10,
            height: 10,
            boxShadow: "none",
            bgcolor: isActive ? "primary.main" : "grey.400",
            ...(isActive && {
              animation: "blink 2s ease-in-out infinite",
              "@keyframes blink": {
                "0%, 100%": { opacity: 1, transform: "scale(1)" },
                "50%": { opacity: 0.5, transform: "scale(1.5)" },
              },
            }),
          }}
        />
        {!isLast && <TimelineConnector sx={{ bgcolor: "grey.300" }} />}
      </TimelineSeparator>

      <TimelineContent sx={{ py: 1 }}>
        <Card variant="outlined" sx={{ borderRadius: 1, mb: 1 }}>
          <CardContent sx={{ pb: "12px !important", pt: 1 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {/* title wrapper receives the shine styling when isLast === true */}
                  <Box component="span" sx={titleSx}>
                    {stepLabel}
                  </Box>
                </Typography>

                {message && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: "text.secondary" }}
                  >
                    {shortText(message, 260)}
                  </Typography>
                )}

                {Array.isArray(ev.data?.search_query) &&
                  ev.data.search_query.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1, flexWrap: "wrap", gap:1 }}
                    >
                      {ev.data.search_query.slice(0, 3).map((q, i) => (
                        <Chip
                          key={i}
                          size="small"
                          label={shortText(q, 40)}
                          variant="outlined"
                        />
                      ))}
                      {ev.data.search_query.length > 3 && (
                        <Chip
                          size="small"
                          label={`+${ev.data.search_query.length - 3} more`}
                        />
                      )}
                    </Stack>
                  )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  ml: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {timestamp}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ mt: 0.5, flexWrap: "wrap", justifyContent: "flex-end" }}
                >
                  {badges.slice(0, 3).map((b, i) => (
                    <Chip key={i} label={b} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </TimelineContent>
    </TimelineItem>
  );
};

const ResearchProcessLogs = ({
  streamEvents = [],
  researches = [],
  isStreaming = false,
}) => {
  const processed = useMemo(() => {
    if (!Array.isArray(streamEvents) || streamEvents.length === 0) {
      return null;
    }

    let activeIndex = -1;
    const steps = streamEvents.map((e, idx) => ({ ...e, __idx: idx }));

    if (isStreaming) {
      for (let i = steps.length - 1; i >= 0; i--) {
        if (steps[i].step !== "completed") {
          activeIndex = i;
          break;
        }
      }
    } else {
      activeIndex = steps.length - 1;
    }

    const { summary, uniqueSources, queries } =
      aggregateFromEvents(streamEvents);

    return {
      steps: steps.map((s, i) => ({ ...s, isActive: i === activeIndex })),
      summary,
      uniqueSources,
      queries,
    };
  }, [streamEvents, isStreaming]);

  if (!processed) return null;

  const { steps, summary, uniqueSources, queries } = processed;

  const mainTitle =
    (researches &&
      researches[0] &&
      (researches[0].title || researches[0].name)) ||
    steps[0]?.data?.title ||
    "Research Process";

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {mainTitle}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1, flexWrap: "wrap" }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Searching
          </Typography>

          {queries && queries.length > 0 ? (
            <>
              {queries.slice(0, 3).map((q, i) => (
                <Chip
                  key={i}
                  label={shortText(q, 36)}
                  size="small"
                  variant="outlined"
                />
              ))}
              {queries.length > 3 && (
                <Chip label={`+${queries.length - 3} more`} size="small" />
              )}
            </>
          ) : (
            <Chip label="no queries yet" size="small" variant="outlined" />
          )}

          <Box
            sx={{
              ml: "auto",
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {summary.totalSources > 0 && (
              <Chip label={`${summary.totalSources} sources`} size="small" />
            )}
            {summary.totalQueries > 0 && (
              <Chip label={`${summary.totalQueries} queries`} size="small" />
            )}
            {summary.researchLoops > 0 && (
              <Chip label={`${summary.researchLoops} loops`} size="small" />
            )}
          </Box>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Sources preview block with clickable links */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Reviewing sources — {uniqueSources.length}
          </Typography>

          <Paper
            variant="outlined"
            sx={{ p: 1, borderRadius: 1, maxHeight: 160, overflow: "auto" }}
          >
            <Stack spacing={1}>
              {uniqueSources.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No sources found yet.
                </Typography>
              )}

              {uniqueSources.slice(0, 8).map((s, i) => {
                const title =
                  s.title || s.name || s.label || s.url || "Untitled";
                const domain = (() => {
                  try {
                    return s.url
                      ? new URL(s.url).hostname.replace("www.", "")
                      : "";
                  } catch {
                    return "";
                  }
                })();

                return (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    {s.url ? (
                      <Typography
                        component="a"
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {shortText(title, 60)}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 13, fontWeight: 500 }}
                      >
                        {shortText(title, 60)}
                      </Typography>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      {domain}
                    </Typography>
                  </Box>
                );
              })}

              {uniqueSources.length > 8 && (
                <Typography variant="caption" color="text.secondary">
                  +{uniqueSources.length - 8} more...
                </Typography>
              )}
            </Stack>
          </Paper>
        </Box>
      </Paper>

      {/* Timeline */}
      <Box>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {steps.map((ev, idx) => (
            <ProcessTimelineItem
              key={`${ev.step}-${ev.timestamp || idx}-${idx}`}
              ev={ev}
              isLast={idx === steps.length - 1}
              isActive={ev.isActive}
            />
          ))}
        </Timeline>
      </Box>
    </Box>
  );
};

export default ResearchProcessLogs;
