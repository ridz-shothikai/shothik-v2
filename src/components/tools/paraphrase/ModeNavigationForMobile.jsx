import { Button, Stack } from "@mui/material"; // Removed AcUnit
import React, { useState } from "react";
// import MobileFreezeModal from "./MobileFreezeModal"; // Removed
import ModeModal from "./ModeModal";

const ModeNavigationForMobile = ({
  selectedMode,
  setSelectedMode,
  userPackage,
  // freezeWords, // Removed
  // setFreezeWords, // Removed
}) => {
  // const [showFreezeModal, setShowFreezeModal] = useState(false); // Removed
  const [showMoModeModal, setShowModeModal] = useState(false);

  return (
    <Stack
      direction='row'
      alignItems='center'
      spacing={2}
      justifyContent='center'
      sx={{ paddingTop: 1.5, paddingBottom: 1 }}
    >
      <Button
        variant='outlined'
        size='medium'
        color='primary'
        onClick={() => setShowModeModal(true)}
        sx={{
          textTransform: "none",
          mr: 2,
          px: 3,
          borderRadius: 1,
        }}
      >
        {selectedMode || "Modes"}
      </Button>
      {/* Freeze Words Button Removed */}

      <ModeModal
        handleClose={() => setShowModeModal(false)}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        showModeModal={showMoModeModal}
        userPackage={userPackage}
      />

      {/* MobileFreezeModal instance removed */}
    </Stack>
  );
};

export default ModeNavigationForMobile;
