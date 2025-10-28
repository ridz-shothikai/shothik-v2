import { useState } from "react";
import { 
  AppBar, 
  Box, 
  Button, 
  IconButton, 
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Popover,
} from "@mui/material";
import { 
  Menu as MenuIcon,
  Close,
  LightMode,
  DarkMode,
  KeyboardArrowDown,
  Edit,
  AutoAwesome,
  Psychology,
  Spellcheck,
  Translate,
  Science,
  BarChart,
  Slideshow,
  Assessment,
  Lightbulb,
  Collections,
  Palette,
  Article,
  Brush,
  Image,
  RocketLaunch,
  AccountTree,
  TrendingUp,
} from "@mui/icons-material";
import logo from "./../../assets/Logo_(3)_1760613683127.png";
import { useThemeMode } from "./../../contexts/ThemeContext";

const navLinks = [
  { label: "Use Case", href: "#product-suites" },
  { label: "Community", href: "#community" },
  { label: "Pricing", href: "#pricing" },
];

// Mega menu content for Features dropdown
const featuresMenuContent = {
  writing: {
    title: "Writing",
    items: [
      { label: "Paraphraser", icon: Edit, href: "/features#paraphraser" },
      { label: "AI Detector", icon: Psychology, href: "/features#ai-detector" },
      { label: "Humanizer", icon: AutoAwesome, href: "/features#humanizer" },
      { label: "Grammar Checker", icon: Spellcheck, href: "/features#grammar" },
      { label: "Translator", icon: Translate, href: "/features#translator" },
    ],
  },
  agents: {
    title: "Agents",
    items: [
      { label: "AI Slides", icon: Slideshow, href: "/features#ai-slides" },
      { label: "Deep Research", icon: Science, href: "/features#research" },
      { label: "Data Analysis", icon: BarChart, href: "/features#data-analysis" },
    ],
  },
  vibeMetaAutomation: {
    title: "Vibe Meta Automation",
    items: [
      { label: "Product / Service Analysis", icon: Assessment, href: "/features#product-analysis" },
      { label: "AI Strategy Generation", icon: Lightbulb, href: "/features#ai-strategy" },
      { label: "AI Ad Sets", icon: Collections, href: "/features#ai-ad-sets" },
      { label: "AI Ad Creatives", icon: Palette, href: "/features#ai-ad-creatives" },
      { label: "AI Ad Copies & Ads", icon: Article, href: "/features#ai-ad-copies" },
      { label: "AI-Powered Editing (Meta Vibe Canvas)", icon: Brush, href: "/features#vibe-canvas" },
      { label: "AI Media Canvas", icon: Image, href: "/features#media-canvas" },
      { label: "Ad Launch & Campaign Execution", icon: RocketLaunch, href: "/features#ad-launch" },
      { label: "Mindmap & Reports", icon: AccountTree, href: "/features#mindmap-reports" },
      { label: "AI Optimization", icon: TrendingUp, href: "/features#ai-optimization" },
    ],
  },
};

