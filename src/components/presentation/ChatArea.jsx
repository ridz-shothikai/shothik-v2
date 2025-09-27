"use client";

// components/ChatArea.tsx
import React, {
  useEffect,
  useRef,
  memo,
  useCallback,
  useState,
  useMemo,
} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import PaletteIcon from "@mui/icons-material/Palette";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import InteractiveChatMessage from "../../../components/agents/shared/InteractiveChatMessage";
import InputArea from "./InputAreas";
import {
  useStreamingLogs,
  formatAgentName,
  formatTimestamp,
} from "../../hooks/useStreamingLogs";
import { useStaticLogs } from "../../hooks/useStaticLogs";
import TypingAnimation from "../common/TypingAnimation";
import { FooterCta } from "../sheet/SheetAgentPage";
import useResponsive from "../../hooks/useResponsive";

const PRIMARY_GREEN = "#07B37A";
const USER_MESSAGE_COLOR = "#1976d2";

// UTILS function
// Parse tool outputs from markdown code blocks
const parseToolOutputs = (text) => {
  const toolOutputsMatch = text.match(/```tool_outputs\n(.*?)\n```/s);
  if (!toolOutputsMatch) return null;

  try {
    // Clean up the string and parse as JSON
    const cleanedJson = toolOutputsMatch[1].replace(/'/g, '"');
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.warn("Failed to parse tool outputs:", error);
    return null;
  }
};

// --- Sub-components for Structured Data ---

// Component for Tool Outputs logs
const ToolOutputsLog = memo(({ toolOutputs, statusText }) => (
  <Card
    variant="outlined"
    sx={{ mt: 1, borderColor: "#e0e0e0", borderRadius: 2 }}
  >
    <CardContent>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: "bold", color: "text.secondary" }}
      >
        Tool Outputs
      </Typography>
      {toolOutputs && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PaletteIcon color="action" /> Theme Configuration
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {Object.entries(toolOutputs).map(([key, value]) => (
              <Box
                key={key}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {key.includes("color") && (
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "4px",
                      bgcolor: value,
                      border: "1px solid #ccc",
                    }}
                  />
                )}
                <Typography variant="caption">{`${key.replace(
                  /_/g,
                  " ",
                )}: `}</Typography>
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {statusText && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {statusText}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
));
ToolOutputsLog.displayName = "ToolOutputsLog";

// Component for Keyword Research logs
const KeywordResearchLog = memo(({ queries }) => (
  <Card
    variant="outlined"
    sx={{ mt: 1, borderColor: "#e0e0e0", borderRadius: 2 }}
  >
    <CardContent>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: "bold", color: "text.secondary" }}
      >
        Search Queries
      </Typography>
      <List dense>
        {queries.map((query, i) => (
          <ListItem key={i} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <SearchIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2">{query}</Typography>}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
));
KeywordResearchLog.displayName = "KeywordResearchLog";

// Component for Presentation Plan logs
// Utility to check if a value is a non-empty object
const isNonEmptyObject = (value) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).length > 0;

// Utility to check if a value is a string
const isString = (value) => typeof value === "string";

// Utility to check if a value is a non-empty array
const isNonEmptyArray = (value) => Array.isArray(value) && value.length > 0;

// Component for Presentation Plan logs
const PlanningLog = memo(({ plan }) => {
  if (!isNonEmptyObject(plan)) {
    return (
      <Card
        variant="outlined"
        sx={{ mt: 1, borderColor: "#e0e0e0", borderRadius: 2 }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Presentation Plan
          </Typography>
          <Typography variant="body2" color="error">
            Empty presentation plan data.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Check if global_theme has the expected direct properties (e.g., primary_color, header_font)
  const hasDirectThemeProperties =
    isNonEmptyObject(plan.global_theme) &&
    Object.keys(plan.global_theme).some((key) =>
      [
        "primary_color",
        "secondary_color",
        "background_color",
        "text_color",
        "accent_color",
        "header_font",
        "body_font",
      ].includes(key),
    );

  return (
    <Card
      variant="outlined"
      sx={{ mt: 1, borderColor: "#e0e0e0", borderRadius: 2 }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Presentation Plan
        </Typography>
        {hasDirectThemeProperties && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PaletteIcon color="action" /> Global Theme
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {Object.entries(plan.global_theme).map(([key, value]) => {
                // Convert value to string safely
                const displayValue =
                  typeof value === "string"
                    ? value
                    : typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value);

                return (
                  <Box
                    key={key}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {key.includes("color") &&
                      typeof value === "string" &&
                      value.startsWith("#") && (
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "4px",
                            bgcolor: value,
                            border: "1px solid #ccc",
                          }}
                        />
                      )}
                    <Typography variant="caption">{`${key.replace(
                      /_/g,
                      " ",
                    )}: `}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {displayValue}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
        {isNonEmptyArray(plan.slides) && (
          <Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
            >
              <SlideshowIcon color="action" /> Planned Slides
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {plan.slides.map((slide, i) => (
                <Card key={i} variant="outlined" sx={{ borderColor: "#eee" }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {isNonEmptyObject(slide.slide_data) &&
                      isString(slide.slide_data.headline)
                        ? slide.slide_data.headline
                        : "Untitled Slide"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {isNonEmptyObject(slide.slide_data) &&
                      isString(slide.slide_data.body_content)
                        ? `${slide.slide_data.body_content.substring(
                            0,
                            100,
                          )}...`
                        : "No content available"}
                    </Typography>
                    <Chip
                      label={
                        isString(slide.slide_type)
                          ? slide.slide_type
                          : "Unknown"
                      }
                      size="small"
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
        {!hasDirectThemeProperties && !plan.slides && (
          <Typography variant="body2" color="text.secondary">
            No valid theme or slides data available.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});
PlanningLog.displayName = "PlanningLog";

// Component for rendering HTML content in a sandboxed iframe
const HtmlContentLog = memo(({ htmlString }) => (
  <Box
    sx={{
      mt: 1,
      height: "400px",
      resize: "vertical",
      overflow: "auto",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
    }}
  >
    <iframe
      srcDoc={htmlString}
      title="Generated Slide Preview"
      sandbox="allow-scripts" // Allows scripts to run but restricts other capabilities
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  </Box>
));
HtmlContentLog.displayName = "HtmlContentLog";

// Generic fallback for unknown object structures
const JsonLog = memo(({ data }) => (
  <Box
    sx={{
      mt: 1,
      p: 2,
      bgcolor: "#f5f5f5",
      borderRadius: 2,
      maxHeight: 300,
      overflowY: "auto",
    }}
  >
    <pre
      style={{
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        fontSize: "0.8rem",
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  </Box>
));
JsonLog.displayName = "JsonLog";

// --- NEW: User Message Component ---
const UserMessage = memo(({ message, timestamp }) => (
  <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
    <Box sx={{ maxWidth: "80%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
          justifyContent: "flex-end",
          opacity: 0.7,
        }}
      >
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: "0.7rem" }}
        >
          {formatTimestamp(timestamp)}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 500, fontSize: "0.75rem" }}
        >
          You
        </Typography>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: USER_MESSAGE_COLOR,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PersonIcon sx={{ fontSize: 12, color: "white" }} />
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: USER_MESSAGE_COLOR,
          color: "white",
          borderRadius: "18px 18px 4px 18px",
          px: 2,
          py: 1.5,
          maxWidth: "100%",
          wordBreak: "break-word",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.5,
            fontSize: "0.95rem",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  </Box>
));
UserMessage.displayName = "UserMessage";

// --- Main Components ---

// Component for Slide Data Fetcher Tool logs
const SlideDataFetcherLog = memo(({ data, theme }) => {
  const { original_plan, global_theme } = data;

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: "12px",
          border: "1px solid #e8eaed",
          // bgcolor: "white",
          bgcolor: theme.palette.background.paper,
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderColor: theme.palette.mode === "dark" ? "#444" : "#dadce0",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background:
              theme.palette.mode === "dark"
                ? "#161C24"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: { xs: 2, sm: 2.5 },
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <SlideshowIcon sx={{ fontSize: 16, color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  lineHeight: 1.3,
                }}
              >
                Slide Data Fetcher
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.85rem",
                  fontWeight: 400,
                }}
              >
                Preparing slide content and theme
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Global Theme Section */}
          {global_theme && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  mb: 2,
                  color: theme.palette.mode === "dark" ? "white" : "#1f2937",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "4px",
                    bgcolor:
                      theme.palette.mode === "dark" ? "#374151" : "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PaletteIcon sx={{ fontSize: 12, color: "#6b7280" }} />
                </Box>
                Theme Configuration
              </Typography>

              {/* Extract color properties from global_theme */}
              {(() => {
                const colorKeys = [
                  "primary_color",
                  "secondary_color",
                  "background_color",
                  "text_color",
                  "highlight_color",
                ];
                const colors = {};
                colorKeys.forEach((key) => {
                  if (global_theme[key]) {
                    colors[key] = global_theme[key];
                  }
                });

                return (
                  Object.keys(colors).length > 0 && (
                    <Box sx={{ mb: 2.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          mb: 1.5,
                          color:
                            theme.palette.mode === "dark" ? "white" : "#374151",
                        }}
                      >
                        Color Palette
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "repeat(auto-fit, minmax(140px, 1fr))",
                            sm: "repeat(auto-fit, minmax(160px, 1fr))",
                          },
                          gap: 1.5,
                        }}
                      >
                        {Object.entries(colors).map(([key, value]) => (
                          <Box
                            key={key}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              p: 1.5,
                              borderRadius: "8px",
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "#374151"
                                  : "#f9fafb",
                              border: "1px solid #e5e7eb",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor:
                                  theme.palette.mode === "dark"
                                    ? "#4b5563"
                                    : "#f3f4f6",
                                transform: "translateY(-1px)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "6px",
                                bgcolor: value,
                                border: "2px solid white",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "#9ca3af"
                                      : "#6b7280",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                  textTransform: "capitalize",
                                }}
                              >
                                {key.replace(/_/g, " ")}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "#9ca3af"
                                      : "#374151",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  fontFamily: "monospace",
                                }}
                              >
                                {value}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )
                );
              })()}

              {/* Extract font properties from global_theme */}
              {(() => {
                const fontKeys = ["header_font", "body_font"];
                const fonts = {};
                fontKeys.forEach((key) => {
                  if (global_theme[key]) {
                    fonts[key] = global_theme[key];
                  }
                });

                return (
                  Object.keys(fonts).length > 0 && (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          mb: 1.5,
                          color:
                            theme.palette.mode === "dark" ? "white" : "#374151",
                        }}
                      >
                        Typography
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(auto-fit, minmax(200px, 1fr))",
                          },
                          gap: 1.5,
                        }}
                      >
                        {Object.entries(fonts).map(([key, value]) => (
                          <Box
                            key={key}
                            sx={{
                              p: 1.5,
                              borderRadius: "8px",
                              bgcolor: "#f9fafb",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#6b7280",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            >
                              {key.replace(/_/g, " ")}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: value,
                                fontSize: "0.9rem",
                                color: "#374151",
                                fontWeight: 500,
                                mt: 0.5,
                              }}
                            >
                              {value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )
                );
              })()}
            </Box>
          )}

          {/* Slide Plan Section */}
          {original_plan && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  mb: 2,
                  color: theme.palette.mode === "dark" ? "white" : "#374151",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "4px",
                    bgcolor: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SlideshowIcon sx={{ fontSize: 12, color: "#3b82f6" }} />
                </Box>
                Slide Blueprint
              </Typography>

              <Card
                elevation={0}
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #e0e7ff",
                  bgcolor: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%)",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                        color:
                          theme.palette.mode === "dark" ? "white" : "#374151",
                        lineHeight: 1.3,
                      }}
                    >
                      {original_plan.slide_data?.headline || "Untitled Slide"}
                    </Typography>
                    <Chip
                      label={original_plan.slide_type}
                      size="small"
                      sx={{
                        bgcolor: "#3b82f6",
                        color: "white",
                        fontWeight: 500,
                        height: 28,
                        "& .MuiChip-label": { px: 1.5 },
                      }}
                    />
                  </Box>

                  {/* Visual Suggestion */}
                  {original_plan.visual_suggestion && (
                    <Box
                      sx={{
                        mb: 2.5,
                        p: 2,
                        borderRadius: "10px",
                        bgcolor: "rgba(59, 130, 246, 0.08)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          color: "#1e40af",
                          fontSize: "0.85rem",
                        }}
                      >
                        📊 {original_plan.visual_suggestion.chart_type}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#475569",
                          lineHeight: 1.5,
                          fontSize: "0.85rem",
                        }}
                      >
                        {original_plan.visual_suggestion.highlight}
                      </Typography>
                    </Box>
                  )}

                  {/* Data Points */}
                  {original_plan.slide_data?.body_content &&
                    Array.isArray(original_plan.slide_data.body_content) && (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            mb: 1.5,
                            color: "#374151",
                            fontSize: "0.85rem",
                          }}
                        >
                          Data Points
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {original_plan.slide_data.body_content.map(
                            (item, index) => (
                              <Chip
                                key={index}
                                label={
                                  typeof item === "object"
                                    ? `${item.label}: ${item.value}`
                                    : item
                                }
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: "#cbd5e1",
                                  color: "#475569",
                                  bgcolor: "white",
                                  "&:hover": {
                                    bgcolor: "#f8fafc",
                                    borderColor: "#94a3b8",
                                  },
                                }}
                              />
                            ),
                          )}
                        </Box>
                      </Box>
                    )}
                </CardContent>
              </Card>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
});
SlideDataFetcherLog.displayName = "SlideDataFetcherLog";

