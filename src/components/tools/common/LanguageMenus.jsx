import { Close, Search } from "@mui/icons-material";
import {
  Box,
  Drawer,
  FormControl,
  Menu,
  MenuItem,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { languages } from "../../../_mock/tools/languages";
import useResponsive from "../../../hooks/useResponsive";

const RenderLanguages = ({ handleLanguageMenu, handleClose }) => {
  const [selectedLanguage, setLanguage] = useState("");

  return (
    <>
      <FormControl
        sx={{
          p: { xs: 2, md: 1 },
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "background.paper",
        }}
        variant='outlined'
      >
        <OutlinedInput
          id='search-language'
          type='text'
          value={selectedLanguage}
          onChange={(e) => setLanguage(e.target.value)}
          endAdornment={<Search color='secondary' />}
          placeholder='Search language...'
          size='small'
        />
      </FormControl>

      <Box
        sx={{
          maxHeight: { xs: "60vh", md: "50vh" },
          overflowY: "auto",
          mt: { xs: 0, md: 1 },
        }}
      >
        {languages
          .filter((item) =>
            item.name.toLowerCase().includes(selectedLanguage.toLowerCase())
          )
          .map((language, index) => (
            <MenuItem
              key={index}
              selected={language.name.toLowerCase === selectedLanguage}
              onClick={() => {
                setLanguage(language.name);
                handleLanguageMenu(language.name);
                handleClose();
              }}
              sx={{ whiteSpace: "wrap", overflowWrap: "break-word" }}
            >
              {language.name}
            </MenuItem>
          ))}
      </Box>
    </>
  );
};

const LanguageMenus = ({ open, anchorEl, handleClose, handleLanguageMenu }) => {
  const isMobile = useResponsive("down", "sm");

  return (
    <>
      {isMobile ? (
        <Drawer
          anchor='bottom'
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiPaper-root": {
              borderTopRightRadius: "16px",
              borderTopLeftRadius: "16px",
            },
          }}
        >
          <Box sx={{ height: "50vh" }}>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              sx={{ pt: 2, px: 2 }}
            >
              <Typography variant='subtitle1'>Select language</Typography>
              <Close color='secondary' onClick={handleClose} />
            </Stack>
            <RenderLanguages
              handleClose={handleClose}
              handleLanguageMenu={handleLanguageMenu}
            />
          </Box>
        </Drawer>
      ) : (
        <Menu
          id='lock-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: { "aria-labelledby": "lock-button", role: "listbox" },
            paper: { style: { width: "550px" } },
          }}
        >
          <RenderLanguages
            handleClose={handleClose}
            handleLanguageMenu={handleLanguageMenu}
          />
        </Menu>
      )}
    </>
  );
};

export default LanguageMenus;