export default function ShothikHeader() {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresAnchorEl, setFeaturesAnchorEl] = useState<null | HTMLElement>(null);

  const handleFeaturesOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFeaturesAnchorEl(event.currentTarget);
  };

  const handleFeaturesClose = () => {
    setFeaturesAnchorEl(null);
  };

  const isFeaturesOpen = Boolean(featuresAnchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        right: 0,
        left: { xs: 64, md: 80 },
        zIndex: 40,
        bgcolor: (theme) => theme.palette.mode === 'dark' 
          ? '#000000'  // Same pure black as background for infinite effect
          : 'rgba(255, 255, 255, 0.7)',  // Pure white translucent for infinite effect
        backdropFilter: (theme) => theme.palette.mode === 'dark'
          ? 'none'  // No blur in dark mode - pure black blends infinitely
          : 'blur(20px) saturate(180%)',  // Apple's glass effect for infinite blend in light
        boxShadow: 'none',  // Remove shadow for infinite effect
        borderBottom: 'none'  // No border for seamless infinite effect
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          px: { xs: 2, md: 4 },
          gap: 3,
          bgcolor: (theme) => theme.palette.mode === 'dark' 
            ? '#000000'  // Same pure black as background
            : 'transparent',  // Transparent in light mode
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            component="img"
            src={logo.src}
            alt="Shothik AI"
            data-testid="logo-header"
            sx={{
              height: 20,  // Ultra compact - 31% of header height
              maxWidth: 100,  // Consistent width constraint
              width: 'auto',
              objectFit: 'contain',
            }}
          />

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Features Dropdown */}
              <Button
                data-testid="nav-features"
                onClick={handleFeaturesOpen}
                onMouseEnter={handleFeaturesOpen}
                endIcon={<KeyboardArrowDown sx={{ fontSize: 16 }} />}
                sx={{
                  color: isFeaturesOpen ? 'primary.main' : 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  px: 1.5,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Features
              </Button>

              {/* Other Nav Links */}
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  href={link.href}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    px: 1.5,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: { xs: 0, md: 20 } }}>
          {/* Desktop Elements */}
          {!isMobile && (
            <>
              {/* Theme Toggle */}
              <IconButton
                data-testid="button-theme-toggle"
                onClick={toggleTheme}
                sx={{
                  color: 'text.primary',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {mode === 'dark' ? <LightMode sx={{ fontSize: 20 }} /> : <DarkMode sx={{ fontSize: 20 }} />}
              </IconButton>

              {/* Join Waitlist CTA */}
              <Button
                variant="contained"
                data-testid="button-join-waitlist"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Join the Waitlist
              </Button>
            </>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              data-testid="button-mobile-menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Features Mega Menu Dropdown */}
      <Popover
        open={isFeaturesOpen}
        anchorEl={featuresAnchorEl}
        onClose={handleFeaturesClose}
        data-testid="features-dropdown"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            onMouseLeave: handleFeaturesClose,
            sx: {
              mt: 1,
              bgcolor: 'background.paper',
              backdropFilter: 'blur(20px)',
              borderRadius: 2,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.8)'
                : '0 8px 32px rgba(0, 0, 0, 0.12)',
              border: 1,
              borderColor: 'divider',
              minWidth: 720,
              maxWidth: 800,
            },
          },
        }}
      >
        <Box sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            {/* Writing Column */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {featuresMenuContent.writing.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {featuresMenuContent.writing.items.map((item) => (
                  <Button
                    key={item.label}
                    href={item.href}
                    data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={handleFeaturesClose}
                    startIcon={<item.icon sx={{ fontSize: 18 }} />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Agents Column */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {featuresMenuContent.agents.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {featuresMenuContent.agents.items.map((item) => (
                  <Button
                    key={item.label}
                    href={item.href}
                    data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={handleFeaturesClose}
                    startIcon={<item.icon sx={{ fontSize: 18 }} />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Vibe Meta Automation Column */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {featuresMenuContent.vibeMetaAutomation.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {featuresMenuContent.vibeMetaAutomation.items.map((item) => (
                  <Button
                    key={item.label}
                    href={item.href}
                    data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={handleFeaturesClose}
                    startIcon={<item.icon sx={{ fontSize: 18 }} />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Popover>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        data-testid="mobile-drawer"
      >
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Menu
            </Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          
          {/* Features Section in Mobile */}
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary' }}>
              Features
            </Typography>
            
            {/* Writing */}
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', display: 'block', mt: 2, mb: 1 }}>
              WRITING
            </Typography>
            {featuresMenuContent.writing.items.map((item) => (
              <ListItem 
                key={item.label}
                component="a"
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                sx={{ py: 0.5, pl: 0 }}
              >
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}

            {/* Agents */}
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', display: 'block', mt: 2, mb: 1 }}>
              AGENTS
            </Typography>
            {featuresMenuContent.agents.items.map((item) => (
              <ListItem 
                key={item.label}
                component="a"
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                sx={{ py: 0.5, pl: 0 }}
              >
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}

            {/* Vibe Meta Automation */}
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', display: 'block', mt: 2, mb: 1 }}>
              VIBE META AUTOMATION
            </Typography>
            {featuresMenuContent.vibeMetaAutomation.items.map((item) => (
              <ListItem 
                key={item.label}
                component="a"
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                sx={{ py: 0.5, pl: 0 }}
              >
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </Box>

          <Divider />
          <List>
            {navLinks.map((link) => (
              <ListItem 
                key={link.label}
                component="a"
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText 
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ px: 2, py: 2 }}>
            <Button
              fullWidth
              startIcon={mode === 'dark' ? <LightMode /> : <DarkMode />}
              onClick={toggleTheme}
              data-testid="mobile-theme-toggle"
              sx={{
                mb: 2,
                justifyContent: 'flex-start',
                color: 'text.primary',
              }}
            >
              {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button
              fullWidth
              variant="contained"
              data-testid="mobile-join-waitlist"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Join the Waitlist
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
