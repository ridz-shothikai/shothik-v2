// src/components/tools/paraphrase/CustomModeModal.jsx
import { Dialog, DialogContent, useMediaQuery, useTheme } from "@mui/material";
import CustomModeContent from "./CustomModeContent";

/**
 * Modal wrapper for creating custom modes
 */
const CustomModeModal = ({
  open,
  onClose,
  recentModes,
  recommendedModes,
  onSubmit,
  error,
  isLoading,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = (modeName) => {
    onSubmit(modeName);
    // Modal will be closed by parent component after successful submission
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <CustomModeContent
          mode="create"
          recentModes={recentModes}
          recommendedModes={recommendedModes}
          onSubmit={handleSubmit}
          onClose={onClose}
          error={error}
          isLoading={isLoading}
          showHeader={true}
          showActions={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomModeModal;
