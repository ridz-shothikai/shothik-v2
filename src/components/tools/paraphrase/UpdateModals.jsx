import { Button, Chip, Grid2, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import Link from "next/link";

export function MessageTemplate({
  title,
  desc,
  chipLabels,
  chipBgColors,
  inputText,
  paraphrasedText,
}) {
  return (
    <Box
      sx={{
        "& .MuiChip-label": {
          fontSize: "14px",
          fontWeight: 500,
        },
        height: "100%",
        width: "100%",
        padding: 2,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "background.paper",
        zIndex: "-1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ mb: { xs: 0.5, md: 1, lg: 1.5 }, position: "relative" }}>
        {/* element starts */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 0, md: 0, lg: "-100px" },
            right: { xs: "10%", md: "40%", lg: "42%", xl: "-120px" },
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
          }}
        >
          <Box
            sx={{
              display: { xs: "block", sm: "none", md: "none", lg: "block" },
              transform: {
                xs: "scaleX(-1)",
                sm: "none",
                md: "none",
                lg: "scale(1.2)",
              },
            }}
          >
            <Image src="/fromTo-2.svg" alt="arrow" width={120} height={120} />
          </Box>
        </Box>
        {/* element ends */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography
            gutterBottom
            variant="subtitle1"
            sx={{
              overflow: "hidden",
              textAlign: "start",
              fontSize: { xs: "12px", lg: "16px" },
              fontWeight: 600,
              color: "#212B36",
              mb: "0px !important",
            }}
          >
            {title}
          </Typography>

          <Typography
            gutterBottom
            variant="subtitle2"
            sx={{
              overflow: "hidden",
              textAlign: "start",
              fontSize: { xs: "12px", lg: "14px" },
              fontWeight: 400,
              color: "#858481",
              mb: "0px !important",
            }}
          >
            {desc}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          p: { xs: 1.5, md: 2, lg: 3 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1, md: 2, lg: 2.5 },
          border: "1px solid #919EAB33",
          borderRadius: { xs: "8px", md: "12px", lg: "16px" },
        }}
      >
        <Grid2 spacing={1}>
          <Grid2
            size={{ xs: 12 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.5, lg: 1 },
            }}
          >
            <Typography
              gutterBottom
              variant="subtitle2"
              sx={{
                overflow: "hidden",
                textAlign: "start",
                fontSize: { xs: "12px", lg: "14px" },
                fontWeight: 600,
                color: "#212B36",
                mb: "0px !important",
              }}
            >
              Uses
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1, md: 1.5, lg: 2 },
                maxWidth: "55%",
              }}
            >
              {chipLabels.map((label, index) => (
                <Chip
                  key={index}
                  label={label}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? ""
                        : chipBgColors[index] || "#e8f4ff",
                    borderRadius: "8px",
                    fontSize: "14px",
                    // px: 1,
                    // flex: "0 0 48%",
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                  }}
                />
              ))}
            </Box>
          </Grid2>
        </Grid2>

        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 0, md: 2 },
            flexDirection: { sm: "column", md: "column", lg: "row" },
            position: "relative",
          }}
        >
          <Box
            sx={{
              flex: 1,
              p: { xs: 1.5, md: 2, lg: 3 },
              display: "flex",
              flexDirection: "column",
              gap: { xs: 0.5, lg: 1 },
              borderRadius: { xs: 1, md: 1.5, lg: 2 },
              boxShadow:
                "0 0 2px 0 rgba(145, 158, 171, 0.20), 0 12px 24px -4px rgba(145, 158, 171, 0.12)",
            }}
          >
            <Typography
              gutterBottom
              variant="subtitle2"
              sx={{
                overflow: "hidden",
                textAlign: "start",
                fontSize: { xs: "12px", lg: "14px" },
                fontWeight: 600,
                color: "#212B36",
                mb: "0px !important",
              }}
            >
              Input text
            </Typography>
            <Typography
              sx={{
                color: "#858481",
              }}
            >
              {inputText}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: { xs: 1.5, md: 2, lg: 3 },
              display: "flex",
              flexDirection: "column",
              gap: { xs: 0.5, lg: 1 },
              borderRadius: { xs: 1, md: 1.5, lg: 2 },
              boxShadow:
                "0 0 2px 0 rgba(145, 158, 171, 0.20), 0 12px 24px -4px rgba(145, 158, 171, 0.12)",
            }}
          >
            <Typography
              gutterBottom
              variant="subtitle2"
              sx={{
                overflow: "hidden",
                textAlign: "start",
                fontSize: { xs: "12px", lg: "14px" },
                fontWeight: 600,
                color: "#212B36",
                mb: "0px !important",
              }}
            >
              Paraphrased Text
            </Typography>
            <Typography
              sx={{
                color: "#858481",
              }}
            >
              {paraphrasedText}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Link href={"/"}>
        <Button></Button>
      </Link>
    </Box>
  );
}

