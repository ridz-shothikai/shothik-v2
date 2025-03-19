import { AutoAwesome } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import CopyButon from "../../blog/details/CopyButon";
import MarkdownRenderer from "./MarkdownRenderer";
import MultiSearch from "./multi-search";

const RenderPart = ({ data, group, isLoading }) => {
  switch (data.type) {
    case "text":
      return (
        <Box>
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
              <CopyButon text={data.data} />
            </Box>
          </Box>
          <MarkdownRenderer content={data.data} />
        </Box>
      );
    case "tool-invocation": {
      if (group === "web") {
        return <MultiSearch data={data.data} isLoading={isLoading} />;
      }

      // if (group === "academic") {
      //   if (!result) {
      //     return (
      //       <SearchLoadingState
      //         icon={Book}
      //         text='Searching academic papers...'
      //       />
      //     );
      //   }

      //   return <Academic result={result} />;
      // }
    }
    case "reasoning": {
      console.log("reasoning", data);
      return null;
    }
    default:
      return null;
  }
};

export default RenderPart;
