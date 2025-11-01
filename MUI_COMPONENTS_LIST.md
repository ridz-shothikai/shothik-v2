# MUI Components Inventory

This document lists all Material-UI (MUI) components found in `src/app` and `src/components` directories and their subdirectories.

## From @mui/material (Main Components)

### Layout Components

- **Box** - Most commonly used layout component
- **Container** - Container component for responsive layouts
- **Stack** - Layout component for stacking items
- **Grid** - Grid layout component (legacy)
- **Grid2** - Modern Grid layout component (v5+)

### Navigation Components

- **AppBar** - Application bar/navbar
- **Toolbar** - Toolbar component
- **Menu** - Menu component
- **MenuItem** - Menu item component
- **Tabs** - Tab navigation
- **Tab** - Individual tab
- **Drawer** - Drawer/sidebar component
- **Breadcrumbs** - Breadcrumb navigation

### Input Components

- **TextField** - Text input field
- **Button** - Button component
- **IconButton** - Icon button
- **Switch** - Toggle switch
- **Checkbox** - Checkbox input
- **Radio** - Radio button
- **RadioGroup** - Radio button group
- **Select** - Select dropdown
- **Slider** - Slider input
- **Autocomplete** - Autocomplete input
- **InputAdornment** - Input adornment (icons, text)
- **InputLabel** - Input label
- **FormControl** - Form control wrapper
- **FormControlLabel** - Form control with label
- **FormLabel** - Form label

### Feedback Components

- **Alert** - Alert/notification component
- **Snackbar** - Snackbar notification
- **Dialog** - Dialog/modal
- **DialogActions** - Dialog actions
- **DialogContent** - Dialog content
- **DialogContentText** - Dialog content text
- **DialogTitle** - Dialog title
- **Backdrop** - Backdrop overlay
- **CircularProgress** - Circular progress indicator
- **LinearProgress** - Linear progress indicator
- **Skeleton** - Loading skeleton
- **Tooltip** - Tooltip component

### Data Display Components

- **Typography** - Typography/text component
- **Card** - Card component
- **CardContent** - Card content
- **Paper** - Paper surface component
- **Chip** - Chip/badge component
- **List** - List component
- **ListItem** - List item
- **ListItemIcon** - List item icon
- **ListItemText** - List item text
- **Table** - Table component
- **TableBody** - Table body
- **TableCell** - Table cell
- **TableContainer** - Table container
- **TableRow** - Table row
- **Accordion** - Accordion component
- **AccordionSummary** - Accordion summary
- **AccordionDetails** - Accordion details

### Surface Components

- **Paper** - Paper surface
- **Card** - Card surface

### Utility Components

- **Divider** - Divider line
- **Link** - Link component
- **CssBaseline** - CSS baseline reset
- **Fade** - Fade transition
- **Popper** - Popper positioning component
- **Popover** - Popover component

### Theme & Styling Utilities

- **useTheme** - Theme hook
- **useMediaQuery** - Media query hook
- **styled** - Styled component utility
- **alpha** - Color alpha utility (from @mui/material/styles)

## From @mui/icons-material (Icon Components)

### Commonly Used Icons

