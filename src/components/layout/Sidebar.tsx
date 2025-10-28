import { Box } from "@mui/material";
import checkmarkImage from "./../../assets/Checkmark_1759923653930.png";
import paraphraseIcon from "./../../assets/Paraphrase_1759908407164.png";
import humanizeIcon from "./../../assets/Humanize GPT_1759908388806.png";
import aiDetectorIcon from "./../../assets/AI Detector_1759908376738.png";
import grammarIcon from "./../../assets/Grammar Fix_1759908381522.png";
import summarizeIcon from "./../../assets/Summarize_1759908412611.png";
import translatorIcon from "./../../assets/Translator_1759908416747.png";
import agentIcon from "./../../assets/Agent_1759908370558.png";
import marketingIcon from "./../../assets/Marketing Automation_1759908397767.png";

const mainNavItems = [
  { 
    icon: paraphraseIcon,
    label: "Paraphrase", 
    active: true 
  },
  { 
    icon: humanizeIcon,
    label: "Humanize GPT" 
  },
  { 
    icon: aiDetectorIcon,
    label: "AI Detector" 
  },
  { 
    icon: grammarIcon,
    label: "Grammar Fix" 
  },
  { 
    icon: summarizeIcon,
    label: "Summarize" 
  },
  { 
    icon: translatorIcon,
    label: "Translator" 
  },
  { 
    icon: agentIcon,
    label: "Agent" 
  },
];

const bottomNavItem = { 
  icon: marketingIcon,
  label: "Marketing Automation" 
};

export default function Sidebar() {
  return (
    <Box
      component="aside"
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: 80,
        borderRight: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,  // Ultra-fine line: 6% white in dark, 4% black in light
        bgcolor: (theme) => theme.palette.mode === 'dark' 
          ? '#000000'  // Same deep black as background
          : 'rgba(255, 255, 255, 0.7)',  // Translucent white for infinite effect
        backdropFilter: (theme) => theme.palette.mode === 'dark' 
          ? 'none'  // No blur effect in dark mode for sidebar
          : 'blur(20px) saturate(180%)',  // Apple's glass effect in light mode
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <Box
          component="img"
          src={checkmarkImage.src}
          alt="Shothik AI"
          sx={{
            width: 48,
            height: 48,
            objectFit: 'contain',
          }}
        />
      </Box>

      <Box
        component="nav"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          flex: 1,
        }}
      >
        {mainNavItems.map((item, index) => (
          <Box
            key={index}
            component="button"
            data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: item.active ? 'primary.main' : 'text.secondary',
              transition: 'color 0.2s',
              '&:hover': {
                color: item.active ? 'primary.main' : 'text.primary',
              },
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: item.active 
                  ? 'rgba(0, 167, 111, 0.1)' // Subtle green for active state
                  : 'transparent',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: item.active 
                    ? 'rgba(0, 167, 111, 0.15)'
                    : (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)',
                },
              }}
            >
              <Box
                component="img"
                src={item.icon.src}
                alt={item.label}
                sx={{
                  width: 32,
                  height: 32,
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: '9px',
                textAlign: 'center',
                lineHeight: 1.2,
                maxWidth: '70px',
              }}
            >
              {item.label}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Box
          component="button"
          data-testid={`nav-${bottomNavItem.label.toLowerCase().replace(/\s+/g, '-')}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: 'text.secondary',
            transition: 'color 0.2s',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.03)',
              },
            }}
          >
            <Box
              component="img"
              src={bottomNavItem.icon.src}
              alt={bottomNavItem.label}
              sx={{
                width: 32,
                height: 32,
                objectFit: 'contain',
              }}
            />
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: '9px',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '70px',
            }}
          >
            {bottomNavItem.label}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