// Modern Responsive PlanModifierLog Component
const PlanModifierLog = memo(({ data }) => {
  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: "12px",
          border: "1px solid #e8eaed",
          bgcolor: "white",
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderColor: "#dadce0",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "white",
            p: { xs: 2, sm: 2.5 },
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 20c0-8.837-7.163-16-16-16S-12 11.163-12 20s7.163 16 16 16 16-7.163 16-16zm0 0c0 8.837 7.163 16 16 16s16-7.163 16-16-7.163-16-16-16-16 7.163-16 16z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <PaletteIcon sx={{ fontSize: 16, color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  lineHeight: 1.3,
                }}
              >
                Plan Modifier
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.85rem",
                  fontWeight: 400,
                }}
              >
                Customizing slide content
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "1px solid #fed7aa",
              bgcolor: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    color: "#92400e",
                    lineHeight: 1.3,
                  }}
                >
                  {data.slide_data?.headline || "Modified Slide"}
                </Typography>
                <Chip
                  label={data.slide_type}
                  size="small"
                  sx={{
                    bgcolor: "#f59e0b",
                    color: "white",
                    fontWeight: 500,
                    height: 28,
                    "& .MuiChip-label": { px: 1.5 },
                  }}
                />
              </Box>

              {/* Visual Suggestion */}
              {data.visual_suggestion && (
                <Box
                  sx={{
                    mb: 2.5,
                    p: 2,
                    borderRadius: "10px",
                    bgcolor: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: "#92400e",
                      fontSize: "0.85rem",
                    }}
                  >
                    📈 {data.visual_suggestion.chart_type}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#78716c",
                      lineHeight: 1.5,
                      fontSize: "0.85rem",
                    }}
                  >
                    {data.visual_suggestion.highlight}
                  </Typography>
                </Box>
              )}

              {/* Modified Data Points */}
              {data.slide_data?.body_content &&
                Array.isArray(data.slide_data.body_content) && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: "#374151",
                        fontSize: "0.85rem",
                      }}
                    >
                      Modified Content
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {data.slide_data.body_content.map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 1.5,
                            borderRadius: "8px",
                            bgcolor: "rgba(255,255,255,0.7)",
                            border: "1px solid rgba(245, 158, 11, 0.2)",
                            fontFamily:
                              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                            fontSize: "0.8rem",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: "rgba(255,255,255,0.9)",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "inherit",
                              fontSize: "inherit",
                              color: "#374151",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {typeof item === "string"
                              ? item
                              : JSON.stringify(item, null, 2)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </Box>
  );
});

