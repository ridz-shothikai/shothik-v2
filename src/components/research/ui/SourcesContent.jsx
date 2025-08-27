"use client";

import { Box, Typography, Card, CardContent, Grid, Link } from "@mui/material";

export default function SourcesContent({ sources }) {
  if (!sources || sources.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No Sources Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No sources were found for this research query
        </Typography>
      </Box>
    );
  }

  // Remove duplicates based on URL
  const uniqueSources = sources.filter(
    (source, index, self) =>
      index === self.findIndex((s) => s.url === source.url)
  );

  return (
    <Box
      sx={{
        px: 2,
        py: 3,
        mb: { xs: 17, sm: 7 , md: 5},
      }}
    >
      <Grid container spacing={1}>
        {uniqueSources.map((source, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={source._id || index}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                transition: "all 0.2s",
                cursor: "pointer",
                "&:hover": { boxShadow: 3 },
              }}
              onClick={() => window.open(source.url, "_blank")}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {source.title}
                </Typography>

                {(() => {
                  const displayUrl = source.resolved_url || source.url;
                  const hostname = new URL(displayUrl).hostname.replace(
                    "www.",
                    ""
                  );
                  return (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <img
                        src={`https://www.google.com/s2/favicons?sz=32&domain_url=${displayUrl}`}
                        alt=""
                        width={16}
                        height={16}
                      />
                      <span
                        style={{
                          wordBreak: "break-word",
                        }}
                      >
                        {hostname}
                      </span>
                    </Typography>
                  );
                })()}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
