import {
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useWordLimit from "../../../hooks/useWordLimit";
import SvgColor from "../../../resource/SvgColor";
import FreezeWordsContent from "../paraphrase/FreezeWordsContent";
function WordCounter({
  freeze_modal = false,
  freeze_props = {},
  userInput,
  isLoading,
  toolName,
  handleClearInput,
  children,
  userPackage,
  handleSubmit,
  btnText,
  btnDisabled = false,
  ExtraBtn = null,
  ExtraCounter = null,
  btnIcon = null,
  sx = {},
  dontDisable = false,
  sticky = 635,
  isMobile = false,
}) {
  // if (false) {
  //   const { ref, style } = useStickyBottom(sticky);
  //   return (
  //     <Box ref={ref} sx={style}>
  //       <Contend
  //         btnText={btnText}
  //         handleClearInput={handleClearInput}
  //         handleSubmit={handleSubmit}
  //         isLoading={isLoading}
  //         toolName={toolName}
  //         userInput={userInput}
  //         userPackage={userPackage}
  //         ExtraBtn={ExtraBtn}
  //         ExtraCounter={ExtraCounter}
  //         btnIcon={btnIcon}
  //         dontDisable={dontDisable}
  //         sx={sx}
  //         freeze_modal={freeze_modal}
  //         freeze_props={freeze_props}
  //       >
  //         {children}
  //       </Contend>
  //     </Box>
  //   );
  // } else {
  return (
    <Contend
      btnText={btnText}
      handleClearInput={handleClearInput}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      toolName={toolName}
      userInput={userInput}
      userPackage={userPackage}
      ExtraBtn={ExtraBtn}
      ExtraCounter={ExtraCounter}
      btnIcon={btnIcon}
      btnDisabled={btnDisabled}
      dontDisable={dontDisable}
      sx={sx}
      freeze_modal={freeze_modal}
      freeze_props={freeze_props}
      isMobile={isMobile}
    >
      {children}
    </Contend>
  );
}
// }

const Contend = ({
  userInput,
  isLoading,
  toolName,
  handleClearInput,
  children,
  userPackage,
  handleSubmit,
  btnText,
  ExtraBtn = null,
  ExtraCounter = null,
  btnIcon = null,
  btnDisabled = false,
  sx = {},
  freeze_modal = false,
  freeze_props = {},
  dontDisable = false,
  isMobile,
}) => {
  const [wordCount, setWordCount] = useState(0);
  // const isMobile = useResponsive("down", "sm"); // This is now passed as a prop
  const { wordLimit } = useWordLimit(toolName);

  useEffect(() => {
    const words = userInput.trim() ? String(userInput).split(" ").length : 0;
    setWordCount(words);
  }, [userInput]);
  const [show_freeze, set_show_freeze] = useState(false);
  const anchorRef = useRef(null);

  const handleToggleFreeze = () => {
    set_show_freeze((prev) => !prev);
  };

  const handleCloseFreeze = () => {
    set_show_freeze(false);
  };

  if (!userInput) return <Box sx={{ height: 48 }} />;
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        py: 1,
        px: 2,
        ...sx,
      }}
      bgcolor="background.paper"
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        height={48}
        sx={
          btnText === "Fix Grammar"
            ? { width: { xs: "100%", sm: "auto" } }
            : undefined
        }
        flex={1}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {/* <WordIcon /> */}
          <Typography
            variant="subtitle2"
            sx={{
              color: `${wordCount > wordLimit ? "error.main" : ""}`,
              whiteSpace: "nowrap",
              fontSize: { xs: "12px", lg: "14px" },
            }}
          >
            <b>{wordCount}</b> /{" "}
            {wordLimit === 9999 ? (
              <Typography component="span" sx={{ color: "primary.main" }}>
                Unlimited
              </Typography>
            ) : (
              <>
                {wordLimit}{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "#242426",
                    fontSize: { xs: "12px", lg: "14px" },
                  }}
                >
                  Words
                </Typography>
              </>
            )}
          </Typography>

          <Tooltip title="Clear text" placement="top" arrow>
            <IconButton
              aria-label="delete"
              size={isMobile ? "small" : "large"}
              variant={"outlined"}
              color="inherit"
              disabled={isLoading}
              onClick={handleClearInput}
              style={{ marginLeft: "-4px" }}
              disableRipple
            >
              {/* <DeleteRounded sx={{ color: "text.secondary" }} /> */}
              <Image
                src={"/icons/delete.svg"}
                alt="delete"
                width={20}
                height={20}
              />
            </IconButton>
          </Tooltip>
          {freeze_modal ? (
            <>
              <Tooltip title="Freeze Words" placement="top" arrow>
                <IconButton
                  id="show_freeze_button"
                  aria-label="freeze"
                  size={isMobile ? "small" : "large"}
                  variant={"outlined"}
                  color="inherit"
                  disabled={false}
                  onClick={handleToggleFreeze}
                  style={{ marginLeft: "-12px" }}
                  disableRipple
                  ref={anchorRef}
                >
                  <Image
                    src={
                      show_freeze
                        ? "/icons/freeze-active.svg"
                        : "/icons/freeze.svg"
                    }
                    alt="freeze"
                    width={20}
                    height={20}
                  />
                </IconButton>
              </Tooltip>
              <Popper
                open={show_freeze}
                anchorEl={anchorRef.current}
                placement="top-start"
                disablePortal={false}
                modifiers={[
                  {
                    name: "flip",
                    enabled: true,
                    options: {
                      altBoundary: true,
                      rootBoundary: "viewport",
                      createPopper: {
                        strategy: "fixed",
                      },
                    },
                  },
                  {
                    name: "preventOverflow",
                    enabled: true,
                    options: {
                      altAxis: true,
                      altBoundary: true,
                      tether: true,
                      rootBoundary: "viewport",
                      padding: 8,
                    },
                  },
                  {
                    name: "offset",
                    options: {
                      offset: [0, 8], // Example: 0px horizontal skidding, 8px vertical distance from anchor
                    },
                  },
                ]}
                sx={{ zIndex: 1300 }}
              >
                <ClickAwayListener onClickAway={handleCloseFreeze}>
                  <Paper>
                    <FreezeWordsContent
                      close={handleCloseFreeze}
                      readOnly={isLoading}
                      freeze_props={freeze_props}
                    />
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </>
          ) : null}
        </Stack>
        {ExtraCounter}
      </Stack>

      <Stack
        sx={{
          flexDirection: "row",
          gap: 2,
          flex: 1,
          justifyContent: {
            md: children ? "center" : "flex-end",
            xs: "flex-end",
          },
        }}
      >
        {wordCount > wordLimit && userPackage !== "unlimited" && (
          <Link href="/pricing">
            <Button
              sx={{ py: { md: 0 }, px: { md: 2 }, height: { md: 40 } }}
              variant="contained"
              startIcon={
                <SvgColor
                  src="/navbar/diamond.svg"
                  sx={{ width: { xs: 20, md: 20 }, height: { xs: 20, md: 20 } }}
                />
              }
            >
              Upgrade
            </Button>
          </Link>
        )}
        <Button
          onClick={() => handleSubmit()}
          variant="contained"
          loading={isLoading}
          disabled={!dontDisable ? wordCount > wordLimit : btnDisabled || false}
          sx={{
            py: { md: 0 },
            px: { md: 2 },
            height: { md: 40 },
            whiteSpace: "nowrap",
          }}
          // startIcon={btnIcon}
        >
          {btnText}
        </Button>
        {ExtraBtn}
      </Stack>

      {children && (
        <Stack
          sx={{
            flexDirection: "row",
            gap: 2,
            flex: {
              md: 1,
            },
            justifyContent: {
              md: "flex-end",
            },
          }}
        >
          {children}
        </Stack>
      )}
    </Stack>
  );
};

export default WordCounter;
