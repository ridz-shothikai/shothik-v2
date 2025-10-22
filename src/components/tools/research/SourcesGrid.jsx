"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  useTheme,
} from "@mui/material";

const SourcesGrid = ({ sources }) => {
  const theme = useTheme();

  if (!sources || sources.length === 0) return null;

  // Function to get domain from URL
  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Function to get favicon URL
  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  // Function to get domain abbreviation
  const getDomainAbbr = (url) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      const parts = domain.split('.');
      if (parts.length >= 2) {
        return parts[0].substring(0, 2).toUpperCase();
      }
      return domain.substring(0, 2).toUpperCase();
    } catch {
      return '??';
    }
  };

  const handleSourceClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: "text.primary",
          fontWeight: 600,
        }}
      >
        Sources ({sources.length})
      </Typography>
      
      <Grid container spacing={1.5}>
        {sources.slice(0, 6).map((source, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              variant="outlined"
              sx={{
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 2,
                  transform: "translateY(-1px)",
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={() => handleSourceClick(source.url)}
            >
              <CardContent sx={{ p: 2, flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: "0.7rem",
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      color: "black",
                      flexShrink: 0,
                    }}
                    src={getFaviconUrl(source.url)}
                  >
                    {getDomainAbbr(source.url)}
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.3,
                        color: "text.primary",
                        fontSize: "0.875rem",
                        mb: 0.5,
                      }}
                    >
                      {source.title || "Untitled Source"}
                    </Typography>
                    
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {getDomain(source.url)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {sources.length > 6 && (
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            mt: 1,
            display: "block",
            textAlign: "center",
          }}
        >
          +{sources.length - 6} more sources available
        </Typography>
      )}
    </Box>
  );
};

export default SourcesGrid;
