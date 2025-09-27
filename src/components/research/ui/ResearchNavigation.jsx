import { Box, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setActiveResearch } from "../../../redux/slice/researchCoreSlice";
import { Tab } from "@mui/icons-material";

export default function ResearchNavigation() {
  const { researches, activeResearchIndex } = useSelector(
    (state) => state.researchCore,
  );
  const dispatch = useDispatch();

  const handleTabChange = (event, newValue) => {
    dispatch(setActiveResearch(newValue));
  };

  if (!researches || researches.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ mb: 2, borderBottom: "1px solid #e0e0e0" }}>
      <Tabs
        value={activeResearchIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#07B37A",
          },
          "& .MuiTab-root": {
            minWidth: 120,
            textTransform: "none",
            fontSize: "14px",
            "&.Mui-selected": {
              color: "#07B37A",
            },
          },
        }}
      >
        {researches.map((research, index) => (
          //   <Tab
          //     key={research._id || `research-${index}`}
          //     label={`Research ${index + 1}`}
          //   />
          <p
            key={index + 1}
            style={{
              marginInline: "10px",
            }}
          >
            {index + 1}
          </p>
        ))}
      </Tabs>
    </Box>
  );
}
