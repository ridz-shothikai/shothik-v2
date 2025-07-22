import { ExpandMore, Info, Lightbulb } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, List, ListItem, ListItemText, Typography } from "@mui/material";

// Metadata display component (unchanged)
const MetadataDisplay = ({ metadata }) => {
  if (!metadata) return null;

  return (
    <Box sx={{ mt: 2, p: 0 }}>
      {metadata.summary && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Info color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={600}>
                Summary
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", lineHeight: 1.6 }}
            >
              {metadata.summary}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
      {metadata.keyPoints && metadata.keyPoints.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Lightbulb color="warning" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={600}>
                Key Points ({metadata.keyPoints.length})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense sx={{ py: 0 }}>
              {metadata.keyPoints.map((point, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", lineHeight: 1.5 }}
                      >
                        • {point}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default MetadataDisplay;
