import useResponsive from "@/hooks/useResponsive";
import SvgColor from "@/resource/SvgColor";
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
  const isMd = useResponsive("up", "sm");
  return (
    <Box
      sx={{
        "& .MuiChip-label": {
          fontSize: "14px",
          fontWeight: 500,
        },
        height: "100%",
        width: "100%",
        padding: { xs: "50px 10px 0 10px", lg: 2 },
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Box sx={{ mb: { xs: 0.5, md: 1, lg: 1.5 }, position: "relative" }}>
        {/* element starts */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-100px",
            right: { xs: "-100px", lg: "-120px", xl: "-120px" },
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
              transform: {
                xs: "none",
                sm: "none",
                md: "none",
                xl: "scale(1.2)",
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
              textAlign: "center",
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
          alignItems: "center",
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
                maxWidth: { xl: "65%" },
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
                    "& .MuiChip-label": {
                      fontSize: { xs: "12px", lg: "14px" },
                      fontWeight: 400,
                    },
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
            gap: { xs: 1.5, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
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
                fontSize: { xs: "12px", xl: "14px" },
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
                fontSize: { xs: "12px", xl: "14px" },
              }}
            >
              {paraphrasedText}
            </Typography>
          </Box>
        </Box>
        {/* upgrade button */}
        <Link href={"/pricing"}>
          <Button
            data-umami-event="Nav: Upgrade To Premium"
            color="primary"
            size={isMd ? "medium" : "small"}
            variant="contained"
            rel="noopener"
            sx={{
              maxWidth: "fit-content",
            }}
            startIcon={
              <SvgColor
                src="/navbar/diamond.svg"
                sx={{
                  width: { xs: 20, md: 24 },
                  height: { xs: 20, md: 24 },
                }}
              />
            }
          >
            Upgrade Plan
          </Button>
        </Link>
      </Box>
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
      desc="Refining Research Writing for Academic Standards Goal"
      mode="Academic"
      inputText="“Pollution is a big problem that makes the environment worse and affects people's health.”"
      paraphrasedText="“Environmental pollution poses a significant threat to ecological balance and public health.”"
      chipLabels={[
        "Research Writing",
        "Formal Tone",
        "Thesis Preparation",
        "Technical Accuracy",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function NewsMessage() {
  return (
    <MessageTemplate
      title="News"
      desc="Rewriting Articles with a Clear, Neutral, and Journalistic Tone"
      inputText="“The company proudly launched an amazing new phone that’s going to change the market!”"
      paraphrasedText="“The company has launched a new smartphone that it claims could impact the market.”"
      chipLabels={[
        "Journalistic Writing",
        "Media Editing",
        "Fact Based Writing",
        "Objective Writing",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function SimpleMessage() {
  return (
    <MessageTemplate
      title="Simple"
      desc="Making Complex Text Easy to Read and Understand"
      inputText="“Photosynthesis is a biochemical process through which green plants synthesize organic compounds using light energy.”"
      paraphrasedText="“Photosynthesis is the process plants use to make food from sunlight.”"
      chipLabels={[
        "Easy Language",
        "Plain Writing",
        "Readable Content",
        "Simplified Text",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function CreativeMessage() {
  return (
    <MessageTemplate
      title="Creative"
      desc="Transforming Ordinary Text into Engaging, Original, and Expressive Writing"
      inputText="“This perfume smells nice and lasts a long time.”"
      paraphrasedText="“This perfume wraps you in a lasting aura of elegance, leaving a scent that lingers beautifully throughout the day.”"
      chipLabels={[
        "Content Writing",
        "Copy writing",
        "Storytelling",
        "Expressive Tone",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function ShortMessage() {
  return (
    <MessageTemplate
      title="Short"
      desc="Condensing Long Text into Clear, Concise Sentences"
      inputText="“Our company is committed to providing high-quality products that meet customer expectations and ensure satisfaction.”"
      paraphrasedText="“We deliver quality products that satisfy our customers.”"
      chipLabels={[
        "Concise Writing",
        "Content Editing",
        "Summarized Writing",
        "Social Media Copy",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}

export function LongMessage() {
  return (
    <MessageTemplate
      title="Long"
      desc="Expanding Short Text into Detailed, Well-Explained Sentences"
      inputText="“Climate change is dangerous.”"
      paraphrasedText="“Climate change poses a serious threat to the environment, affecting weather patterns, ecosystems, and human livelihoods across the globe.”"
      chipLabels={[
        "Expanded Writing",
        "Detailed Content",
        "Content Development",
        "ElaboratedText",
      ]}
      chipBgColors={["#8E33FF14", "#00B8D914", "#22C55E14", "#FFAB0014"]}
    />
  );
}
