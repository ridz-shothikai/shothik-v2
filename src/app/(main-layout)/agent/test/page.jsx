import { Box, Container } from "@mui/material";
import { agent_result } from "../../../../_mock/agent";
import RenderMarkdown from "../../../../components/agent/RenderMarkdown";

const test = () => {
  return (
    <Container maxWidth='md' sx={{ height: "100%" }}>
      <Box>
        <RenderMarkdown content={agent_result} />
      </Box>
    </Container>
  );
};

export default test;
