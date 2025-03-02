// ----------------------------------------------------------------------

export default function Menu(theme) {
  return {
    MuiMenuItem: {
      defaultProps: {
        disableScrollLock: true,
      },
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        },
      },
    },
  };
}