- **Check** - Check icon
- **Close** - Close/X icon
- **ContentCopy** - Copy icon
- **ArrowUpward** - Up arrow
- **ArrowBack** - Back arrow
- **ArrowBackIosNew** - iOS back arrow
- **ArrowForwardIos** - iOS forward arrow
- **Attachment** - Attachment icon
- **CloudUpload** - Cloud upload icon
- **AutoAwesome** - Sparkle/star icon
- **DeleteOutline** - Delete icon
- **ExpandMore** - Expand more icon
- **ExpandMoreIcon** - Expand more (alias)
- **Email** - Email icon
- **FileDownload** - Download icon
- **PictureAsPdf** - PDF icon
- **PlayArrow** - Play arrow icon
- **Share** - Share icon
- **ShareIcon** - Share (alias)
- **Twitter** - Twitter icon
- **LinkedIn** - LinkedIn icon
- **WhatsApp** - WhatsApp icon
- **Link** - Link icon
- **LinkIcon** - Link (alias)
- **Description** - Document icon
- **Image** - Image icon
- **ImageIcon** - Image (alias)
- **Edit** - Edit icon
- **EditIcon** - Edit (alias)
- **KeyboardArrowDown** - Down arrow
- **VerticalAlignBottom** - Vertical align bottom
- **Lock** - Lock icon
- **Visibility** - Visibility icon
- **VisibilityIcon** - Visibility (alias)
- **Comment** - Comment icon
- **Schedule** - Schedule/calendar icon
- **Download** - Download icon
- **Person** - Person icon
- **PersonIcon** - Person (alias)
- **Search** - Search icon
- **SearchIcon** - Search (alias)
- **Slideshow** - Slideshow icon
- **SlideshowIcon** - Slideshow (alias)
- **SmartToy** - Smart toy/robot icon
- **SmartToyIcon** - Smart toy (alias)
- **Palette** - Palette icon
- **PaletteIcon** - Palette (alias)
- **Chat** - Chat icon
- **ChatIcon** - Chat (alias)
- **Task** - Task icon
- **CheckCircle** - Check circle icon
- **CheckCircleIcon** - Check circle (alias)
- **Lightbulb** - Lightbulb/innovation icon
- **InnovationIcon** - Innovation (alias)
- **School** - School icon
- **SchoolIcon** - School (alias)
- **SwapHoriz** - Swap horizontal
- **SwapHorizIcon** - Swap horizontal (alias)
- **Spellcheck** - Spellcheck icon
- **SpellcheckIcon** - Spellcheck (alias)
- **Summarize** - Summarize icon
- **SummarizeIcon** - Summarize (alias)
- **Translate** - Translate icon
- **TranslateIcon** - Translate (alias)
- **AutoFixHigh** - Auto fix icon
- **AutoFixHighIcon** - Auto fix (alias)
- **Campaign** - Campaign icon
- **CampaignIcon** - Campaign (alias)
- **Refresh** - Refresh icon
- **ExpandMore** - Expand more icon

## From @mui/system (System Utilities)

- **Stack** - Stack component from system package
- **alpha** - Color alpha utility (also available from @mui/material/styles)

## From @mui/material/styles (Style Utilities)

- **createTheme** - Theme creator
- **ThemeProvider** - Theme provider (as MUIThemeProvider)
- **StyledEngineProvider** - Styled engine provider
- **useTheme** - Theme hook
- **styled** - Styled component function
- **alpha** - Color alpha utility function

## Components Found in Config Overrides

These components have custom overrides defined in `src/config/mui/overrides/`:

1. Fab
2. Card
3. Chip
4. Tabs
5. Menu
6. Link
7. Lists (List)
8. Table
9. Alert
10. Badge
11. Paper
12. Input
13. Radio
14. Drawer
15. Dialog
16. Avatar
17. Rating
18. Slider
19. Button
20. Switch
21. Select
22. SvgIcon
23. Tooltip
24. Popover
25. Stepper
26. DataGrid
27. Skeleton
28. Backdrop
29. Progress
30. Timeline
31. TreeView
32. Checkbox
33. Accordion
34. Typography
35. Pagination
36. ButtonGroup
37. Autocomplete
38. ToggleButton
39. ControlLabel
40. LoadingButton

## Summary Statistics

- **Total @mui/material components found**: ~60+ unique components
- **Total @mui/icons-material icons found**: ~50+ unique icons
- **Total @mui/system utilities**: 2
- **Total @mui/material/styles utilities**: 5+

## Files with Most MUI Usage

1. `src/components/slide/SlidePreviewNavbar.jsx` - Uses ~35 MUI components
2. `src/components/share/ShareModal.jsx` - Uses ~15 MUI components
3. `src/components/presentation/PresentationAgentPage.tsx` - Uses ~10 MUI components
4. `src/components/tools/research/MarkdownRenderer.jsx` - Uses ~10 MUI components
5. `src/components/tools/aidetector/AiDetector.jsx` - Uses ~10 MUI components

## Notes

- The codebase uses MUI v5 (Material-UI v5)
- Most components are imported from `@mui/material`
- Icons are imported from `@mui/icons-material`
- Some components have custom overrides in `src/config/mui/overrides/`
- The theme configuration is in `src/config/mui/`
