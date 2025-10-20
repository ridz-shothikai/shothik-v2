import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TableChart,
  CheckCircle,
  Error,
  Schedule,
  Visibility,
} from "@mui/icons-material";

const ConversationCard = ({ conversation, onViewData, isActive = false }) => {
  const handleViewClick = () => {
    if (onViewData && conversation.response) {
      onViewData(conversation);
    }
  };

  const getStatusInfo = () => {
    if (conversation.response && conversation.response.rows) {
      return {
        status: "completed",
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
        color: "success",
        text: `${conversation.response.rows.length} rows`,
      };
    } else if (conversation.response) {
      return {
        status: "completed",
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
        color: "success",
        text: "Generated",
      };
    } else {
      return {
        status: "pending",
        icon: <Schedule sx={{ fontSize: 16 }} />,
        color: "warning",
        text: "No response",
      };
    }
  };

  const statusInfo = getStatusInfo();
  const hasData = conversation.response && conversation.response.rows;

  return (
    <Card
      sx={{
        mb: 2,
        cursor: hasData ? "pointer" : "default",
        border: isActive ? "2px solid" : "1px solid",
        borderColor: isActive ? "primary.main" : "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": hasData
          ? {
              boxShadow: 2,
              borderColor: "primary.main",
            }
          : {},
        opacity: hasData ? 1 : 0.7,
      }}
      onClick={hasData ? handleViewClick : undefined}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: 1.4,
                mb: 1,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {conversation.prompt}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={statusInfo.icon}
                label={statusInfo.text}
                size="small"
                color={statusInfo.color}
                variant="outlined"
                sx={{ height: 20 }}
              />

              {hasData && (
                <Chip
                  icon={<TableChart sx={{ fontSize: 14 }} />}
                  label={`${conversation.response.columns?.length || 0} cols`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20 }}
                />
              )}

              <Typography variant="caption" color="text.secondary">
                {new Date(conversation.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Box>

          {hasData && (
            <Tooltip title="View this data in grid">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewClick();
                }}
              >
                <Visibility sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConversationCard;
