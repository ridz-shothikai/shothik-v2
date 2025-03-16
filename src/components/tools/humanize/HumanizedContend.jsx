"use client";

import { Box, Card, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import useResponsive from "../../../hooks/useResponsive";
import UserActionInput from "../common/UserActionInput";
import InputBottom from "./InputBottom";
import TopNavigation from "./TopNavigation";

const LENGTH = {
  20: "Basic",
  40: "Intermediate",
  60: "Advanced",
  80: "Expert",
};

const HumanizedContend = () => {
  const [currentLength, setCurrentLength] = useState(LENGTH[20]);
  const [showShalowAlert, setShalowAlert] = useState(false);
  const miniLabel = useResponsive("between", "md", "xl");
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const isMobile = useResponsive("down", "sm");
  const [model, setModel] = useState("Panda");

  function handleSampleText() {
    setUserInput(
      "Shark Tank is a popular reality TV show where entrepreneurs pitch their business ideas to a panel of wealthy investors, known as 'sharks,' seeking funding and mentorship. The sharks evaluate the proposals, ask critical questions, and decide whether to invest in exchange for equity or royalties. The show offers entrepreneurs a platform to showcase innovative products and secure funding, while viewers gain insights into entrepreneurship, negotiation, and business strategies. Shark Tank has helped launch many successful businesses and inspired countless individuals to pursue their entrepreneurial dreams. Its mix of innovation, drama, and opportunity makes it a favorite among audiences worldwide."
    );
  }

  function handleClear() {
    setUserInput("");
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Card
        sx={{
          position: "relative",
          height: 420,
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
        }}
      >
        <TopNavigation
          model={model}
          setModel={setModel}
          setShalowAlert={setShalowAlert}
          userPackage={user?.package}
          LENGTH={LENGTH}
          currentLength={currentLength}
          setCurrentLength={setCurrentLength}
        />
        <TextField
          name='input'
          variant='outlined'
          rows={13}
          fullWidth
          multiline
          placeholder='Enter your text here...'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={showShalowAlert}
          sx={{
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
              "& textarea": {
                textAlign: "left",
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              },
            },
            "& .MuiInputBase-root": {
              paddingBottom: "0px",
            },
          }}
        />
        {!userInput ? (
          <UserActionInput
            setUserInput={setUserInput}
            isMobile={isMobile}
            handleSampleText={handleSampleText}
          />
        ) : (
          <InputBottom
            handleClear={handleClear}
            isLoading={isLoading}
            isMobile={isMobile}
            miniLabel={miniLabel}
            userInput={userInput}
            userPackage={user?.package}
          />
        )}
      </Card>
    </Box>
  );
};

export default HumanizedContend;
