import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

export default function OneMoreThing() {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 16, md: 24 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF'
      }}
    >
      <Box sx={{ maxWidth: 896, mx: 'auto', px: { xs: 4, md: 8 }, textAlign: 'center', position: 'relative' }}>
        <Typography 
          variant="overline"
          sx={{ 
            display: 'block',
            color: 'text.secondary',
            mb: 3,
            letterSpacing: '0.1em'
          }}
        >
          And one more thing...
        </Typography>
        
        <Typography 
          variant="h1"
          sx={{ 
            mb: 3,
            lineHeight: 1.2,
            fontWeight: 700,
            color: 'text.primary'
          }}
        >
          Meta Andromeda<br />powered ads.
        </Typography>
        
        <Typography 
          variant="h5"
          sx={{ 
            mb: 6,
            fontWeight: 400,
            maxWidth: 672,
            mx: 'auto',
            color: 'text.secondary'
          }}
        >
          Create Facebook & Instagram ads that actually convert. Automatically.
        </Typography>

        <Card 
          sx={{ 
            p: { xs: 4, md: 6 },
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            boxShadow: '0 20px 60px rgba(24, 119, 242, 0.2)',
            mb: 4,
            borderRadius: 4,
            overflow: 'visible',
            border: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 4,
              textAlign: 'left'
            }}
          >
            <Box>
              <Typography 
                variant="h4"
                sx={{ 
                  mb: 1.5,
                  fontWeight: 700,
                  color: 'text.primary'
                }}
              >
                8-15 creative variants
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontWeight: 400, color: 'text.secondary' }}
              >
                Persona-based ad copy for every audience stage.
              </Typography>
            </Box>
            <Box>
              <Typography 
                variant="h4"
                sx={{ 
                  mb: 1.5,
                  fontWeight: 700,
                  color: 'text.primary'
                }}
              >
                All formats supported
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontWeight: 400, color: 'text.secondary' }}
              >
                Reels, carousel, static, video—all optimized.
              </Typography>
            </Box>
          </Box>
        </Card>

        <Button 
          size="large"
          variant="contained"
          color="secondary"
          startIcon={<AutoAwesome />}
          data-testid="button-try-meta-ads"
        >
          Try Meta Ad Automation
        </Button>
      </Box>
    </Box>
  );
}
