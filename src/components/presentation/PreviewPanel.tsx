"use client";

// components/PreviewPanel.jsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import SlidePreview from './SlidePreview';
import QualityValidationPanel from '../../../components/agents/shared/QualityValidationPanel';
import { Button, Menu, MenuItem } from '@mui/material';
import html2canvas from 'html2canvas';
import {Chart, registerables} from "chart.js";
import { handleAdvancedPptxExport } from '../../libs/presentationExporter';
import { handleNativePptxExport } from '../../libs/nativePresentationExporter';
import { useRouter } from 'next/navigation';
// Do not import PptxGenJS statically at the top
// import PptxGenJS from 'pptxgenjs';

// Register Chart.js components
Chart.register(...registerables);

const PRIMARY_GREEN = '#07B37A';

export default function PreviewPanel({
  currentAgentType,
  slidesData,
  slidesLoading,
  presentationId,
  currentPhase,
  completedPhases,
  presentationBlueprint,
  qualityMetrics,
  validationResult,
  isValidating,
  onApplyAutoFixes,
  onRegenerateWithFeedback
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [previewTab, setPreviewTab] = useState('preview');
  const [slideTabs, setSlideTabs] = useState({});
  const router = useRouter();
  // for export options
  // const [anchorEl, setAnchorEl] = useState(null);
  // const open = Boolean(anchorEl);

  // const handleExportClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleExportClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleImagePptxExport = async () => {
  //   handleExportClose();
  //   if (!slidesData?.data || slidesData.data.length === 0) return;
    
  //   setIsExporting(true);
  //   await handleAdvancedPptxExport(slidesData.data, { fileName: 'presentation-images.pptx' });
  //   setIsExporting(false);
  // };

  // const handleNativePptxExportClick = async () => {
  //   handleExportClose();
  //   if (!slidesData?.data || slidesData.data.length === 0) return;
    
  //   setIsExporting(true);
  //   const result = await handleNativePptxExport(slidesData.data, { fileName: 'presentation-editable.pptx' });
  //   if (!result.success) {
  //     console.error("Native Export Failed:", result.error);
  //     // You can show an error to the user here
  //   }
  //   setIsExporting(false);
  // };

  const handleViewAndExportClick = (id: string) => {
    router.push(`/slides?project_id=${presentationId}`);
  }


  const handleSlideTabChange = (slideIndex, newValue) => {
    setSlideTabs(prev => ({
      ...prev,
      [slideIndex]: newValue,
    }));
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white',
      height: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
    }}>
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0,
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
        '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px', '&:hover': { background: '#a8a8a8' } },
        scrollbarWidth: 'thin',
        scrollbarColor: '#c1c1c1 #f1f1f1',
      }}>
        {previewTab === 'preview' && (
          <Box>
            {currentAgentType === 'presentation' ? (
              <>
                {/* Sticky Header */}
                <Box sx={{
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'white',
                  zIndex: 10,
                  borderBottom: '1px solid #e0e0e0',
                  px: 3,
                  pt: 3,
                  pb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="h6" color="#333">Your Presentation</Typography>
                  <Typography color="#666">
                    {/* <Button
                      aria-controls="export-menu"
                      aria-haspopup="true"
                      onClick={handleExportClick}
                      disabled={isExporting} // Disable button while exporting
                    >
                      {isExporting ? <CircularProgress size={24} /> : 'Export'}
                    </Button>
                    <Menu
                      id="export-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleExportClose}
                    >
                      
                      <MenuItem onClick={handleNativePptxExportClick}>
                          Export as Editable PPTX (Beta)
                      </MenuItem>
                      <MenuItem onClick={handleImagePptxExport}>
                          Export as Image PPTX
                      </MenuItem>
                    </Menu> */}
                    <Button
                      onClick={handleViewAndExportClick}
                    >
                      View & Export
                    </Button>
                  </Typography>
                </Box>

                {/* Scrollable Content */}
                <Box sx={{ p: 3, pt: 0 }}>
                  {slidesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : slidesData?.data?.length > 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 2,
                        pt: 2
                    }}>
                      {slidesData?.data.map((slide, index) => (
                        <SlidePreview
                          key={slide.slide_index}
                          slide={slide}
                          index={index}
                          activeTab={slideTabs[index] || 'preview'}
                          onTabChange={handleSlideTabChange}
                          totalSlides={slidesData?.data?.length}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Card sx={{
                      bgcolor: '#f8f9fa',
                      height: 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e0e0e0',
                      boxShadow: 1,
                      mb: 4
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: PRIMARY_GREEN, mb: 2 }}>
                          Your Presentation Title
                        </Typography>
                        <Typography variant="h6" color="#666">
                          Generated slides will appear here
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', mt: 8, p: 3 }}>
                <Typography color="#666">Agent output will appear here</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}