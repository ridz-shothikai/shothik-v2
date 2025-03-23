import { Lock } from "@mui/icons-material";
import { Slider, Stack, Tab, Tabs, Tooltip } from "@mui/material";
const models = ["Panda", "Raven"];

const TopNavigation = ({
  model,
  setModel,
  setShalowAlert,
  userPackage,
  currentLength,
  setCurrentLength,
  LENGTH,
}) => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      sx={{
        borderBottom: "1px solid",
        borderBottomColor: "divider",
        paddingX: 2,
      }}
    >
      <Tabs
        value={model}
        textColor='primary'
        sx={{
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        {models.map((tab) => (
          <Tab
            key={tab}
            value={tab}
            color='#00A76F'
            sx={{
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
            label={
              <Tooltip title='Model' arrow placement='top'>
                {tab}
              </Tooltip>
            }
            icon={
              !/pro_plan|unlimited/.test(userPackage) && tab === "Raven" ? (
                <Lock sx={{ width: 12, height: 12 }} />
              ) : undefined
            }
            onClick={() => {
              if (!/pro_plan|unlimited/.test(userPackage) && tab === "Raven") {
                setShalowAlert(true);
              } else {
                setShalowAlert(false);
              }
              setModel(tab);
            }}
          />
        ))}
      </Tabs>

      <Slider
        style={{ width: "150px" }}
        aria-label='Length'
        getAriaValueText={(value) => LENGTH[value]}
        value={Object.keys(LENGTH).find((key) => LENGTH[key] === currentLength)}
        marks
        step={20}
        min={20}
        max={80}
        valueLabelDisplay='on'
        valueLabelFormat={currentLength}
        onChange={(_, value) => setCurrentLength(LENGTH[value])}
        sx={{
          mt: { xs: 2, sm: 0 },
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
    </Stack>
  );
};

export default TopNavigation;
