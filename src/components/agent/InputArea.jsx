import { keyframes } from "@emotion/react";
import { AttachFile, AutoMode, Send, SmartToy } from "@mui/icons-material";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { useRef, useState } from "react";

export const loadingSpin = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

export default function InputArea({ addChatHistory, loading, showTitle }) {
  const [files, setFiles] = useState(null);
  const [value, setValue] = useState("");
  const filesRef = useRef(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!value) return;

    addChatHistory({ message: value, files }, "user");
    setValue("");
    setFiles(null);
  };

  const handleFileInputClick = () => {
    if (!filesRef.current) return;
    filesRef.current.click();
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    setFiles(files);
  };

  return (
    <Box>
      {showTitle && (
        <Typography
          fontWeight={600}
          fontSize={22}
          mb={2}
          textAlign='center'
          sx={{ color: "primary.main" }}
        >
          Shothik AI multi Agent solution
        </Typography>
      )}
      <Box
        component='form'
        onSubmit={handleAdd}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: "8px",
        }}
      >
        <SmartToy sx={{ color: "#00A76F", mr: 1 }} />
        <TextField
          fullWidth
          variant='standard'
          placeholder='Give a task to Shothik AI Agent'
          slotProps={{
            input: { disableUnderline: true },
          }}
          value={value}
          sx={{ minWidth: 300 }}
          onChange={(e) => setValue(e.target.value)}
        />

        <input
          type='file'
          ref={filesRef}
          hidden
          accept='.pdf,.jpg,.jpeg,.png'
          multiple
          onChange={handleInputChange}
        />

        <Tooltip
          title={
            filesRef?.current?.files?.length
              ? `${filesRef.current.files.length} Files selected`
              : "Attach files"
          }
        >
          <IconButton
            sx={{
              position: "relative",
              "&:hover .filesCount": { display: "none" },
            }}
            onClick={handleFileInputClick}
            type='button'
          >
            {files ? (
              <Typography
                sx={{ position: "absolute", top: -5, right: 5 }}
                className='filesCount'
                fontSize={14}
              >
                {Array.from(files).length}
              </Typography>
            ) : null}
            <AttachFile fontSize='small' />
          </IconButton>
        </Tooltip>

        <IconButton disabled={loading} type='submit' color='primary'>
          {loading ? (
            <AutoMode
              sx={{
                animation: `${loadingSpin} 1s linear infinite`,
                color: "primary.main",
              }}
            />
          ) : (
            <Send />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}
