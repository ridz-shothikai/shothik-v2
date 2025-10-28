import { Box, Typography, Button } from "@mui/material";

export default function FinalCTA() {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 16, md: 24 },
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF'
      }}
    >
      <Box sx={{ maxWidth: 768, mx: 'auto', px: { xs: 4, md: 8 }, textAlign: 'center' }}>
        <Typography 
          variant="h1"
          sx={{ 
            mb: 6,
            lineHeight: 1.2,
            fontWeight: 700,
            color: 'text.primary'
          }}
        >
          Ready to begin?
        </Typography>

        <Button 
          size="large"
          variant="contained"
          color="primary"
          data-testid="button-get-started-final"
          sx={{ mb: 2 }}
        >
          Get Started
        </Button>

        <Typography 
          variant="body2"
          sx={{ 
            color: 'text.secondary',
            fontWeight: 400
          }}
        >
          No credit card required
        </Typography>
      </Box>
    </Box>
  );
}
