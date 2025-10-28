// src/components/tools/paraphrase/CustomModePopover.jsx
import { Box, Popover } from "@mui/material";
import CustomModeContent from "./CustomModeContent";

/**
 * Popover wrapper for editing existing custom modes
 * Shows when user clicks on a custom mode tab
 */
const CustomModePopover = ({
  anchorEl,
  open,
  onClose,
  modeName,
  recentModes,
  recommendedModes,
  onUpdate,
  onDelete,
  error,
  isLoading,
}) => {
  const handleUpdate = (newName) => {
    onUpdate(newName);
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      PaperProps={{
        sx: {
          mt: 1,
          boxShadow: 3,
          borderRadius: 2,
          maxWidth: 500,
        },
      }}
      // Prevent popover from closing when clicking inside
      disableRestoreFocus
    >
      <Box sx={{ p: 2.5 }}>
        <CustomModeContent
          mode="edit"
          existingModeName={modeName}
          recentModes={recentModes}
          recommendedModes={recommendedModes}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          onClose={onClose}
          error={error}
          isLoading={isLoading}
          showHeader={true}
          showActions={true}
        />
      </Box>
    </Popover>
  );
};

export default CustomModePopover;
