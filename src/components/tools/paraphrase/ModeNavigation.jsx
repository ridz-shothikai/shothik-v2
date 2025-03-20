import { Lock } from "@mui/icons-material";
import { Box, Slider, Stack, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { modes } from "../../../_mock/tools/paraphrase";

const ModeNavigation = ({
  selectedMode,
  setSelectedMode,
  userPackage,
  selectedSynonyms,
  setSelectedSynonyms,
  SYNONYMS,
  setShowMessage,
}) => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      sx={{ paddingX: 2, paddingTop: 1 }}
      spacing={2}
    >
      <Tabs
        value={selectedMode}
        onChange={(_, value) => {
          const isValid = modes
            .find((item) => item.value === value)
            .package.includes(userPackage || "free");
          if (isValid) {
            setSelectedMode(value);
            setShowMessage({ show: false, Component: null });
          } else {
            setShowMessage({ show: true, Component: value });
          }
        }}
        sx={{
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .MuiTabs-scrollButtons": {
            width: "24px",
            height: "24px",
          },
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            display: "none",
          },
          "& .MuiButtonBase-root": {
            marginRight: { sm: "20px", md: "30px" },
          },
          alignItems: "center",
        }}
        textColor='primary'
        variant='scrollable'
        scrollButtons='auto'
      >
        {modes.map((mode, index) => (
          <Tab
            key={index}
            value={mode.value}
            label={
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='center'
                spacing={1}
              >
                {!mode.package.includes(userPackage || "free") && (
                  <Lock sx={{ width: 12, height: 12 }} />
                )}
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                  {mode.value}
                </Typography>
              </Stack>
            }
          />
        ))}
      </Tabs>

      <Box sx={{ width: "150px" }}>
        <Slider
          aria-label='Synonyms'
          getAriaValueText={(value) => SYNONYMS[value]}
          value={Object.keys(SYNONYMS).find(
            (key) => SYNONYMS[key] === selectedSynonyms
          )}
          marks
          step={20}
          min={20}
          max={80}
          valueLabelDisplay='on'
          valueLabelFormat={selectedSynonyms}
          onChange={(_, value) => setSelectedSynonyms(SYNONYMS[value])}
          sx={{
            mt: { xs: 2, sm: 1 },
            width: "100%",
            "& .MuiSlider-valueLabel": {
              fontSize: "12px",
              padding: "2px 6px",
              transform: "translateY(-21px)",
              "&:before": {
                width: "6px",
                height: "6px",
                bottom: "-0px",
              },
            },
          }}
        />
      </Box>
    </Stack>
  );
};

export default ModeNavigation;
