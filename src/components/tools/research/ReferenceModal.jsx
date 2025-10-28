"use client";

import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  Backdrop,
} from "@mui/material";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";

const ReferenceModal = ({ open, onClose, reference, sources, anchorEl }) => {
  const theme = useTheme();

  console.log('ReferenceModal props:', { open, reference, sources: sources?.length, anchorEl });

  if (!reference || !sources) return null;

  // Find sources that match this reference number
  const matchingSources = sources.filter(
    (source) => source.reference === reference
  );

  const handleOpenUrl = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

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

  return (
    <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              position: "fixed",
            },
          },
        }}
        sx={{
          zIndex: 1300,
          "& .MuiPopover-paper": {
            backgroundColor: "#ffffff",
            borderRadius: 1,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            minWidth: 280,
            maxWidth: 350,
            maxHeight: 250,
          },
        }}
      >
        <Box sx={{ p: 0 }}>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: "rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "black",
                fontWeight: 600,
                fontSize: "0.8rem",
              }}
            >
              Sources {matchingSources.length}
            </Typography>
          </Box>

          {matchingSources.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 120,
                textAlign: "center",
                p: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No sources found
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0, maxHeight: 200, overflow: "auto" }}>
              {matchingSources.map((source, index) => (
                <ListItem
                  key={index}
                  sx={{
                    cursor: "pointer",
                    px: 2,
                    py: 0.8,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    },
                    borderBottom: index < matchingSources.length - 1 ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
                  }}
                  onClick={() => handleOpenUrl(source.url)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Avatar
                      sx={{
                        width: 18,
                        height: 18,
                        fontSize: "0.6rem",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        color: "black",
                      }}
                      src={getFaviconUrl(source.url)}
                    >
                      {getDomainAbbr(source.url)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.2,
                          color: "black",
                          fontSize: "0.75rem",
                        }}
                      >
                        {source.title || "Untitled Source"}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(0, 0, 0, 0.6)",
                          fontSize: "0.65rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getDomain(source.url)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
  );
};

export default ReferenceModal;