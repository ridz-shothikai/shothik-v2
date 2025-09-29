import { AcUnit } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useState } from "react";
import MobileFreezeModal from "./MobileFreezeModal";
import ModeModal from "./ModeModal";

const ModeNavigationForMobile = ({
  selectedMode,
  setSelectedMode,
  userPackage,
  initialFrozenWords,
  frozenWords,
  isLoading,
}) => {
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showMoModeModal, setShowModeModal] = useState(false);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      justifyContent="center"
      sx={{ paddingTop: 1.5, paddingBottom: 1 }}
    >
      <Button
        variant="outlined"
        size="medium"
        color="primary"
        onClick={() => setShowModeModal(true)}
        disabled={isLoading}
        sx={{
          textTransform: "none",
          mr: 2,
          px: 3,
          borderRadius: 1,
        }}
      >
        {selectedMode || "Modes"}
      </Button>
      <Button
        onClick={() => setShowFreezeModal(true)}
        disabled={!userPackage || userPackage === "free"}
        sx={{ textAlign: "right" }}
        startIcon={<AcUnit />}
        variant="outlined"
      >
        Freeze Words
      </Button>

      <ModeModal
        handleClose={() => setShowModeModal(false)}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        showModeModal={showMoModeModal}
        userPackage={userPackage}
        isLoading={isLoading}
      />

      <MobileFreezeModal
        handleClose={() => setShowFreezeModal(false)}
        isFreeze={showFreezeModal}
        initialFrozenWords={initialFrozenWords}
        frozenWords={frozenWords}
        userPackage={userPackage}
      />
    </Stack>
  );
};

export default ModeNavigationForMobile;