PlanModifierLog.displayName = "PlanModifierLog";

const StreamingMessage = memo(
  ({
    log,
    isTyping,
    onTypingComplete,
    logIndex,
    registerAnimationCallback,
    unregisterAnimationCallback,
    sessionStatus,
    processedLogs,
    theme,
  }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(!isTyping);
    const animationStateRef = useRef({
      isRunning: false,
      intervalId: null,
      forceCompleted: false,
    });
    const mountedRef = useRef(true);

    const isStringContent = typeof log.parsed_output === "string";
    const fullText = isStringContent ? log.parsed_output : "";
    const isHtmlContent =
      isStringContent && fullText.trim().startsWith("<!DOCTYPE html>");

    const isToolOutputContent =
      isStringContent && fullText.includes("```tool_outputs");

    // Don't animate if the session is finished. This prevents re-animation on page revisit.
    const isSessionActive =
      sessionStatus !== "completed" &&
      sessionStatus !== "failed" &&
      sessionStatus !== "saved";
    const shouldAnimate =
      isStringContent &&
      !isHtmlContent &&
      !isToolOutputContent &&
      log.shouldAnimate !== false &&
      isTyping &&
      isSessionActive &&
      sessionStatus === "processing" &&
      logIndex >= processedLogs.length - 2;

    const prepareWords = useCallback((text) => {
      if (!text) return [];
      const parts = text.split(/(\s+)/);
      const words = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].trim()) words.push({ text: parts[i], isSpace: false });
        else if (parts[i]) words.push({ text: parts[i], isSpace: true });
      }
      return words;
    }, []);

    const forceComplete = useCallback(() => {
      const state = animationStateRef.current;
      if (!state.isRunning || state.forceCompleted) return;

      state.forceCompleted = true;
      state.isRunning = false;
      if (state.intervalId) clearInterval(state.intervalId);

      if (mountedRef.current) {
        setDisplayedText(fullText);
        setIsComplete(true);
        setTimeout(() => {
          if (mountedRef.current) {
            unregisterAnimationCallback(logIndex);
            onTypingComplete?.(logIndex);
          }
        }, 50);
      }
    }, [fullText, logIndex, onTypingComplete, unregisterAnimationCallback]);

    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        if (animationStateRef.current.intervalId)
          clearInterval(animationStateRef.current.intervalId);
      };
    }, []);

    useEffect(() => {
      if (!shouldAnimate) {
        if (isStringContent) setDisplayedText(fullText);
        setIsComplete(true);
        if (animationStateRef.current.intervalId)
          clearInterval(animationStateRef.current.intervalId);
        animationStateRef.current.isRunning = false;
        return;
      }

      setDisplayedText("");
      setIsComplete(false);
      if (animationStateRef.current.intervalId)
        clearInterval(animationStateRef.current.intervalId);
      animationStateRef.current = {
        isRunning: false,
        intervalId: null,
        forceCompleted: false,
      };
    }, [shouldAnimate, fullText, isStringContent]);

    useEffect(() => {
      if (
        !shouldAnimate ||
        !fullText.trim() ||
        animationStateRef.current.isRunning
      ) {
        if (!fullText.trim() && shouldAnimate) {
          setIsComplete(true);
          onTypingComplete?.(logIndex);
        }
        return;
      }

      const state = animationStateRef.current;
      const words = prepareWords(fullText);
      if (words.length === 0) {
        setIsComplete(true);
        onTypingComplete?.(logIndex);
        return;
      }

      state.isRunning = true;
      registerAnimationCallback(logIndex, forceComplete);

      let currentWordIndex = 0;
      const animateWords = () => {
        if (!mountedRef.current || !state.isRunning || state.forceCompleted)
          return;

        if (currentWordIndex < words.length) {
          const currentWords = words.slice(0, currentWordIndex + 1);
          setDisplayedText(currentWords.map((w) => w.text).join(""));
          currentWordIndex++;
        } else {
          state.isRunning = false;
          clearInterval(state.intervalId);
          state.intervalId = null;
          setIsComplete(true);
          setTimeout(() => {
            if (mountedRef.current && !state.forceCompleted) {
              unregisterAnimationCallback(logIndex);
              onTypingComplete?.(logIndex);
            }
          }, 50);
        }
      };

      const wordDelay = Math.max(30, 80 - Math.floor(words.length / 10));
      state.intervalId = setInterval(animateWords, wordDelay);

      return () => {
        state.isRunning = false;
        if (state.intervalId) clearInterval(state.intervalId);
        unregisterAnimationCallback(logIndex);
      };
    }, [
      fullText,
      shouldAnimate,
      onTypingComplete,
      logIndex,
      registerAnimationCallback,
      unregisterAnimationCallback,
      forceComplete,
      prepareWords,
    ]);

    const renderContent = () => {
      if (log.agent_name === "unknown_agent" && isStringContent) {
        const shouldSkip = fullText.includes("```tool_outputs"); // TODO: Have to add json formatter here

        if (shouldSkip) return null;
      }

      const output = log.parsed_output;
      if (typeof output === "object" && output !== null) {
        switch (log.agent_name) {
          case "keyword_research_agent":
            return <KeywordResearchLog queries={output.search_queries || []} />;
          case "planning_agent":
            return <PlanningLog plan={output} />;
          case "slide_data_fetcher_tool":
            return <SlideDataFetcherLog data={output} theme={theme} />;
          case "plan_modifier_agent":
            return <PlanModifierLog data={output} />;
          default:
            return <JsonLog data={output} />;
        }
      }

      if (isHtmlContent) {
        return <HtmlContentLog htmlString={fullText} />;
      }

      // Handle tool outputs in string content
      if (typeof output === "string" && output.includes("```tool_outputs")) {
        const toolOutputs = parseToolOutputs(output);
        const statusText = output
          .replace(/```tool_outputs\n.*?\n```\n?/s, "")
          .trim();

        if (toolOutputs) {
          return (
            <ToolOutputsLog toolOutputs={toolOutputs} statusText={statusText} />
          );
        }
      }

      return (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.6,
            color:
              theme.palette.mode === "dark"
                ? theme.palette.text.primary
                : "#374151",
            fontSize: "0.95rem",
          }}
        >
          {displayedText}
          {shouldAnimate && !isComplete && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: "2px",
                height: "20px",
                bgcolor: PRIMARY_GREEN,
                ml: 0.5,
                animation: "blink 1s infinite",
                "@keyframes blink": {
                  "0%, 50%": { opacity: 1 },
                  "51%, 100%": { opacity: 0 },
                },
              }}
            />
          )}
        </Typography>
      );
    };

    return (
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
            opacity: 0.7,
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: PRIMARY_GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8px",
              color: "white",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            AI
          </Box>
          <Typography
            variant="caption"
            color={theme.palette.text.primary}
            sx={{ fontWeight: 500, fontSize: "0.75rem" }}
          >
            {formatAgentName(log.agent_name)}
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: "0.7rem" }}
          >
            {formatTimestamp(log.timestamp)}
          </Typography>
        </Box>
        <Box sx={{ ml: 0 }}>{renderContent()}</Box>
      </Box>
    );
  },
);
StreamingMessage.displayName = "StreamingMessage";

