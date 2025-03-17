import { AutoAwesome, Book } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import CopyButon from "../../blog/details/CopyButon";
import Academic from "./Academic";
import MarkdownRenderer from "./MarkdownRenderer";
import MultiSearch from "./multi-search";
import { SearchLoadingState } from "./SearchLoadingState";

const RenderPart = ({ part, messageIndex, partIndex, parts }) => {
  if (
    part.type === "text" &&
    partIndex === 0 &&
    parts.some((p, i) => i > partIndex && p.type === "tool-invocation")
  ) {
    return null;
  }

  switch (part.type) {
    case "text":
      if (!part?.text?.trim()) return null;
      return (
        <Box key={`${messageIndex}-${partIndex}-text`}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoAwesome sx={{ fontSize: 28, color: "primary.main" }} />
              <Typography variant='body1' fontWeight={600} color='text.primary'>
                Answer
              </Typography>
            </Box>
            <Box>
              <CopyButon text={part.text} />
            </Box>
          </Box>
          <MarkdownRenderer content={part.text} />
        </Box>
      );
    case "tool-invocation": {
      const toolInvocation = part.toolInvocation;
      const args = JSON.parse(JSON.stringify(toolInvocation.args));
      const result =
        "result" in toolInvocation
          ? JSON.parse(JSON.stringify(toolInvocation.result))
          : null;

      if (toolInvocation.toolName === "web_search") {
        return <MultiSearch result={result} args={args} />;
      }

      if (toolInvocation.toolName === "academic_search") {
        if (!result) {
          return (
            <SearchLoadingState
              icon={Book}
              text='Searching academic papers...'
            />
          );
        }

        return <Academic result={result} />;
      }
    }
    case "reasoning": {
      console.log("reasoning", part);
      return null;
    }
    default:
      return null;
  }
};

export default RenderPart;
