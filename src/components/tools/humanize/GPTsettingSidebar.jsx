import { Close, History } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import UpgradePrompt from "../paraphrase/UpgradePrompt";
import GPTHistoryTab from "./GPTHistoryTab";

const tabs = [
  { id: "gpt-history", icon: <History />, component: GPTHistoryTab },
];

export default function GPTsettingSidebar({
  open,
  onClose,
  active,
  setActive,
  setHumanizeInput,
  allHumanizeHistory,
  refetchHistory,
}) {
  const { user } = useSelector((state) => state.auth);

  const paidUser =
    user?.package === "pro_plan" ||
    user?.package === "value_plan" ||
    user?.package === "unlimited";

  if (!open) return null;

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        borderLeft: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* top nav with bottom border */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pt: 2,
          pb: 1,
          // borderBottom: "1px solid",
          // borderColor: "divider",
        }}
      >
        {/* <Box sx={{ display: "flex", flex: 1, justifyContent: "space-around" }}>
          {tabs.map((t) => {
            return (
              <Box
                key={t.id}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <IconButton
                  size="large"
                  disableRipple
                  // disabled={disableActions && t.id !== "history"}
                  sx={{
                    color: "primary.main",
                  }}
                >
                  {React.cloneElement(t.icon, { fontSize: "30px" })}
                </IconButton>
                {active === t.id && (
                  <Box
                    sx={{
                      width: 24,
                      borderBottom: 2,
                      borderColor: "primary.main",
                      mt: 0.5,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box> */}

        <IconButton size="small" id="GPT_sidebar_x_button" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* active tab content */}
      {
        !paidUser ? (
          <UpgradePrompt onClose={onClose} />
        ) : // Modified rendering logic
        active === "gpt-history" ? (
          <GPTHistoryTab
            setHumanizeInput={setHumanizeInput}
            onClose={onClose}
            allHumanizeHistory={allHumanizeHistory}
            refetchHistory={refetchHistory}
          />
        ) : // For future tabs, We would add more conditions or a generic renderer
        // For now, if it's not gpt-history, we'll just render a placeholder or nothing
        // We might want to define a default component or handle other tabs here
        // For example:
        // {tabs.find((t) => t.id === active)?.component && (
        //   React.createElement(tabs.find((t) => t.id === active)?.component)
        // )}
        // For now, assuming GPTHistoryTab is the only one, we can keep it simple.
        // If other tabs are added, this logic will need to be expanded.
        null // Or a default component if no specific tab is active
      }
    </Box>
  );
}