// const mergeMessagesWithDeduplication = (realLogs, optimisticMessages) => {
//   const merged = [...realLogs];

//   optimisticMessages.forEach((optMsg) => {
//     const exists = realLogs.some(
//       (real) =>
//         real.role === "user" && real.message?.trim() === optMsg.message?.trim()
//     );

//     if (!exists) {
//       merged.push(optMsg);
//     }
//   });

//   return merged.sort(
//     (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//   );
// };

const mergeMessagesWithDeduplication = (realLogs, optimisticMessages) => {
  // Preserve agent logs from realLogs
  const agentLogs = realLogs.filter((log) => log.role === "agent");

  const merged = [...realLogs];

  optimisticMessages.forEach((optMsg) => {
    const exists = realLogs.some(
      (real) =>
        real.role === "user" && real.message?.trim() === optMsg.message?.trim(),
    );

    if (!exists) {
      merged.push(optMsg);
    }
  });

  // console.log(merged, "merged logs");

  return merged.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
};

export default function ChatArea({
  currentAgentType,
  chatHistory,
  realLogs,
  isLoading,
  currentPhase,
  completedPhases,
  logsData,
  chatEndRef,
  inputValue,
  setInputValue,
  onSend,
  status,
  presentationId,
  optimisticMessages = [],
  setUploadedFiles,
  setFileUrls,
  uploadedFiles,
  fileUrls,
  hideInputField, // for simulation it's true, for regular process it's false. based on this we can also add the CTA footer.
  simulationCompleted,
  setShowModal,
  showModal,
}) {
  const theme = useTheme();
  const isMobile = useResponsive("down", "sm");

  const {
    processedLogs,
    currentlyTypingIndex,
    showThinking,
    handleTypingComplete,
    sessionStatus,
    isBackgroundProcessing,
    registerAnimationCallback,
    unregisterAnimationCallback,
  } = useStreamingLogs(realLogs, isLoading, status, presentationId);

  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(true);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (chatEndRef.current && autoScrollRef.current) {
      requestAnimationFrame(() => {
        chatEndRef.current?.scrollIntoView({ behavior, block: "end" });
      });
    }
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      autoScrollRef.current = scrollTop + clientHeight >= scrollHeight - 100;
    }
  }, []);

  useEffect(() => {
    if (processedLogs.length !== 0 || showThinking) {
      scrollToBottom();
    }
  }, [processedLogs.length, showThinking, scrollToBottom]);

  useEffect(() => {
    if (currentlyTypingIndex >= 0) {
      const scrollInterval = setInterval(() => {
        if (autoScrollRef.current) scrollToBottom("auto");
      }, 200);
      return () => clearInterval(scrollInterval);
    }
  }, [currentlyTypingIndex, scrollToBottom]);

  const deduplicatedOptimisticMessages = useMemo(() => {
    return optimisticMessages.filter(
      (optMsg) =>
        !realLogs.some(
          (log) =>
            log.message === optMsg.message &&
            Math.abs(new Date(log.timestamp) - new Date(optMsg.timestamp)) <
              5000,
        ),
    );
  }, [realLogs, optimisticMessages]);

  const allMessages = useMemo(() => {
    return mergeMessagesWithDeduplication(
      realLogs,
      deduplicatedOptimisticMessages,
    );
  }, [realLogs, deduplicatedOptimisticMessages]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxHeight: "100%",
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
          overflow: "hidden",
        }}
      >
        <Box
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.mode === "dark" ? "#555" : "#c1c1c1",
              borderRadius: "3px",
              "&:hover": {
                background: theme.palette.mode === "dark" ? "#777" : "#a8a8a8",
              },
            },
            scrollbarWidth: "thin",
            scrollbarColor:
              theme.palette.mode === "dark"
                ? "#555 transparent"
                : "#c1c1c1 transparent",
          }}
        >
          <Box
            sx={{
              p: 3,
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {chatHistory.length === 0 &&
              allMessages.length === 0 &&
              !showThinking && (
                <Box
                  sx={{
                    textAlign: "center",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "300px",
                  }}
                >
                  <SmartToyIcon
                    sx={{
                      fontSize: 48,
                      color: theme.palette.text.disabled,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                    {currentAgentType === "presentation"
                      ? "Presentation Agent"
                      : "Super Agent"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start a conversation to see AI responses stream in real-time
                  </Typography>
                </Box>
              )}

            {chatHistory.map((message) => (
              <InteractiveChatMessage
                key={message.id}
                message={message}
                onResponse={() => {}}
                onFeedback={() => {}}
                onPreferenceUpdate={() => {}}
              />
            ))}

            {allMessages.map((log, index) => {
              if (log.role === "user") {
                return (
                  <UserMessage
                    key={`user-${log.id || log.timestamp || index}`}
                    message={log.message}
                    timestamp={log.timestamp}
                  />
                );
              } else if (log.role === "agent") {
                const agentIndex = processedLogs.findIndex(
                  (processedLog) => processedLog.timestamp === log.timestamp,
                );

                if (agentIndex >= 0) {
                  return (
                    <StreamingMessage
                      key={processedLogs[agentIndex].id}
                      log={processedLogs[agentIndex]}
                      logIndex={agentIndex}
                      isTyping={agentIndex === currentlyTypingIndex}
                      onTypingComplete={handleTypingComplete}
                      registerAnimationCallback={registerAnimationCallback}
                      unregisterAnimationCallback={unregisterAnimationCallback}
                      sessionStatus={sessionStatus}
                      processedLogs={processedLogs}
                      theme={theme}
                    />
                  );
                }
              }
              return null;
            })}

            {showThinking &&
              sessionStatus !== "completed" &&
              sessionStatus !== "failed" &&
              sessionStatus !== "saved" && (
                <Box sx={{ mt: 1 }}>
                  <TypingAnimation
                    text={
                      sessionStatus === "failed"
                        ? "Processing failed..."
                        : isLoading
                          ? "Thinking..."
                          : "Processing..."
                    }
                  />
                </Box>
              )}

            <div ref={chatEndRef} />
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            flexShrink: 0,
            maxHeight: "300px",
            overflow: "hidden",
          }}
        >
          {!hideInputField && (
            <InputArea
              currentAgentType={currentAgentType}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSend={onSend}
              isLoading={isLoading}
              setUploadedFiles={setUploadedFiles}
              setFileUrls={setFileUrls}
              uploadedFiles={uploadedFiles}
              fileUrls={fileUrls}
            />
          )}
        </Box>
      </Box>

      {/* for simulation */}
      {hideInputField && simulationCompleted && (
        <FooterCta
          isMobile={isMobile}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </>
  );
}