export function FormalMessage() {
  return (
    <MessageTemplate
      title="Formal"
      desc="Polishing Professional and Business Communication"
      inputText="“Hey, just wanted to check if you saw my last email about the proposal.”"
      paraphrasedText="“I wanted to kindly follow up regarding my previous email about the proposal.”"
      chipLabels={[
        "Professional Writing",
        "Email Writing",
        "Corporate Tone",
        "Professional Refinement",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function AcademicMessage() {
  return (
    <MessageTemplate
      title="Academic"
      mode="Academic"
      inputText="Joyful crowds gathered for the parade, cheering as floats and bands passed."
      paraphrasedText="Enthusiastic attendees assembled for the event, expressing approval as vivid floats and musical ensembles proceeded."
      chipLabels={[
        "Rephrasing for Academic Tone",
        "Rewriting for Clarity",
        "Avoiding Colloquialisms",
        "Rewriting for Professionalism",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function NewsMessage() {
  return (
    <MessageTemplate
      title="News"
      inputText="Joyful crowds gathered for the parade, cheering as floats and bands passed."
      paraphrasedText="Excited crowds gathered for the parade, cheering while multicolored floats and energetic bands moved past."
      chipLabels={[
        "Rephrasing for Newsworthiness",
        "Rewriting for Objectivity",
        "Rewriting for Journalistic Standards",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function SimpleMessage() {
  return (
    <MessageTemplate
      title="Simple"
      inputText="Joyful crowds gathered for the parade, cheering as floats and bands passed."
      paraphrasedText="Happy people watched the parade, clapping as bright floats and bands went by."
      chipLabels={[
        "Writing for Clarity",
        "Rewriting for Simplicity",
        "Using Simple Language",
        "Rewriting for Readability",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function CreativeMessage() {
  return (
    <MessageTemplate
      title="Creative"
      inputText="Joyful crowds gathered for the parade, cheering as floats and bands passed."
      paraphrasedText="Radiant crowds filled the streets, celebrating each colorful float and every band’s rhythmic performance."
      chipLabels={[
        "Writing for Clarity",
        "Rewriting for Creativity",
        "Using Engaging Language",
        "Rewriting for Emotional Connection",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function ShortMessage() {
  return (
    <MessageTemplate
      title="Short"
      inputText="Joyful crowds gathered for the parade, cheering as floats and bands passed."
      paraphrasedText="Crowds cheered as floats and bands paraded through the streets with joy."
      chipLabels={[
        "Writing for Clarity",
        "Rewriting for Brevity",
        "Using Clear Language",
        "Rewriting for Readability",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function LongMessage() {
  return (
    <MessageTemplate
      title="Long"
      inputText="Joyful crowds gathered for the parade, cheering as floats and bands passed."
      paraphrasedText="Joyful and excited crowds thronged the streets for the grand parade, eagerly cheering as brightly decorated floats rolled by and spirited bands performed lively music, creating an atmosphere of celebration and unity."
      chipLabels={[
        "Writing for Clarity",
        "Rewriting for Detail",
        "Avoiding Informal Tones",
        "Rewriting for Professionalism",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}
